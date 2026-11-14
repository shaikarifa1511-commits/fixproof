import { getSupabaseServerClient, isSupabaseServerConfigured } from '@/lib/supabase/server';
import {
  AIVerificationResult,
  Dispute,
  EvidenceAsset,
  HumanReview,
  ProblemCategory,
  PublicAnalytics,
  Report,
  TimelineEvent,
  VerificationStatus,
  WorkStatus,
} from '@/lib/types';

/**
 * Supabase PostgreSQL Database Adapter for FixProof
 * Executes queries against Supabase tables with RLS and service role access.
 */

export async function getReportFromSupabase(idOrCaseNumber: string): Promise<Report | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  // 1. Fetch Report
  const { data: reportRow, error: reportErr } = await supabase
    .from('reports')
    .select('*')
    .or(`id.eq.${idOrCaseNumber},case_number.eq.${idOrCaseNumber}`)
    .maybeSingle();

  if (reportErr || !reportRow) return null;

  const reportId = reportRow.id;

  // 2. Fetch Evidence Assets
  const { data: evidenceRows } = await supabase
    .from('evidence_assets')
    .select('*')
    .eq('report_id', reportId);

  let beforeEvidence: EvidenceAsset | undefined;
  let afterEvidence: EvidenceAsset | undefined;
  let reinspectionEvidence: EvidenceAsset | undefined;

  for (const r of evidenceRows || []) {
    const asset: EvidenceAsset = {
      id: r.id,
      reportId: r.report_id,
      stage: r.stage,
      uploaderId: r.uploader_id,
      uploaderRole: r.uploader_role,
      imageUrl: r.image_url,
      sha256Hash: r.sha256_hash,
      perceptualHash: r.perceptual_hash,
      latitude: r.latitude ? Number(r.latitude) : undefined,
      longitude: r.longitude ? Number(r.longitude) : undefined,
      accuracyMeters: r.accuracy_meters ? Number(r.accuracy_meters) : undefined,
      isBlurred: Boolean(r.is_blurred),
      notes: r.notes,
      metadata: r.metadata || {},
      capturedAt: r.captured_at,
      uploadedAt: r.uploaded_at,
    };
    if (r.stage === 'before') beforeEvidence = asset;
    else if (r.stage === 'after') afterEvidence = asset;
    else if (r.stage === 'reinspection') reinspectionEvidence = asset;
  }

  // 3. Fetch latest AI verification
  const { data: aiRow } = await supabase
    .from('verification_results')
    .select('*')
    .eq('report_id', reportId)
    .order('processed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let latestAiVerification: AIVerificationResult | undefined;
  if (aiRow) {
    latestAiVerification = {
      id: aiRow.id,
      reportId: aiRow.report_id,
      category: aiRow.category as ProblemCategory,
      comparison: {
        sameSceneAssessment: aiRow.same_scene_assessment,
        imageQuality: aiRow.image_quality,
        locationEvidence: aiRow.location_evidence,
        timeEvidence: aiRow.time_evidence,
      },
      findings: {
        originalDefectVisible: Boolean(aiRow.original_defect_visible),
        remainingDefectVisible: Boolean(aiRow.remaining_defect_visible),
        repairAssessment: aiRow.repair_assessment,
      },
      confidenceScore: aiRow.confidence_score ? Number(aiRow.confidence_score) : undefined,
      confidenceExplanation: aiRow.confidence_explanation || '',
      explanation: aiRow.explanation,
      needsHumanReview: Boolean(aiRow.needs_human_review),
      modelVersion: aiRow.model_version || 'gemini-1.5-flash',
      processedAt: aiRow.processed_at,
      duplicateDetected: Boolean(aiRow.duplicate_detected),
      sceneSimilarityScore: aiRow.scene_similarity_score ? Number(aiRow.scene_similarity_score) : undefined,
      boundingBoxes: aiRow.bounding_boxes || undefined,
      verdict: aiRow.repair_assessment,
    };
  }

  // 4. Fetch citizen dispute/challenge
  const { data: disputeRow } = await supabase
    .from('citizen_challenges')
    .select('*')
    .eq('report_id', reportId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let dispute: Dispute | undefined;
  if (disputeRow) {
    dispute = {
      id: disputeRow.id,
      reportId: disputeRow.report_id,
      complainantId: disputeRow.citizen_id,
      complainantName: disputeRow.citizen_name,
      reason: disputeRow.reason,
      reinspectionEvidenceId: disputeRow.evidence_id,
      reinspectionImageUrl: disputeRow.reinspection_image_url,
      status: disputeRow.status,
      moderatorVerdict: disputeRow.moderator_notes,
      createdAt: disputeRow.created_at,
      resolvedAt: disputeRow.resolved_at,
    };
  }

  // 5. Fetch audit timeline
  const { data: auditRows } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('report_id', reportId)
    .order('created_at', { ascending: true });

  const timeline: TimelineEvent[] = (auditRows || []).map((a) => ({
    id: a.id,
    reportId: a.report_id,
    actorId: a.actor_id,
    actorName: a.actor_name,
    actorRole: a.actor_role,
    eventType: a.action as any,
    description: a.new_value || a.action,
    metadata: a.metadata || {},
    createdAt: a.created_at,
  }));

  return {
    id: reportRow.id,
    caseNumber: reportRow.case_number,
    citizenId: reportRow.citizen_id,
    citizenName: reportRow.citizen_name,
    assignedTo: reportRow.assigned_to,
    category: reportRow.category as ProblemCategory,
    title: reportRow.title,
    description: reportRow.description,
    address: reportRow.address,
    latitude: Number(reportRow.latitude),
    longitude: Number(reportRow.longitude),
    locationAccuracyMeters: reportRow.location_accuracy_meters ? Number(reportRow.location_accuracy_meters) : 5,
    workStatus: reportRow.work_status as WorkStatus,
    verificationStatus: reportRow.verification_status as VerificationStatus,
    isSynthetic: Boolean(reportRow.is_synthetic),
    createdAt: reportRow.created_at,
    updatedAt: reportRow.updated_at,
    beforeEvidence,
    afterEvidence,
    reinspectionEvidence,
    latestAiVerification,
    dispute,
    timeline,
  };
}

export async function getAllReportsFromSupabase(filters: {
  category?: string;
  workStatus?: string;
  verificationStatus?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<Report[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  let query = supabase.from('reports').select('*').order('created_at', { ascending: false });

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.workStatus && filters.workStatus !== 'all') {
    query = query.eq('work_status', filters.workStatus);
  }
  if (filters.verificationStatus && filters.verificationStatus !== 'all') {
    query = query.eq('verification_status', filters.verificationStatus);
  }
  if (filters.search) {
    const s = filters.search.trim();
    query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%,address.ilike.%${s}%,case_number.ilike.%${s}%`);
  }
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data: rows, error } = await query;
  if (error || !rows) return [];

  // Fetch associated evidence assets for previews
  const reportIds = rows.map((r) => r.id);
  const { data: evidenceRows } = await supabase
    .from('evidence_assets')
    .select('*')
    .in('report_id', reportIds);

  const evidenceMap = new Map<string, { before?: EvidenceAsset; after?: EvidenceAsset }>();
  for (const e of evidenceRows || []) {
    const entry = evidenceMap.get(e.report_id) || {};
    const asset: EvidenceAsset = {
      id: e.id,
      reportId: e.report_id,
      stage: e.stage,
      uploaderId: e.uploader_id,
      uploaderRole: e.uploader_role,
      imageUrl: e.image_url,
      sha256Hash: e.sha256_hash,
      perceptualHash: e.perceptual_hash,
      latitude: e.latitude ? Number(e.latitude) : undefined,
      longitude: e.longitude ? Number(e.longitude) : undefined,
      accuracyMeters: e.accuracy_meters ? Number(e.accuracy_meters) : undefined,
      isBlurred: Boolean(e.is_blurred),
      notes: e.notes,
      capturedAt: e.captured_at,
      uploadedAt: e.uploaded_at,
    };
    if (e.stage === 'before') entry.before = asset;
    else if (e.stage === 'after') entry.after = asset;
    evidenceMap.set(e.report_id, entry);
  }

  return rows.map((r) => ({
    id: r.id,
    caseNumber: r.case_number,
    citizenId: r.citizen_id,
    citizenName: r.citizen_name,
    assignedTo: r.assigned_to,
    category: r.category as ProblemCategory,
    title: r.title,
    description: r.description,
    address: r.address,
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    locationAccuracyMeters: r.location_accuracy_meters ? Number(r.location_accuracy_meters) : 5,
    workStatus: r.work_status as WorkStatus,
    verificationStatus: r.verification_status as VerificationStatus,
    isSynthetic: Boolean(r.is_synthetic),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    beforeEvidence: evidenceMap.get(r.id)?.before,
    afterEvidence: evidenceMap.get(r.id)?.after,
  }));
}

export async function createReportInSupabase(report: Partial<Report>): Promise<Report> {
  const supabase = getSupabaseServerClient();
  const caseNumber = report.caseNumber || `FP-${String(Math.floor(100000 + Math.random() * 900000))}`;
  const id = report.id || caseNumber;
  const now = new Date().toISOString();

  const insertData = {
    id,
    case_number: caseNumber,
    citizen_id: report.citizenId || 'user_cit_1',
    citizen_name: report.citizenName || 'Aditi Sharma',
    assigned_to: report.assignedTo || 'Municipal Corporation',
    category: report.category || 'pothole',
    title: report.title || 'Civic Infrastructure Defect',
    description: report.description || '',
    address: report.address || 'Public Location',
    latitude: report.latitude || 12.9716,
    longitude: report.longitude || 77.5946,
    location_accuracy_meters: report.locationAccuracyMeters || 5.0,
    status: 'SUBMITTED',
    work_status: 'submitted',
    verification_status: 'not_assessed',
    is_synthetic: Boolean(report.isSynthetic),
    created_at: now,
    updated_at: now,
  };

  if (supabase) {
    await supabase.from('reports').insert(insertData);
    await supabase.from('audit_logs').insert({
      id: `audit_${Date.now()}`,
      report_id: id,
      actor_id: insertData.citizen_id,
      actor_name: insertData.citizen_name,
      actor_role: 'citizen',
      action: 'reported',
      new_value: `Report filed: "${insertData.title}" [Category: ${insertData.category}]`,
      created_at: now,
    });
  }

  return {
    id: insertData.id,
    caseNumber: insertData.case_number,
    citizenId: insertData.citizen_id,
    citizenName: insertData.citizen_name,
    assignedTo: insertData.assigned_to,
    category: insertData.category as ProblemCategory,
    title: insertData.title,
    description: insertData.description,
    address: insertData.address,
    latitude: insertData.latitude,
    longitude: insertData.longitude,
    locationAccuracyMeters: insertData.location_accuracy_meters,
    workStatus: 'submitted',
    verificationStatus: 'not_assessed',
    isSynthetic: insertData.is_synthetic,
    createdAt: insertData.created_at,
    updatedAt: insertData.updated_at,
  };
}

export async function getPublicAnalyticsFromSupabase(): Promise<PublicAnalytics> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    throw new Error('Supabase client not configured');
  }

  const { data: reports } = await supabase.from('reports').select('category, work_status, verification_status');
  const { count: claimsCount } = await supabase.from('repair_claims').select('*', { count: 'exact', head: true });
  const { count: challengesCount } = await supabase.from('citizen_challenges').select('*', { count: 'exact', head: true });

  const totalReports = reports?.length || 0;
  const categories: Record<ProblemCategory, number> = { pothole: 0, garbage: 0, footpath: 0, drainage: 0, infrastructure: 0 };
  const workStatuses: Record<WorkStatus, number> = { submitted: 0, under_review: 0, work_scheduled: 0, in_progress: 0, repair_claimed: 0, closed: 0, reopened: 0 };
  const verifications: Record<VerificationStatus, number> = {
    not_assessed: 0, awaiting_after_evidence: 0, ai_pending: 0, appears_resolved: 0, appears_unresolved: 0,
    partially_resolved: 0, insufficient_evidence: 0, human_review_required: 0, human_verified_resolved: 0, human_verified_unresolved: 0
  };

  for (const r of reports || []) {
    if (categories[r.category as ProblemCategory] !== undefined) categories[r.category as ProblemCategory]++;
    if (workStatuses[r.work_status as WorkStatus] !== undefined) workStatuses[r.work_status as WorkStatus]++;
    if (verifications[r.verification_status as VerificationStatus] !== undefined) verifications[r.verification_status as VerificationStatus]++;
  }

  const verifiedResolvedCount = verifications.appears_resolved + verifications.human_verified_resolved;
  const verifiedUnresolvedCount = verifications.appears_unresolved + verifications.human_verified_unresolved;
  const totalClosedClaims = workStatuses.closed + workStatuses.repair_claimed;
  const unresolvedRate = totalClosedClaims > 0 ? Math.round((verifiedUnresolvedCount / totalClosedClaims) * 100) : 0;

  return {
    totalReports,
    reportsWithRepairClaims: claimsCount || 0,
    reportsAwaitingEvidence: Math.max(0, totalReports - (claimsCount || 0)),
    reportsAssessedByAi: totalReports,
    reportsReviewedByHumans: verifications.human_verified_resolved + verifications.human_verified_unresolved,
    reportsVerifiedResolved: verifiedResolvedCount,
    reportsVerifiedUnresolved: verifiedUnresolvedCount,
    disputedClosures: challengesCount || 0,
    reopenedCases: workStatuses.reopened,
    medianVerificationHours: 3.8,
    unresolvedRateAfterClosureClaim: unresolvedRate,
    categoryBreakdown: categories,
    statusBreakdown: workStatuses,
    verificationBreakdown: verifications,
  };
}
