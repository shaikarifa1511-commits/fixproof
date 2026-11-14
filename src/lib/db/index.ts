import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import {
  AIVerificationResult,
  Dispute,
  EvidenceAsset,
  HumanReview,
  NotificationItem,
  ProblemCategory,
  PublicAnalytics,
  Report,
  TimelineEvent,
  User,
  VerificationStatus,
  WorkStatus,
} from '../types';
import { SYNTHETIC_CASES } from './seed';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'fixproof.sqlite');

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    dbInstance = new DatabaseSync(DB_PATH);
    dbInstance.exec('PRAGMA foreign_keys = ON;');
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      organization TEXT,
      avatar TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      work_status TEXT NOT NULL,
      verification_status TEXT NOT NULL,
      assigned_to TEXT,
      citizen_id TEXT NOT NULL,
      citizen_name TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      location_accuracy_meters REAL,
      is_synthetic INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS evidence_assets (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      uploader_id TEXT NOT NULL,
      uploader_role TEXT NOT NULL,
      image_url TEXT NOT NULL,
      sha256_hash TEXT NOT NULL,
      perceptual_hash TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      accuracy_meters REAL,
      captured_at TEXT,
      uploaded_at TEXT NOT NULL,
      is_blurred INTEGER DEFAULT 0,
      notes TEXT,
      metadata TEXT,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_verification_runs (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      category TEXT NOT NULL,
      same_scene_assessment TEXT NOT NULL,
      image_quality TEXT NOT NULL,
      location_evidence TEXT NOT NULL,
      time_evidence TEXT NOT NULL,
      original_defect_visible INTEGER NOT NULL,
      remaining_defect_visible INTEGER NOT NULL,
      repair_assessment TEXT NOT NULL,
      confidence_score REAL,
      confidence_explanation TEXT NOT NULL,
      explanation TEXT NOT NULL,
      needs_human_review INTEGER NOT NULL,
      model_version TEXT NOT NULL,
      processed_at TEXT NOT NULL,
      duplicate_detected INTEGER DEFAULT 0,
      scene_similarity_score REAL,
      bounding_boxes TEXT,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS human_reviews (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      reviewer_name TEXT NOT NULL,
      decision TEXT NOT NULL,
      notes TEXT NOT NULL,
      override_ai INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS disputes (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      complainant_id TEXT NOT NULL,
      complainant_name TEXT NOT NULL,
      reason TEXT NOT NULL,
      reinspection_evidence_id TEXT,
      reinspection_image_url TEXT,
      status TEXT NOT NULL,
      moderator_verdict TEXT,
      created_at TEXT NOT NULL,
      resolved_at TEXT,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS timeline_events (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      actor_id TEXT,
      actor_name TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      event_type TEXT NOT NULL,
      description TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      report_id TEXT,
      read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // Auto-seed if empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM reports').get() as { count: number };
  if (countRow.count === 0) {
    seedDatabase(false);
  }
}

export function seedDatabase(forceReset = false) {
  const db = getDb();
  if (forceReset) {
    db.exec(`
      DELETE FROM notifications;
      DELETE FROM timeline_events;
      DELETE FROM disputes;
      DELETE FROM human_reviews;
      DELETE FROM ai_verification_runs;
      DELETE FROM evidence_assets;
      DELETE FROM reports;
      DELETE FROM users;
    `);
  }

  // Pre-seed demo users
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, email, role, organization, avatar, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'user_cit_1',
    'Aditi Sharma',
    'aditi.citizen@fixproof.org',
    'citizen',
    'Resident (Indiranagar)',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    new Date().toISOString()
  );

  insertUser.run(
    'user_auth_1',
    'Rajesh Gowda',
    'rajesh.engineer@bbmp.gov.in',
    'authority',
    'BBMP Road Infrastructure Division',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    new Date().toISOString()
  );

  insertUser.run(
    'user_mod_1',
    'Suresh Menon',
    'suresh.mod@fixproof.org',
    'moderator',
    'Civic Integrity Review Board',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    new Date().toISOString()
  );

  // Insert all 10 synthetic demonstration cases
  for (const item of SYNTHETIC_CASES) {
    const { report, beforeEvidence, afterEvidence, reinspectionEvidence, aiVerification, humanReview, dispute, timeline } = item;

    // Report
    db.prepare(`
      INSERT OR REPLACE INTO reports (
        id, title, description, category, work_status, verification_status,
        assigned_to, citizen_id, citizen_name, address, latitude, longitude,
        location_accuracy_meters, is_synthetic, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      report.id,
      report.title,
      report.description,
      report.category,
      report.workStatus,
      report.verificationStatus,
      report.assignedTo || null,
      report.citizenId,
      report.citizenName,
      report.address,
      report.latitude,
      report.longitude,
      report.locationAccuracyMeters || 5.0,
      1,
      report.createdAt,
      report.updatedAt
    );

    // Before evidence
    if (beforeEvidence) {
      db.prepare(`
        INSERT OR REPLACE INTO evidence_assets (
          id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash,
          perceptual_hash, latitude, longitude, accuracy_meters, captured_at, uploaded_at,
          is_blurred, notes, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        beforeEvidence.id,
        beforeEvidence.reportId,
        beforeEvidence.stage,
        beforeEvidence.uploaderId,
        beforeEvidence.uploaderRole,
        beforeEvidence.imageUrl,
        beforeEvidence.sha256Hash,
        beforeEvidence.perceptualHash,
        beforeEvidence.latitude || null,
        beforeEvidence.longitude || null,
        beforeEvidence.accuracyMeters || null,
        beforeEvidence.capturedAt || null,
        beforeEvidence.uploadedAt,
        beforeEvidence.isBlurred ? 1 : 0,
        beforeEvidence.notes || null,
        JSON.stringify(beforeEvidence.metadata || {})
      );
    }

    // After evidence
    if (afterEvidence) {
      db.prepare(`
        INSERT OR REPLACE INTO evidence_assets (
          id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash,
          perceptual_hash, latitude, longitude, accuracy_meters, captured_at, uploaded_at,
          is_blurred, notes, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        afterEvidence.id,
        afterEvidence.reportId,
        afterEvidence.stage,
        afterEvidence.uploaderId,
        afterEvidence.uploaderRole,
        afterEvidence.imageUrl,
        afterEvidence.sha256Hash,
        afterEvidence.perceptualHash,
        afterEvidence.latitude || null,
        afterEvidence.longitude || null,
        afterEvidence.accuracyMeters || null,
        afterEvidence.capturedAt || null,
        afterEvidence.uploadedAt,
        afterEvidence.isBlurred ? 1 : 0,
        afterEvidence.notes || null,
        JSON.stringify(afterEvidence.metadata || {})
      );
    }

    // Reinspection evidence
    if (reinspectionEvidence) {
      db.prepare(`
        INSERT OR REPLACE INTO evidence_assets (
          id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash,
          perceptual_hash, latitude, longitude, accuracy_meters, captured_at, uploaded_at,
          is_blurred, notes, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        reinspectionEvidence.id,
        reinspectionEvidence.reportId,
        reinspectionEvidence.stage,
        reinspectionEvidence.uploaderId,
        reinspectionEvidence.uploaderRole,
        reinspectionEvidence.imageUrl,
        reinspectionEvidence.sha256Hash,
        reinspectionEvidence.perceptualHash,
        reinspectionEvidence.latitude || null,
        reinspectionEvidence.longitude || null,
        reinspectionEvidence.accuracyMeters || null,
        reinspectionEvidence.capturedAt || null,
        reinspectionEvidence.uploadedAt,
        reinspectionEvidence.isBlurred ? 1 : 0,
        reinspectionEvidence.notes || null,
        JSON.stringify(reinspectionEvidence.metadata || {})
      );
    }

    // AI verification run
    if (aiVerification) {
      db.prepare(`
        INSERT OR REPLACE INTO ai_verification_runs (
          id, report_id, category, same_scene_assessment, image_quality, location_evidence,
          time_evidence, original_defect_visible, remaining_defect_visible, repair_assessment,
          confidence_score, confidence_explanation, explanation, needs_human_review,
          model_version, processed_at, duplicate_detected, scene_similarity_score, bounding_boxes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `ai_run_${report.id}`,
        aiVerification.reportId,
        aiVerification.category,
        aiVerification.comparison.sameSceneAssessment,
        aiVerification.comparison.imageQuality,
        aiVerification.comparison.locationEvidence,
        aiVerification.comparison.timeEvidence,
        aiVerification.findings.originalDefectVisible ? 1 : 0,
        aiVerification.findings.remainingDefectVisible ? 1 : 0,
        aiVerification.findings.repairAssessment,
        aiVerification.confidenceScore || 0.85,
        aiVerification.confidenceExplanation,
        aiVerification.explanation,
        aiVerification.needsHumanReview ? 1 : 0,
        aiVerification.modelVersion,
        aiVerification.processedAt,
        aiVerification.duplicateDetected ? 1 : 0,
        aiVerification.sceneSimilarityScore || 0.85,
        JSON.stringify(aiVerification.boundingBoxes || {})
      );
    }

    // Human review
    if (humanReview) {
      db.prepare(`
        INSERT OR REPLACE INTO human_reviews (
          id, report_id, reviewer_id, reviewer_name, decision, notes, override_ai, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        humanReview.id,
        humanReview.reportId,
        humanReview.reviewerId,
        humanReview.reviewerName,
        humanReview.decision,
        humanReview.notes,
        humanReview.overrideAi ? 1 : 0,
        humanReview.createdAt
      );
    }

    // Dispute
    if (dispute) {
      db.prepare(`
        INSERT OR REPLACE INTO disputes (
          id, report_id, complainant_id, complainant_name, reason, reinspection_evidence_id,
          reinspection_image_url, status, moderator_verdict, created_at, resolved_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        dispute.id,
        dispute.reportId,
        dispute.complainantId,
        dispute.complainantName,
        dispute.reason,
        dispute.reinspectionEvidenceId || null,
        dispute.reinspectionImageUrl || null,
        dispute.status,
        dispute.moderatorVerdict || null,
        dispute.createdAt,
        dispute.resolvedAt || null
      );
    }

    // Timeline events
    for (const evt of timeline) {
      db.prepare(`
        INSERT OR REPLACE INTO timeline_events (
          id, report_id, actor_id, actor_name, actor_role, event_type, description, metadata, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        evt.id,
        evt.reportId,
        evt.actorId || null,
        evt.actorName,
        evt.actorRole,
        evt.eventType,
        evt.description,
        JSON.stringify(evt.metadata || {}),
        evt.createdAt
      );
    }
  }

  // Initial welcome notifications
  const notifStmt = db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, report_id, read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  notifStmt.run(
    'notif_1',
    'user_cit_1',
    'Report Verified Resolved',
    'FixProof AI and Civic Monitors verified repair of Pothole on 100ft Road.',
    'FP-000101',
    0,
    new Date().toISOString()
  );
  notifStmt.run(
    'notif_2',
    'user_cit_2',
    'Resolution Alert: Evidence Unresolved',
    'Authority marked complaint FP-000102 closed, but AI photo verification detected the defect still remains. You may challenge or dispute.',
    'FP-000102',
    0,
    new Date().toISOString()
  );
}

export function getAllReports(filters?: {
  category?: string;
  workStatus?: string;
  verificationStatus?: string;
  search?: string;
  limit?: number;
}): Report[] {
  const db = getDb();
  let query = 'SELECT * FROM reports WHERE 1=1';
  const params: any[] = [];

  if (filters?.category && filters.category !== 'all') {
    query += ' AND category = ?';
    params.push(filters.category);
  }
  if (filters?.workStatus && filters.workStatus !== 'all') {
    query += ' AND work_status = ?';
    params.push(filters.workStatus);
  }
  if (filters?.verificationStatus && filters.verificationStatus !== 'all') {
    query += ' AND verification_status = ?';
    params.push(filters.verificationStatus);
  }
  if (filters?.search) {
    query += ' AND (title LIKE ? OR address LIKE ? OR id LIKE ?)';
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY created_at DESC';
  if (filters?.limit) {
    query += ` LIMIT ${filters.limit}`;
  }

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((r) => hydrateReport(db, r));
}

export function getReportById(id: string): Report | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
  if (!row) return null;
  return hydrateReport(db, row);
}

function hydrateReport(db: DatabaseSync, row: any): Report {
  const id = row.id;

  // Evidence
  const evidenceRows = db
    .prepare('SELECT * FROM evidence_assets WHERE report_id = ? ORDER BY uploaded_at ASC')
    .all(id) as any[];

  const beforeEvidence = evidenceRows.find((e) => e.stage === 'before')
    ? mapEvidence(evidenceRows.find((e) => e.stage === 'before'))
    : undefined;
  const afterEvidence = evidenceRows.find((e) => e.stage === 'after')
    ? mapEvidence(evidenceRows.find((e) => e.stage === 'after'))
    : undefined;
  const reinspectionEvidence = evidenceRows.find((e) => e.stage === 'reinspection')
    ? mapEvidence(evidenceRows.find((e) => e.stage === 'reinspection'))
    : undefined;

  // Latest AI verification
  const aiRow = db
    .prepare('SELECT * FROM ai_verification_runs WHERE report_id = ? ORDER BY processed_at DESC LIMIT 1')
    .get(id) as any;
  const latestAiVerification = aiRow ? mapAiVerification(aiRow) : undefined;

  // Human Review
  const hrRow = db
    .prepare('SELECT * FROM human_reviews WHERE report_id = ? ORDER BY created_at DESC LIMIT 1')
    .get(id) as any;
  const humanReview = hrRow ? mapHumanReview(hrRow) : undefined;

  // Dispute
  const dispRow = db
    .prepare('SELECT * FROM disputes WHERE report_id = ? ORDER BY created_at DESC LIMIT 1')
    .get(id) as any;
  const dispute = dispRow ? mapDispute(dispRow) : undefined;

  // Timeline
  const timelineRows = db
    .prepare('SELECT * FROM timeline_events WHERE report_id = ? ORDER BY created_at ASC')
    .all(id) as any[];
  const timeline = timelineRows.map(mapTimeline);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as ProblemCategory,
    workStatus: row.work_status as WorkStatus,
    verificationStatus: row.verification_status as VerificationStatus,
    assignedTo: row.assigned_to || undefined,
    citizenId: row.citizen_id,
    citizenName: row.citizen_name,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    locationAccuracyMeters: row.location_accuracy_meters,
    isSynthetic: Boolean(row.is_synthetic),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    beforeEvidence,
    afterEvidence,
    reinspectionEvidence,
    latestAiVerification,
    humanReview,
    dispute,
    timeline,
  };
}

function mapEvidence(r: any): EvidenceAsset {
  return {
    id: r.id,
    reportId: r.report_id,
    stage: r.stage,
    uploaderId: r.uploader_id,
    uploaderRole: r.uploader_role,
    imageUrl: r.image_url,
    sha256Hash: r.sha256_hash,
    perceptualHash: r.perceptual_hash,
    latitude: r.latitude,
    longitude: r.longitude,
    accuracyMeters: r.accuracy_meters,
    capturedAt: r.captured_at,
    uploadedAt: r.uploaded_at,
    isBlurred: Boolean(r.is_blurred),
    notes: r.notes,
    metadata: r.metadata ? JSON.parse(r.metadata) : {},
  };
}

function mapAiVerification(r: any): AIVerificationResult {
  return {
    id: r.id,
    reportId: r.report_id,
    category: r.category as ProblemCategory,
    comparison: {
      sameSceneAssessment: r.same_scene_assessment,
      imageQuality: r.image_quality,
      locationEvidence: r.location_evidence,
      timeEvidence: r.time_evidence,
    },
    findings: {
      originalDefectVisible: Boolean(r.original_defect_visible),
      remainingDefectVisible: Boolean(r.remaining_defect_visible),
      repairAssessment: r.repair_assessment,
    },
    confidenceScore: r.confidence_score,
    confidenceExplanation: r.confidence_explanation,
    explanation: r.explanation,
    needsHumanReview: Boolean(r.needs_human_review),
    modelVersion: r.model_version,
    processedAt: r.processed_at,
    duplicateDetected: Boolean(r.duplicate_detected),
    sceneSimilarityScore: r.scene_similarity_score,
    boundingBoxes: r.bounding_boxes ? JSON.parse(r.bounding_boxes) : undefined,
  };
}

function mapHumanReview(r: any): HumanReview {
  return {
    id: r.id,
    reportId: r.report_id,
    reviewerId: r.reviewer_id,
    reviewerName: r.reviewer_name,
    decision: r.decision,
    notes: r.notes,
    overrideAi: Boolean(r.override_ai),
    createdAt: r.created_at,
  };
}

function mapDispute(r: any): Dispute {
  return {
    id: r.id,
    reportId: r.report_id,
    complainantId: r.complainant_id,
    complainantName: r.complainant_name,
    reason: r.reason,
    reinspectionEvidenceId: r.reinspection_evidence_id,
    reinspectionImageUrl: r.reinspection_image_url,
    status: r.status,
    moderatorVerdict: r.moderator_verdict,
    createdAt: r.created_at,
    resolvedAt: r.resolved_at,
  };
}

function mapTimeline(r: any): TimelineEvent {
  return {
    id: r.id,
    reportId: r.report_id,
    actorId: r.actor_id,
    actorName: r.actor_name,
    actorRole: r.actor_role,
    eventType: r.event_type,
    description: r.description,
    metadata: r.metadata ? JSON.parse(r.metadata) : {},
    createdAt: r.created_at,
  };
}

export function createReport(report: Partial<Report>): Report {
  const db = getDb();
  const id = report.id || `FP-${String(Math.floor(100000 + Math.random() * 900000))}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO reports (
      id, title, description, category, work_status, verification_status,
      assigned_to, citizen_id, citizen_name, address, latitude, longitude,
      location_accuracy_meters, is_synthetic, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    report.title || 'Untitled Report',
    report.description || '',
    report.category || 'pothole',
    'submitted',
    'not_assessed',
    report.assignedTo || 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    report.citizenId || 'user_cit_1',
    report.citizenName || 'Citizen Contributor',
    report.address || 'Bengaluru, Karnataka',
    report.latitude || 12.9716,
    report.longitude || 77.5946,
    report.locationAccuracyMeters || 5.0,
    report.isSynthetic ? 1 : 0,
    now,
    now
  );

  addTimelineEvent({
    reportId: id,
    actorId: report.citizenId || 'user_cit_1',
    actorName: report.citizenName || 'Citizen Contributor',
    actorRole: 'citizen',
    eventType: 'reported',
    description: 'Complaint submitted with initial photographic evidence.',
  });

  return getReportById(id)!;
}

export function addEvidenceAsset(asset: Partial<EvidenceAsset>): EvidenceAsset {
  const db = getDb();
  const id = asset.id || `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO evidence_assets (
      id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash,
      perceptual_hash, latitude, longitude, accuracy_meters, captured_at, uploaded_at,
      is_blurred, notes, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    asset.reportId!,
    asset.stage || 'before',
    asset.uploaderId || 'system',
    asset.uploaderRole || 'citizen',
    asset.imageUrl || '',
    asset.sha256Hash || '',
    asset.perceptualHash || '',
    asset.latitude || null,
    asset.longitude || null,
    asset.accuracyMeters || null,
    asset.capturedAt || null,
    asset.uploadedAt || now,
    asset.isBlurred ? 1 : 0,
    asset.notes || null,
    JSON.stringify(asset.metadata || {})
  );

  return mapEvidence(db.prepare('SELECT * FROM evidence_assets WHERE id = ?').get(id));
}

export function addAiVerification(ai: AIVerificationResult) {
  const db = getDb();
  const id = ai.id || `ai_run_${Date.now()}`;

  db.prepare(`
    INSERT INTO ai_verification_runs (
      id, report_id, category, same_scene_assessment, image_quality, location_evidence,
      time_evidence, original_defect_visible, remaining_defect_visible, repair_assessment,
      confidence_score, confidence_explanation, explanation, needs_human_review,
      model_version, processed_at, duplicate_detected, scene_similarity_score, bounding_boxes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    ai.reportId,
    ai.category,
    ai.comparison.sameSceneAssessment,
    ai.comparison.imageQuality,
    ai.comparison.locationEvidence,
    ai.comparison.timeEvidence,
    ai.findings.originalDefectVisible ? 1 : 0,
    ai.findings.remainingDefectVisible ? 1 : 0,
    ai.findings.repairAssessment,
    ai.confidenceScore || 0.85,
    ai.confidenceExplanation,
    ai.explanation,
    ai.needsHumanReview ? 1 : 0,
    ai.modelVersion,
    ai.processedAt,
    ai.duplicateDetected ? 1 : 0,
    ai.sceneSimilarityScore || 0.85,
    JSON.stringify(ai.boundingBoxes || {})
  );

  // Update verification status on report
  db.prepare('UPDATE reports SET verification_status = ?, updated_at = ? WHERE id = ?').run(
    ai.findings.repairAssessment,
    new Date().toISOString(),
    ai.reportId
  );

  addTimelineEvent({
    reportId: ai.reportId,
    actorName: 'FixProof AI Inspector',
    actorRole: 'system',
    eventType: 'ai_verified',
    description: `AI Inspection completed: ${formatStatusName(ai.findings.repairAssessment)}. ${ai.explanation}`,
  });
}

export function addHumanReview(review: Partial<HumanReview>) {
  const db = getDb();
  const id = review.id || `hr_${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO human_reviews (
      id, report_id, reviewer_id, reviewer_name, decision, notes, override_ai, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    review.reportId!,
    review.reviewerId || 'mod_1',
    review.reviewerName || 'Reviewer',
    review.decision!,
    review.notes || '',
    review.overrideAi ? 1 : 0,
    now
  );

  // Update verification status on report
  db.prepare('UPDATE reports SET verification_status = ?, updated_at = ? WHERE id = ?').run(
    review.decision,
    now,
    review.reportId!
  );

  addTimelineEvent({
    reportId: review.reportId!,
    actorId: review.reviewerId,
    actorName: review.reviewerName || 'Independent Reviewer',
    actorRole: 'moderator',
    eventType: 'human_verified',
    description: `Human Review Recorded: ${formatStatusName(review.decision!)}. Reason: ${review.notes}`,
  });
}

export function createDispute(dispute: Partial<Dispute>) {
  const db = getDb();
  const id = dispute.id || `disp_${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO disputes (
      id, report_id, complainant_id, complainant_name, reason, reinspection_evidence_id,
      reinspection_image_url, status, moderator_verdict, created_at, resolved_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    dispute.reportId!,
    dispute.complainantId || 'citizen_1',
    dispute.complainantName || 'Citizen',
    dispute.reason || '',
    dispute.reinspectionEvidenceId || null,
    dispute.reinspectionImageUrl || null,
    'open',
    null,
    now,
    null
  );

  // Reopen report if previously closed
  db.prepare('UPDATE reports SET work_status = ?, updated_at = ? WHERE id = ?').run(
    'reopened',
    now,
    dispute.reportId!
  );

  addTimelineEvent({
    reportId: dispute.reportId!,
    actorId: dispute.complainantId,
    actorName: dispute.complainantName || 'Citizen Complainant',
    actorRole: 'citizen',
    eventType: 'disputed',
    description: `Resolution Disputed: "${dispute.reason}" Fresh reinspection evidence attached. Case reopened for moderation.`,
  });
}

export function updateReportStatus(
  reportId: string,
  workStatus?: WorkStatus,
  verificationStatus?: VerificationStatus,
  actorName = 'Authorized Authority',
  notes = ''
) {
  const db = getDb();
  const now = new Date().toISOString();

  if (workStatus && verificationStatus) {
    db.prepare('UPDATE reports SET work_status = ?, verification_status = ?, updated_at = ? WHERE id = ?').run(
      workStatus,
      verificationStatus,
      now,
      reportId
    );
  } else if (workStatus) {
    db.prepare('UPDATE reports SET work_status = ?, updated_at = ? WHERE id = ?').run(workStatus, now, reportId);
  } else if (verificationStatus) {
    db.prepare('UPDATE reports SET verification_status = ?, updated_at = ? WHERE id = ?').run(
      verificationStatus,
      now,
      reportId
    );
  }

  addTimelineEvent({
    reportId,
    actorName,
    actorRole: 'authority',
    eventType: 'status_change',
    description: `Work status transitioned to ${formatStatusName(workStatus || '')}. ${notes}`,
  });
}

export function addTimelineEvent(evt: {
  reportId: string;
  actorId?: string;
  actorName: string;
  actorRole: any;
  eventType: any;
  description: string;
  metadata?: any;
}) {
  const db = getDb();
  const id = `tl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  db.prepare(`
    INSERT INTO timeline_events (
      id, report_id, actor_id, actor_name, actor_role, event_type, description, metadata, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    evt.reportId,
    evt.actorId || null,
    evt.actorName,
    evt.actorRole,
    evt.eventType,
    evt.description,
    JSON.stringify(evt.metadata || {}),
    new Date().toISOString()
  );
}

export function getNotifications(userId: string): NotificationItem[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50')
    .all() as any[];
  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    title: r.title,
    message: r.message,
    reportId: r.report_id,
    read: Boolean(r.read),
    createdAt: r.created_at,
  }));
}

export function markNotificationRead(id: string) {
  const db = getDb();
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(id);
}

export function getAnalytics(includeDemo = true): PublicAnalytics {
  const db = getDb();
  const whereClause = includeDemo ? '' : 'WHERE is_synthetic = 0';

  const allReports = db.prepare(`SELECT * FROM reports ${whereClause}`).all() as any[];
  const totalReports = allReports.length;

  const categories: Record<ProblemCategory, number> = {
    pothole: 0,
    garbage: 0,
    footpath: 0,
    drainage: 0,
    infrastructure: 0,
  };
  const workStatuses: Record<WorkStatus, number> = {
    submitted: 0,
    under_review: 0,
    work_scheduled: 0,
    in_progress: 0,
    repair_claimed: 0,
    closed: 0,
    reopened: 0,
  };
  const verifications: Record<VerificationStatus, number> = {
    not_assessed: 0,
    awaiting_after_evidence: 0,
    ai_pending: 0,
    appears_resolved: 0,
    appears_unresolved: 0,
    partially_resolved: 0,
    insufficient_evidence: 0,
    human_review_required: 0,
    human_verified_resolved: 0,
    human_verified_unresolved: 0,
  };

  for (const r of allReports) {
    if (categories[r.category as ProblemCategory] !== undefined) {
      categories[r.category as ProblemCategory]++;
    }
    if (workStatuses[r.work_status as WorkStatus] !== undefined) {
      workStatuses[r.work_status as WorkStatus]++;
    }
    if (verifications[r.verification_status as VerificationStatus] !== undefined) {
      verifications[r.verification_status as VerificationStatus]++;
    }
  }

  const reportsWithRepairClaims = db
    .prepare(
      `SELECT COUNT(DISTINCT report_id) as c FROM evidence_assets WHERE stage = 'after' ${
        includeDemo ? '' : 'AND report_id NOT IN (SELECT id FROM reports WHERE is_synthetic = 1)'
      }`
    )
    .get() as { c: number };

  const reportsAssessedByAi = db
    .prepare(
      `SELECT COUNT(DISTINCT report_id) as c FROM ai_verification_runs ${
        includeDemo ? '' : 'WHERE report_id NOT IN (SELECT id FROM reports WHERE is_synthetic = 1)'
      }`
    )
    .get() as { c: number };

  const reportsReviewedByHumans = db
    .prepare(
      `SELECT COUNT(DISTINCT report_id) as c FROM human_reviews ${
        includeDemo ? '' : 'WHERE report_id NOT IN (SELECT id FROM reports WHERE is_synthetic = 1)'
      }`
    )
    .get() as { c: number };

  const disputedClosures = db
    .prepare(
      `SELECT COUNT(*) as c FROM disputes ${
        includeDemo ? '' : 'WHERE report_id NOT IN (SELECT id FROM reports WHERE is_synthetic = 1)'
      }`
    )
    .get() as { c: number };

  // Calculate genuine unresolved rate where authority marked 'closed' or claimed repair
  const closedReports = allReports.filter((r) => r.work_status === 'closed');
  const falselyClosed = closedReports.filter(
    (r) =>
      r.verification_status === 'appears_unresolved' ||
      r.verification_status === 'human_verified_unresolved'
  ).length;

  const unresolvedRateAfterClosureClaim =
    closedReports.length > 0 ? Math.round((falselyClosed / closedReports.length) * 100) : 0;

  return {
    totalReports,
    reportsWithRepairClaims: reportsWithRepairClaims.c,
    reportsAwaitingEvidence: totalReports - reportsWithRepairClaims.c,
    reportsAssessedByAi: reportsAssessedByAi.c,
    reportsReviewedByHumans: reportsReviewedByHumans.c,
    reportsVerifiedResolved:
      verifications.appears_resolved + verifications.human_verified_resolved,
    reportsVerifiedUnresolved:
      verifications.appears_unresolved + verifications.human_verified_unresolved,
    disputedClosures: disputedClosures.c,
    reopenedCases: workStatuses.reopened,
    medianVerificationHours: 3.8,
    unresolvedRateAfterClosureClaim,
    categoryBreakdown: categories,
    statusBreakdown: workStatuses,
    verificationBreakdown: verifications,
  };
}

function formatStatusName(status: string) {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
