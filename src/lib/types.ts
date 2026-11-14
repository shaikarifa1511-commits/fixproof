export type UserRole = 'citizen' | 'authority' | 'moderator' | 'public';

export type WorkStatus =
  | 'submitted'
  | 'under_review'
  | 'work_scheduled'
  | 'in_progress'
  | 'repair_claimed'
  | 'closed'
  | 'reopened';

export type VerificationStatus =
  | 'not_assessed'
  | 'awaiting_after_evidence'
  | 'ai_pending'
  | 'appears_resolved'
  | 'appears_unresolved'
  | 'partially_resolved'
  | 'insufficient_evidence'
  | 'human_review_required'
  | 'human_verified_resolved'
  | 'human_verified_unresolved';

export type ProblemCategory =
  | 'pothole'
  | 'garbage'
  | 'footpath'
  | 'drainage'
  | 'infrastructure';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  avatar?: string;
  createdAt: string;
}

export interface EvidenceAsset {
  id: string;
  reportId: string;
  stage: 'before' | 'after' | 'reinspection';
  uploaderId: string;
  uploaderRole: UserRole;
  imageUrl: string;
  sha256Hash: string;
  perceptualHash: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  capturedAt?: string;
  uploadedAt: string;
  isBlurred?: boolean;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  label: string;
}

export interface AIVerificationResult {
  id?: string;
  reportId: string;
  category: ProblemCategory;
  comparison: {
    sameSceneAssessment: 'likely' | 'possible' | 'unlikely' | 'inconclusive';
    imageQuality: 'sufficient' | 'degraded' | 'poor';
    locationEvidence: 'consistent' | 'limited' | 'inconsistent';
    timeEvidence: 'plausible' | 'unverified' | 'suspicious';
  };
  findings: {
    originalDefectVisible: boolean;
    remainingDefectVisible: boolean;
    repairAssessment:
      | 'appears_resolved'
      | 'appears_unresolved'
      | 'partially_resolved'
      | 'insufficient_evidence'
      | 'human_review_required';
  };
  explanation: string;
  confidenceScore?: number;
  confidenceExplanation: string;
  needsHumanReview: boolean;
  modelVersion: string;
  processedAt: string;
  boundingBoxes?: {
    before?: BoundingBox[];
    after?: BoundingBox[];
  };
  duplicateDetected?: boolean;
  sceneSimilarityScore?: number;
}

export interface HumanReview {
  id: string;
  reportId: string;
  reviewerId: string;
  reviewerName: string;
  decision: 'human_verified_resolved' | 'human_verified_unresolved' | 'requires_more_evidence';
  notes: string;
  overrideAi: boolean;
  createdAt: string;
}

export interface Dispute {
  id: string;
  reportId: string;
  complainantId: string;
  complainantName: string;
  reason: string;
  reinspectionEvidenceId?: string;
  reinspectionImageUrl?: string;
  status: 'open' | 'under_moderation' | 'resolved' | 'rejected';
  moderatorVerdict?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface TimelineEvent {
  id: string;
  reportId: string;
  actorId?: string;
  actorName: string;
  actorRole: UserRole | 'system';
  eventType:
    | 'reported'
    | 'status_change'
    | 'repair_claimed'
    | 'ai_verified'
    | 'disputed'
    | 'moderated'
    | 'reopened'
    | 'human_verified';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ProblemCategory;
  workStatus: WorkStatus;
  verificationStatus: VerificationStatus;
  assignedTo?: string;
  citizenId: string;
  citizenName: string;
  address: string;
  latitude: number;
  longitude: number;
  locationAccuracyMeters?: number;
  isSynthetic?: boolean;
  createdAt: string;
  updatedAt: string;
  beforeEvidence?: EvidenceAsset;
  afterEvidence?: EvidenceAsset;
  reinspectionEvidence?: EvidenceAsset;
  latestAiVerification?: AIVerificationResult;
  humanReview?: HumanReview;
  dispute?: Dispute;
  timeline?: TimelineEvent[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  reportId?: string;
  read: boolean;
  createdAt: string;
}

export interface PublicAnalytics {
  totalReports: number;
  reportsWithRepairClaims: number;
  reportsAwaitingEvidence: number;
  reportsAssessedByAi: number;
  reportsReviewedByHumans: number;
  reportsVerifiedResolved: number;
  reportsVerifiedUnresolved: number;
  disputedClosures: number;
  reopenedCases: number;
  medianVerificationHours: number;
  unresolvedRateAfterClosureClaim: number;
  categoryBreakdown: Record<ProblemCategory, number>;
  statusBreakdown: Record<WorkStatus, number>;
  verificationBreakdown: Record<VerificationStatus, number>;
}
