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
    -- 1. Organizations
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      organization_name TEXT NOT NULL,
      organization_type TEXT NOT NULL DEFAULT 'municipal_corporation',
      location TEXT NOT NULL,
      verified INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    -- 2. Users / Profiles
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'citizen',
      organization_id TEXT,
      avatar TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 3. Reports
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      case_number TEXT UNIQUE NOT NULL,
      citizen_id TEXT NOT NULL,
      citizen_name TEXT NOT NULL,
      assigned_authority_id TEXT,
      assigned_to TEXT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      location_accuracy_meters REAL DEFAULT 5.0,
      status TEXT NOT NULL DEFAULT 'SUBMITTED',
      work_status TEXT NOT NULL DEFAULT 'submitted',
      verification_status TEXT NOT NULL DEFAULT 'not_assessed',
      priority TEXT NOT NULL DEFAULT 'medium',
      is_synthetic INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      resolved_at TEXT,
      FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- 4. Evidence Assets
    CREATE TABLE IF NOT EXISTS evidence (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      uploaded_by TEXT,
      uploader_role TEXT DEFAULT 'citizen',
      evidence_type TEXT NOT NULL,
      stage TEXT NOT NULL DEFAULT 'before',
      storage_path TEXT,
      public_url TEXT NOT NULL,
      image_url TEXT NOT NULL,
      original_filename TEXT DEFAULT 'evidence.jpg',
      mime_type TEXT DEFAULT 'image/jpeg',
      file_size INTEGER DEFAULT 0,
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

    -- Backward compatibility view/table for legacy queries
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
      metadata TEXT
    );

    -- 5. Repair Claims
    CREATE TABLE IF NOT EXISTS repair_claims (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      authority_id TEXT NOT NULL,
      description TEXT NOT NULL,
      materials_used TEXT NOT NULL,
      submitted_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'submitted',
      created_at TEXT NOT NULL,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
    );

    -- 6. Verification Results
    CREATE TABLE IF NOT EXISTS verification_results (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      repair_claim_id TEXT,
      same_scene_score REAL NOT NULL,
      visual_change_score REAL NOT NULL,
      defect_resolution_score REAL NOT NULL,
      gps_distance_meters REAL,
      duplicate_detected INTEGER NOT NULL DEFAULT 0,
      ai_provider TEXT NOT NULL DEFAULT 'gemini-multimodal',
      ai_model TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
      confidence_score REAL NOT NULL,
      result TEXT NOT NULL,
      explanation TEXT NOT NULL,
      verification_method TEXT NOT NULL DEFAULT 'ai_assisted',
      bounding_boxes TEXT,
      created_at TEXT NOT NULL,
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

    -- 7. Citizen Challenges / Disputes
    CREATE TABLE IF NOT EXISTS citizen_challenges (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      citizen_id TEXT NOT NULL,
      citizen_name TEXT NOT NULL,
      reason TEXT NOT NULL,
      description TEXT NOT NULL,
      evidence_id TEXT,
      reinspection_image_url TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      moderator_id TEXT,
      moderator_notes TEXT,
      created_at TEXT NOT NULL,
      resolved_at TEXT,
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
      resolved_at TEXT
    );

    -- 8. Audit Logs & Timeline
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT,
      actor_name TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      report_id TEXT NOT NULL,
      action TEXT NOT NULL,
      previous_value TEXT,
      new_value TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL,
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
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS human_reviews (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      reviewer_name TEXT NOT NULL,
      decision TEXT NOT NULL,
      notes TEXT NOT NULL,
      override_ai INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    -- 9. Notifications
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      report_id TEXT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // Safe schema migrations for existing SQLite databases
  try { db.exec('ALTER TABLE users ADD COLUMN full_name TEXT;'); } catch (_) {}
  try { db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT;'); } catch (_) {}
  try { db.exec('ALTER TABLE users ADD COLUMN phone TEXT;'); } catch (_) {}
  try { db.exec('ALTER TABLE users ADD COLUMN organization_id TEXT;'); } catch (_) {}
  try { db.exec('ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 1;'); } catch (_) {}
  try { db.exec('ALTER TABLE users ADD COLUMN updated_at TEXT;'); } catch (_) {}
  try { db.exec('UPDATE users SET full_name = name WHERE full_name IS NULL;'); } catch (_) {}
  try {
    db.exec(`
      INSERT OR IGNORE INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at)
      SELECT id, report_id, actor_id, actor_name, actor_role, event_type, description, created_at FROM timeline_events;
    `);
  } catch (_) {}



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
      DELETE FROM audit_logs;
      DELETE FROM disputes;
      DELETE FROM citizen_challenges;
      DELETE FROM human_reviews;
      DELETE FROM verification_results;
      DELETE FROM ai_verification_runs;
      DELETE FROM repair_claims;
      DELETE FROM evidence;
      DELETE FROM evidence_assets;
      DELETE FROM reports;
      DELETE FROM users;
      DELETE FROM organizations;
    `);
  }

  // Insert BBMP Organization
  db.prepare(`
    INSERT OR REPLACE INTO organizations (id, organization_name, organization_type, location, verified, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    'org_bbmp',
    'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    'municipal_corporation',
    'Bengaluru, Karnataka',
    1,
    new Date().toISOString()
  );

  // Pre-seed demo users with full names and roles
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, full_name, email, phone, role, organization_id, avatar, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'user_cit_1',
    'Aditi Sharma',
    'Aditi Sharma',
    'aditi.citizen@fixproof.org',
    '+91-9876543210',
    'citizen',
    'org_bbmp',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    new Date().toISOString(),
    new Date().toISOString()
  );

  insertUser.run(
    'user_auth_1',
    'Rajesh Gowda',
    'Rajesh Gowda',
    'rajesh.engineer@bbmp.gov.in',
    '+91-9888812345',
    'authority',
    'org_bbmp',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    new Date().toISOString(),
    new Date().toISOString()
  );

  insertUser.run(
    'user_mod_1',
    'Suresh Menon',
    'Suresh Menon',
    'suresh.mod@fixproof.org',
    '+91-9777754321',
    'moderator',
    'org_bbmp',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    new Date().toISOString(),
    new Date().toISOString()
  );

  // Insert all 10 synthetic demonstration cases
  for (const item of SYNTHETIC_CASES) {
    const { report, beforeEvidence, afterEvidence, reinspectionEvidence, aiVerification, humanReview, dispute, timeline } = item;

    // Report
    db.prepare(`
      INSERT OR REPLACE INTO reports (
        id, case_number, citizen_id, citizen_name, assigned_to, category,
        title, description, address, latitude, longitude,
        location_accuracy_meters, status, work_status, verification_status,
        is_synthetic, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      report.id,
      report.id, // case_number
      report.citizenId,
      report.citizenName,
      report.assignedTo || 'BBMP Ward Maintenance',
      report.category,
      report.title,
      report.description,
      report.address,
      report.latitude,
      report.longitude,
      report.locationAccuracyMeters || 5.0,
      report.workStatus.toUpperCase(),
      report.workStatus,
      report.verificationStatus,
      1,
      report.createdAt,
      report.updatedAt
    );

    // Insert Before Evidence
    if (beforeEvidence) {
      db.prepare(`
        INSERT OR REPLACE INTO evidence (
          id, report_id, uploaded_by, uploader_role, evidence_type, stage,
          storage_path, public_url, image_url, original_filename, sha256_hash, perceptual_hash,
          latitude, longitude, accuracy_meters, captured_at, uploaded_at, is_blurred, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        beforeEvidence.id,
        report.id,
        beforeEvidence.uploaderId,
        beforeEvidence.uploaderRole,
        'initial_report',
        'before',
        `/uploads/${beforeEvidence.sha256Hash.substring(0, 16)}.jpg`,
        beforeEvidence.imageUrl,
        beforeEvidence.imageUrl,
        'complaint_photo.jpg',
        beforeEvidence.sha256Hash,
        beforeEvidence.perceptualHash,
        beforeEvidence.latitude || report.latitude,
        beforeEvidence.longitude || report.longitude,
        5.0,
        beforeEvidence.capturedAt || report.createdAt,
        beforeEvidence.uploadedAt,
        beforeEvidence.isBlurred ? 1 : 0,
        beforeEvidence.notes || null
      );

      // Legacy mirror
      db.prepare(`
        INSERT OR REPLACE INTO evidence_assets (
          id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash,
          perceptual_hash, latitude, longitude, accuracy_meters, captured_at, uploaded_at, is_blurred, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        beforeEvidence.id,
        report.id,
        'before',
        beforeEvidence.uploaderId,
        beforeEvidence.uploaderRole,
        beforeEvidence.imageUrl,
        beforeEvidence.sha256Hash,
        beforeEvidence.perceptualHash,
        beforeEvidence.latitude || null,
        beforeEvidence.longitude || null,
        5.0,
        beforeEvidence.capturedAt || null,
        beforeEvidence.uploadedAt,
        beforeEvidence.isBlurred ? 1 : 0,
        beforeEvidence.notes || null
      );
    }

    // Insert After Evidence
    if (afterEvidence) {
      db.prepare(`
        INSERT OR REPLACE INTO evidence (
          id, report_id, uploaded_by, uploader_role, evidence_type, stage,
          storage_path, public_url, image_url, original_filename, sha256_hash, perceptual_hash,
          latitude, longitude, accuracy_meters, captured_at, uploaded_at, is_blurred, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        afterEvidence.id,
        report.id,
        afterEvidence.uploaderId,
        afterEvidence.uploaderRole,
        'repair_after',
        'after',
        `/uploads/${afterEvidence.sha256Hash.substring(0, 16)}.jpg`,
        afterEvidence.imageUrl,
        afterEvidence.imageUrl,
        'repair_photo.jpg',
        afterEvidence.sha256Hash,
        afterEvidence.perceptualHash,
        afterEvidence.latitude || report.latitude,
        afterEvidence.longitude || report.longitude,
        5.0,
        afterEvidence.capturedAt || null,
        afterEvidence.uploadedAt,
        afterEvidence.isBlurred ? 1 : 0,
        afterEvidence.notes || null
      );

      db.prepare(`
        INSERT OR REPLACE INTO evidence_assets (
          id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash,
          perceptual_hash, latitude, longitude, accuracy_meters, captured_at, uploaded_at, is_blurred, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        afterEvidence.id,
        report.id,
        'after',
        afterEvidence.uploaderId,
        afterEvidence.uploaderRole,
        afterEvidence.imageUrl,
        afterEvidence.sha256Hash,
        afterEvidence.perceptualHash,
        afterEvidence.latitude || null,
        afterEvidence.longitude || null,
        5.0,
        afterEvidence.capturedAt || null,
        afterEvidence.uploadedAt,
        afterEvidence.isBlurred ? 1 : 0,
        afterEvidence.notes || null
      );
    }

    // Insert Reinspection Evidence
    if (reinspectionEvidence) {
      db.prepare(`
        INSERT OR REPLACE INTO evidence (
          id, report_id, uploaded_by, uploader_role, evidence_type, stage,
          storage_path, public_url, image_url, original_filename, sha256_hash, perceptual_hash,
          latitude, longitude, accuracy_meters, captured_at, uploaded_at, is_blurred, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        reinspectionEvidence.id,
        report.id,
        reinspectionEvidence.uploaderId,
        reinspectionEvidence.uploaderRole,
        'citizen_reinspection',
        'reinspection',
        `/uploads/${reinspectionEvidence.sha256Hash.substring(0, 16)}.jpg`,
        reinspectionEvidence.imageUrl,
        reinspectionEvidence.imageUrl,
        'reinspection.jpg',
        reinspectionEvidence.sha256Hash,
        reinspectionEvidence.perceptualHash,
        reinspectionEvidence.latitude || report.latitude,
        reinspectionEvidence.longitude || report.longitude,
        4.0,
        reinspectionEvidence.capturedAt || null,
        reinspectionEvidence.uploadedAt,
        reinspectionEvidence.isBlurred ? 1 : 0,
        reinspectionEvidence.notes || null
      );

      db.prepare(`
        INSERT OR REPLACE INTO evidence_assets (
          id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash,
          perceptual_hash, latitude, longitude, accuracy_meters, captured_at, uploaded_at, is_blurred, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        reinspectionEvidence.id,
        report.id,
        'reinspection',
        reinspectionEvidence.uploaderId,
        reinspectionEvidence.uploaderRole,
        reinspectionEvidence.imageUrl,
        reinspectionEvidence.sha256Hash,
        reinspectionEvidence.perceptualHash,
        reinspectionEvidence.latitude || null,
        reinspectionEvidence.longitude || null,
        4.0,
        reinspectionEvidence.capturedAt || null,
        reinspectionEvidence.uploadedAt,
        reinspectionEvidence.isBlurred ? 1 : 0,
        reinspectionEvidence.notes || null
      );
    }

    // Insert AI Verification Results
    if (aiVerification) {
      const isResolved = aiVerification.findings.repairAssessment === 'appears_resolved';
      const isUnresolved = aiVerification.findings.repairAssessment === 'appears_unresolved';
      const sameSceneScore = aiVerification.comparison.sameSceneAssessment === 'likely' ? 0.95 : 0.2;
      const defectResolutionScore = isResolved ? 0.94 : 0.1;

      db.prepare(`
        INSERT OR REPLACE INTO verification_results (
          id, report_id, same_scene_score, visual_change_score, defect_resolution_score,
          gps_distance_meters, duplicate_detected, ai_provider, ai_model, confidence_score,
          result, explanation, verification_method, bounding_boxes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `vr_${report.id}`,
        report.id,
        sameSceneScore,
        0.85,
        defectResolutionScore,
        15.0,
        aiVerification.duplicateDetected ? 1 : 0,
        'gemini-multimodal',
        aiVerification.modelVersion || 'gemini-1.5-flash',
        aiVerification.confidenceScore || 0.85,
        aiVerification.findings.repairAssessment.toUpperCase(),
        aiVerification.explanation,
        'ai_assisted',
        JSON.stringify(aiVerification.boundingBoxes || {}),
        aiVerification.processedAt
      );

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

    // Insert Citizen Challenge
    if (dispute) {
      db.prepare(`
        INSERT OR REPLACE INTO citizen_challenges (
          id, report_id, citizen_id, citizen_name, reason, description,
          reinspection_image_url, status, moderator_notes, created_at, resolved_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        dispute.id,
        report.id,
        dispute.complainantId,
        dispute.complainantName,
        dispute.reason,
        dispute.reason,
        dispute.reinspectionImageUrl || null,
        dispute.status,
        dispute.moderatorVerdict || null,
        dispute.createdAt,
        dispute.resolvedAt || null
      );

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

    // Insert Human Review
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

    // Insert Audit Logs
    for (const evt of timeline) {
      db.prepare(`
        INSERT OR REPLACE INTO audit_logs (
          id, actor_id, actor_name, actor_role, report_id, action, new_value, metadata, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        evt.id,
        evt.actorId || null,
        evt.actorName,
        evt.actorRole,
        evt.reportId,
        evt.eventType,
        evt.description,
        JSON.stringify(evt.metadata || {}),
        evt.createdAt
      );

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
    INSERT OR REPLACE INTO notifications (id, user_id, report_id, title, message, is_read, read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  notifStmt.run(
    'notif_1',
    'user_cit_1',
    'FP-000101',
    'Report Verified Resolved',
    'FixProof AI and Civic Monitors verified repair of Pothole on 100ft Road.',
    0,
    0,
    new Date().toISOString()
  );
  notifStmt.run(
    'notif_2',
    'user_cit_1',
    'FP-000102',
    'Resolution Alert: Evidence Unresolved',
    'Authority marked complaint FP-000102 closed, but AI photo verification detected the defect still remains. You may challenge or dispute.',
    0,
    0,
    new Date().toISOString()
  );
}

export function getAllReports(filters?: {
  category?: string;
  status?: string;
  workStatus?: string;
  verificationStatus?: string;
  search?: string;
  bbox?: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  limit?: number;
  offset?: number;
}): { reports: Report[]; total: number } {
  const db = getDb();
  let query = 'SELECT * FROM reports WHERE 1=1';
  let countQuery = 'SELECT COUNT(*) as total FROM reports WHERE 1=1';
  const params: any[] = [];
  const countParams: any[] = [];

  if (filters?.category && filters.category !== 'all') {
    query += ' AND category = ?';
    countQuery += ' AND category = ?';
    params.push(filters.category);
    countParams.push(filters.category);
  }
  if (filters?.status && filters.status !== 'all') {
    query += ' AND (status = ? OR work_status = ?)';
    countQuery += ' AND (status = ? OR work_status = ?)';
    params.push(filters.status.toUpperCase(), filters.status.toLowerCase());
    countParams.push(filters.status.toUpperCase(), filters.status.toLowerCase());
  }
  if (filters?.workStatus && filters.workStatus !== 'all') {
    query += ' AND work_status = ?';
    countQuery += ' AND work_status = ?';
    params.push(filters.workStatus);
    countParams.push(filters.workStatus);
  }
  if (filters?.verificationStatus && filters.verificationStatus !== 'all') {
    query += ' AND verification_status = ?';
    countQuery += ' AND verification_status = ?';
    params.push(filters.verificationStatus);
    countParams.push(filters.verificationStatus);
  }
  if (filters?.bbox) {
    query += ' AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?';
    countQuery += ' AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?';
    params.push(filters.bbox.minLat, filters.bbox.maxLat, filters.bbox.minLng, filters.bbox.maxLng);
    countParams.push(filters.bbox.minLat, filters.bbox.maxLat, filters.bbox.minLng, filters.bbox.maxLng);
  }
  if (filters?.search) {
    query += ' AND (title LIKE ? OR address LIKE ? OR id LIKE ? OR case_number LIKE ?)';
    countQuery += ' AND (title LIKE ? OR address LIKE ? OR id LIKE ? OR case_number LIKE ?)';
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
    countParams.push(term, term, term, term);
  }

  query += ' ORDER BY created_at DESC';
  if (filters?.limit) {
    query += ` LIMIT ${filters.limit}`;
    if (filters?.offset) {
      query += ` OFFSET ${filters.offset}`;
    }
  }

  const totalRow = db.prepare(countQuery).get(...countParams) as { total: number };
  const rows = db.prepare(query).all(...params) as any[];
  return {
    reports: rows.map((r) => hydrateReport(db, r)),
    total: totalRow.total,
  };
}

export function getReportById(idOrCaseNumber: string): Report | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM reports WHERE id = ? OR case_number = ?').get(idOrCaseNumber, idOrCaseNumber) as any;
  if (!row) return null;
  return hydrateReport(db, row);
}

function hydrateReport(db: DatabaseSync, row: any): Report {
  const id = row.id;

  // Retrieve evidence
  const evidenceRows = db
    .prepare('SELECT * FROM evidence WHERE report_id = ? ORDER BY uploaded_at ASC')
    .all(id) as any[];

  const beforeRow = evidenceRows.find((e) => e.stage === 'before' || e.evidence_type === 'initial_report');
  const afterRow = evidenceRows.find((e) => e.stage === 'after' || e.evidence_type === 'repair_after');
  const reinspectRow = evidenceRows.find((e) => e.stage === 'reinspection' || e.evidence_type === 'citizen_reinspection');

  const beforeEvidence = beforeRow ? mapEvidence(beforeRow) : undefined;
  const afterEvidence = afterRow ? mapEvidence(afterRow) : undefined;
  const reinspectionEvidence = reinspectRow ? mapEvidence(reinspectRow) : undefined;

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

  // Dispute / Challenge
  const challengeRow = db
    .prepare('SELECT * FROM citizen_challenges WHERE report_id = ? ORDER BY created_at DESC LIMIT 1')
    .get(id) as any;
  const dispute = challengeRow ? mapChallenge(challengeRow) : undefined;

  // Timeline & Audit Logs
  const auditRows = db
    .prepare('SELECT * FROM audit_logs WHERE report_id = ? ORDER BY created_at ASC')
    .all(id) as any[];
  const timeline = auditRows.map(mapAuditToTimeline);

  return {
    id: row.case_number || row.id,
    title: row.title,
    description: row.description,
    category: row.category as ProblemCategory,
    workStatus: (row.work_status || row.status?.toLowerCase()) as WorkStatus,
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
    stage: r.stage || (r.evidence_type === 'repair_after' ? 'after' : 'before'),
    uploaderId: r.uploaded_by || r.uploader_id || 'system',
    uploaderRole: r.uploader_role || 'citizen',
    imageUrl: r.public_url || r.image_url,
    sha256Hash: r.sha256_hash,
    perceptualHash: r.perceptual_hash || '',
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

function mapChallenge(r: any): Dispute {
  return {
    id: r.id,
    reportId: r.report_id,
    complainantId: r.citizen_id || r.complainant_id,
    complainantName: r.citizen_name || r.complainant_name || 'Citizen Complainant',
    reason: r.reason,
    reinspectionEvidenceId: r.evidence_id || r.reinspection_evidence_id,
    reinspectionImageUrl: r.reinspection_image_url,
    status: r.status,
    moderatorVerdict: r.moderator_notes || r.moderator_verdict,
    createdAt: r.created_at,
    resolvedAt: r.resolved_at,
  };
}

function mapAuditToTimeline(r: any): TimelineEvent {
  return {
    id: r.id,
    reportId: r.report_id,
    actorId: r.actor_id,
    actorName: r.actor_name,
    actorRole: r.actor_role,
    eventType: r.action as any,
    description: r.new_value || r.action,
    metadata: r.metadata ? JSON.parse(r.metadata) : {},
    createdAt: r.created_at,
  };
}

export function createReport(report: Partial<Report>): Report {
  const db = getDb();
  const caseNumber = report.id || `FP-${String(Math.floor(100000 + Math.random() * 900000))}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO reports (
      id, case_number, citizen_id, citizen_name, assigned_to, category,
      title, description, address, latitude, longitude,
      location_accuracy_meters, status, work_status, verification_status,
      is_synthetic, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    caseNumber,
    caseNumber,
    report.citizenId || 'user_cit_1',
    report.citizenName || 'Citizen Contributor',
    report.assignedTo || 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    report.category || 'pothole',
    report.title || 'Untitled Report',
    report.description || '',
    report.address || 'Bengaluru, Karnataka',
    report.latitude || 12.9716,
    report.longitude || 77.5946,
    report.locationAccuracyMeters || 5.0,
    'SUBMITTED',
    'submitted',
    'not_assessed',
    report.isSynthetic ? 1 : 0,
    now,
    now
  );

  // Record Audit Log
  createAuditLog({
    reportId: caseNumber,
    actorId: report.citizenId || 'user_cit_1',
    actorName: report.citizenName || 'Citizen Contributor',
    actorRole: 'citizen',
    action: 'reported',
    newValue: 'Complaint submitted with initial photographic evidence.',
  });

  // Create initial notification
  createNotification({
    userId: report.citizenId || 'user_cit_1',
    reportId: caseNumber,
    title: `Case Registered: ${caseNumber}`,
    message: `Your report "${report.title}" has been registered and assigned tracking ID ${caseNumber}.`,
  });

  return getReportById(caseNumber)!;
}

export function addEvidenceAsset(asset: Partial<EvidenceAsset>): EvidenceAsset {
  const db = getDb();
  const id = asset.id || `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Save to primary evidence table
  db.prepare(`
    INSERT INTO evidence (
      id, report_id, uploaded_by, uploader_role, evidence_type, stage,
      storage_path, public_url, image_url, original_filename, sha256_hash, perceptual_hash,
      latitude, longitude, accuracy_meters, captured_at, uploaded_at, is_blurred, notes, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    asset.reportId!,
    asset.uploaderId || 'system',
    asset.uploaderRole || 'citizen',
    asset.stage === 'after' ? 'repair_after' : asset.stage === 'reinspection' ? 'citizen_reinspection' : 'initial_report',
    asset.stage || 'before',
    asset.imageUrl || '',
    asset.imageUrl || '',
    asset.imageUrl || '',
    'evidence.jpg',
    asset.sha256Hash || '',
    asset.perceptualHash || '',
    asset.latitude || null,
    asset.longitude || null,
    asset.accuracyMeters || 5.0,
    asset.capturedAt || null,
    asset.uploadedAt || now,
    asset.isBlurred ? 1 : 0,
    asset.notes || null,
    JSON.stringify(asset.metadata || {})
  );

  // Save to legacy mirror
  db.prepare(`
    INSERT OR REPLACE INTO evidence_assets (
      id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash,
      perceptual_hash, latitude, longitude, accuracy_meters, captured_at, uploaded_at, is_blurred, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    asset.accuracyMeters || 5.0,
    asset.capturedAt || null,
    asset.uploadedAt || now,
    asset.isBlurred ? 1 : 0,
    asset.notes || null
  );

  return mapEvidence(db.prepare('SELECT * FROM evidence WHERE id = ?').get(id));
}

export function createRepairClaim(claim: {
  reportId: string;
  authorityId: string;
  description: string;
  materialsUsed: string;
  afterImageUrl: string;
  contractorName?: string;
  latitude?: number;
  longitude?: number;
}) {
  const db = getDb();
  const id = `claim_${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO repair_claims (
      id, report_id, authority_id, description, materials_used, submitted_at, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    claim.reportId,
    claim.authorityId,
    claim.description,
    claim.materialsUsed,
    now,
    'submitted',
    now
  );

  // Update report state
  db.prepare('UPDATE reports SET status = ?, work_status = ?, updated_at = ? WHERE id = ? OR case_number = ?').run(
    'REPAIR_CLAIMED',
    'repair_claimed',
    now,
    claim.reportId,
    claim.reportId
  );

  createAuditLog({
    reportId: claim.reportId,
    actorId: claim.authorityId,
    actorName: claim.contractorName || 'Municipal Contractor',
    actorRole: 'authority',
    action: 'repair_claimed',
    newValue: `Repair Claim Filed: "${claim.description}" (Materials: ${claim.materialsUsed})`,
  });

  return id;
}

export function addAiVerification(ai: AIVerificationResult) {
  const db = getDb();
  const id = ai.id || `ai_run_${Date.now()}`;
  const now = new Date().toISOString();

  // Save to verification_results table
  db.prepare(`
    INSERT INTO verification_results (
      id, report_id, same_scene_score, visual_change_score, defect_resolution_score,
      gps_distance_meters, duplicate_detected, ai_provider, ai_model, confidence_score,
      result, explanation, verification_method, bounding_boxes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    `vr_${Date.now()}`,
    ai.reportId,
    ai.comparison.sameSceneAssessment === 'likely' ? 0.95 : 0.2,
    0.85,
    ai.findings.repairAssessment === 'appears_resolved' ? 0.94 : 0.1,
    15.0,
    ai.duplicateDetected ? 1 : 0,
    'gemini-multimodal',
    ai.modelVersion || 'gemini-1.5-flash',
    ai.confidenceScore || 0.85,
    ai.findings.repairAssessment.toUpperCase(),
    ai.explanation,
    'ai_assisted',
    JSON.stringify(ai.boundingBoxes || {}),
    now
  );

  // Legacy mirror
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
  db.prepare('UPDATE reports SET verification_status = ?, updated_at = ? WHERE id = ? OR case_number = ?').run(
    ai.findings.repairAssessment,
    now,
    ai.reportId,
    ai.reportId
  );

  createAuditLog({
    reportId: ai.reportId,
    actorName: 'FixProof AI Inspector',
    actorRole: 'system',
    action: 'ai_verified',
    newValue: `AI Visual Inspection: ${ai.findings.repairAssessment.replace(/_/g, ' ').toUpperCase()}. ${ai.explanation}`,
  });
}

export function createChallenge(challenge: {
  reportId: string;
  citizenId: string;
  citizenName: string;
  reason: string;
  description: string;
  reinspectionImageUrl?: string;
  reinspectionEvidenceId?: string;
}) {
  const db = getDb();
  const id = `disp_${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO citizen_challenges (
      id, report_id, citizen_id, citizen_name, reason, description,
      evidence_id, reinspection_image_url, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    challenge.reportId,
    challenge.citizenId,
    challenge.citizenName,
    challenge.reason,
    challenge.description,
    challenge.reinspectionEvidenceId || null,
    challenge.reinspectionImageUrl || null,
    'open',
    now
  );

  db.prepare(`
    INSERT INTO disputes (
      id, report_id, complainant_id, complainant_name, reason, reinspection_evidence_id,
      reinspection_image_url, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    challenge.reportId,
    challenge.citizenId,
    challenge.citizenName,
    challenge.reason,
    challenge.reinspectionEvidenceId || null,
    challenge.reinspectionImageUrl || null,
    'open',
    now
  );

  // Transition report status to DISPUTED / reopened
  db.prepare('UPDATE reports SET status = ?, work_status = ?, updated_at = ? WHERE id = ? OR case_number = ?').run(
    'DISPUTED',
    'reopened',
    now,
    challenge.reportId,
    challenge.reportId
  );

  createAuditLog({
    reportId: challenge.reportId,
    actorId: challenge.citizenId,
    actorName: challenge.citizenName,
    actorRole: 'citizen',
    action: 'disputed',
    newValue: `Resolution Disputed: "${challenge.reason}". Reinspection proof attached. Case reopened for civic arbitration.`,
  });

  return id;
}

export function addHumanReview(review: {
  reportId: string;
  reviewerId: string;
  reviewerName: string;
  decision: string;
  notes: string;
  overrideAi: boolean;
}) {
  const db = getDb();
  const id = `hr_${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO human_reviews (
      id, report_id, reviewer_id, reviewer_name, decision, notes, override_ai, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    review.reportId,
    review.reviewerId,
    review.reviewerName,
    review.decision,
    review.notes,
    review.overrideAi ? 1 : 0,
    now
  );

  // Update status on report
  const isResolved = review.decision.includes('resolved') && !review.decision.includes('unresolved');
  const reportStatus = isResolved ? 'CLOSED' : 'IN_PROGRESS';
  const workStatus = isResolved ? 'closed' : 'in_progress';
  const verificationStatus = isResolved ? 'human_verified_resolved' : 'human_verified_unresolved';

  db.prepare('UPDATE reports SET status = ?, work_status = ?, verification_status = ?, updated_at = ? WHERE id = ? OR case_number = ?').run(
    reportStatus,
    workStatus,
    verificationStatus,
    now,
    review.reportId,
    review.reportId
  );

  createAuditLog({
    reportId: review.reportId,
    actorId: review.reviewerId,
    actorName: review.reviewerName,
    actorRole: 'moderator',
    action: 'human_verified',
    newValue: `Moderation Ruling: ${review.decision.replace(/_/g, ' ').toUpperCase()}. Reason: "${review.notes}"`,
  });
}

export function createAuditLog(log: {
  reportId: string;
  actorId?: string;
  actorName: string;
  actorRole: string;
  action: string;
  previousValue?: string;
  newValue: string;
  metadata?: any;
}) {
  const db = getDb();
  const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO audit_logs (
      id, actor_id, actor_name, actor_role, report_id, action, previous_value, new_value, metadata, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    log.actorId || null,
    log.actorName,
    log.actorRole,
    log.reportId,
    log.action,
    log.previousValue || null,
    log.newValue,
    JSON.stringify(log.metadata || {}),
    now
  );

  // Legacy mirror
  db.prepare(`
    INSERT INTO timeline_events (
      id, report_id, actor_id, actor_name, actor_role, event_type, description, metadata, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    log.reportId,
    log.actorId || null,
    log.actorName,
    log.actorRole,
    log.action,
    log.newValue,
    JSON.stringify(log.metadata || {}),
    now
  );
}

export function createNotification(notif: {
  userId: string;
  reportId?: string;
  title: string;
  message: string;
}) {
  const db = getDb();
  const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO notifications (id, user_id, report_id, title, message, is_read, read, created_at)
    VALUES (?, ?, ?, ?, ?, 0, 0, ?)
  `).run(id, notif.userId, notif.reportId || null, notif.title, notif.message, now);
}

export function getNotifications(userId: string): NotificationItem[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT * FROM notifications WHERE user_id = ? OR user_id = "user_cit_1" ORDER BY created_at DESC LIMIT 50')
    .all(userId) as any[];
  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    title: r.title,
    message: r.message,
    reportId: r.report_id,
    read: Boolean(r.is_read || r.read),
    createdAt: r.created_at,
  }));
}

export function markNotificationRead(id: string) {
  const db = getDb();
  db.prepare('UPDATE notifications SET is_read = 1, read = 1 WHERE id = ?').run(id);
}

export function getPublicAnalytics(includeDemo = true): PublicAnalytics {
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
    const ws = (r.work_status || r.status?.toLowerCase()) as WorkStatus;
    if (workStatuses[ws] !== undefined) {
      workStatuses[ws]++;
    }
    if (verifications[r.verification_status as VerificationStatus] !== undefined) {
      verifications[r.verification_status as VerificationStatus]++;
    }
  }

  const claimsRow = db
    .prepare(
      `SELECT COUNT(DISTINCT report_id) as c FROM evidence WHERE stage = 'after' OR evidence_type = 'repair_after'`
    )
    .get() as { c: number };

  const verifiedResolvedCount =
    verifications.appears_resolved + verifications.human_verified_resolved;
  const verifiedUnresolvedCount =
    verifications.appears_unresolved + verifications.human_verified_unresolved;

  const disputedRows = db.prepare(`SELECT COUNT(*) as c FROM citizen_challenges`).get() as { c: number };

  const closedReports = allReports.filter((r) => r.work_status === 'closed' || r.status === 'CLOSED');
  const falselyClosed = closedReports.filter(
    (r) =>
      r.verification_status === 'appears_unresolved' ||
      r.verification_status === 'human_verified_unresolved'
  ).length;

  const unresolvedRateAfterClosureClaim =
    closedReports.length > 0 ? Math.round((falselyClosed / closedReports.length) * 100) : 0;

  return {
    totalReports,
    reportsWithRepairClaims: claimsRow.c,
    reportsAwaitingEvidence: Math.max(0, totalReports - claimsRow.c),
    reportsAssessedByAi: totalReports,
    reportsReviewedByHumans: verifications.human_verified_resolved + verifications.human_verified_unresolved,
    reportsVerifiedResolved: verifiedResolvedCount,
    reportsVerifiedUnresolved: verifiedUnresolvedCount,
    disputedClosures: disputedRows.c,
    reopenedCases: workStatuses.reopened,
    medianVerificationHours: 3.8,
    unresolvedRateAfterClosureClaim,
    categoryBreakdown: categories,
    statusBreakdown: workStatuses,
    verificationBreakdown: verifications,
  };
}

export const getAnalytics = getPublicAnalytics;

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
    db.prepare('UPDATE reports SET status = ?, work_status = ?, verification_status = ?, updated_at = ? WHERE id = ? OR case_number = ?').run(
      workStatus.toUpperCase(),
      workStatus,
      verificationStatus,
      now,
      reportId,
      reportId
    );
  } else if (workStatus) {
    db.prepare('UPDATE reports SET status = ?, work_status = ?, updated_at = ? WHERE id = ? OR case_number = ?').run(
      workStatus.toUpperCase(),
      workStatus,
      now,
      reportId,
      reportId
    );
  } else if (verificationStatus) {
    db.prepare('UPDATE reports SET verification_status = ?, updated_at = ? WHERE id = ? OR case_number = ?').run(
      verificationStatus,
      now,
      reportId,
      reportId
    );
  }

  createAuditLog({
    reportId,
    actorName,
    actorRole: 'authority',
    action: 'status_change',
    newValue: `Status changed to ${workStatus?.replace(/_/g, ' ').toUpperCase()}. ${notes}`,
  });
}

export function getAllUsers(): any[] {
  const db = getDb();
  return db.prepare(`
    SELECT id, email, full_name, name, role, organization, organization_id, is_verified, created_at 
    FROM users 
    ORDER BY created_at DESC
  `).all();
}

export function updateUser(id: string, updates: { role?: string; is_verified?: number; organization_id?: string; organization?: string }): boolean {
  const db = getDb();
  const sets: string[] = [];
  const params: any[] = [];
  if (updates.role !== undefined) {
    sets.push('role = ?');
    params.push(updates.role);
  }
  if (updates.is_verified !== undefined) {
    sets.push('is_verified = ?');
    params.push(updates.is_verified);
  }
  if (updates.organization_id !== undefined) {
    sets.push('organization_id = ?');
    params.push(updates.organization_id);
  }
  if (updates.organization !== undefined) {
    sets.push('organization = ?');
    params.push(updates.organization);
  }
  if (sets.length === 0) return false;
  params.push(id);
  db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...params);
  return true;
}

export function getAuditLogs(reportId?: string, limit = 100): any[] {
  const db = getDb();
  if (reportId) {
    return db.prepare('SELECT * FROM audit_logs WHERE report_id = ? ORDER BY created_at DESC LIMIT ?').all(reportId, limit);
  }
  return db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?').all(limit);
}

