const fs = require('fs');
const path = require('path');

// Read the seed file
const seedTsContent = fs.readFileSync(path.join(__dirname, '../src/lib/db/seed.ts'), 'utf-8');

// We can extract SYNTHETIC_CASES using a small script that transpiles seed.ts or using ts-node
console.log('Writing comprehensive supabase/seed.sql...');

let sql = `-- ==============================================================================
-- FIXPROOF — SUPABASE POSTGRESQL DEMONSTRATION SEED DATA
-- 10 Verifiable Civic Infrastructure Cases, Organizations, and Tamper-Proof Assets
-- ==============================================================================

-- 1. Organizations
INSERT INTO organizations (id, name, jurisdiction, contact_email, is_verified) VALUES
('org_bbmp', 'Bruhat Bengaluru Mahanagara Palike (BBMP)', 'Bengaluru Urban Wards 1-198', 'commissioner@bbmp.gov.in', true),
('org_ghmc', 'Greater Hyderabad Municipal Corporation (GHMC)', 'Hyderabad Central & Cyberabad Zones', 'commissioner@ghmc.gov.in', true),
('org_pwd', 'State Public Works Department (Roads & Bridges)', 'State Arterial Corridors', 'superintending.engineer@pwd.gov.in', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Users
INSERT INTO users (id, email, full_name, role, organization, avatar_url) VALUES
('user_cit_1', 'aditi.citizen@fixproof.org', 'Aditi Sharma', 'citizen', 'Resident (Indiranagar Ward 112)', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'),
('user_auth_1', 'rajesh.engineer@bbmp.gov.in', 'Rajesh Gowda', 'authority', 'BBMP Road Infrastructure & Ward Works', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'),
('user_mod_1', 'suresh.mod@fixproof.org', 'Suresh Menon', 'moderator', 'Independent Civic Review Board', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'),
('user_public', 'visitor@fixproof.org', 'Public Visitor', 'public', 'Civic Observer', NULL)
ON CONFLICT (id) DO NOTHING;
\n`;

// Also extract from SQLite DB if exists!
try {
  const { DatabaseSync } = require('node:sqlite');
  const dbPath = path.join(process.cwd(), 'data/fixproof.sqlite');
  if (fs.existsSync(dbPath)) {
    const db = new DatabaseSync(dbPath);

    // Reports
    const reports = db.prepare('SELECT * FROM reports').all();
    sql += `-- 3. Civic Defect Reports (${reports.length} records)\n`;
    for (const r of reports) {
      sql += `INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (\n`;
      sql += `  ${esc(r.id)}, ${esc(r.case_number)}, ${esc(r.citizen_id)}, ${esc(r.citizen_name)}, ${esc(r.assigned_to)}, ${esc(r.category)}::problem_category, ${esc(r.title)}, ${esc(r.description)}, ${esc(r.address)}, ${r.latitude}, ${r.longitude}, ${r.location_accuracy_meters || 5.0}, ${esc(r.status)}, ${esc(r.work_status)}::work_status, ${esc(r.verification_status)}::verification_status, ${r.is_synthetic ? 'true' : 'false'}, ${esc(r.created_at)}, ${esc(r.updated_at)}\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    }

    // Evidence Assets
    const evidence = db.prepare('SELECT * FROM evidence_assets').all();
    sql += `-- 4. Evidence Assets with Cryptographic Fingerprints (${evidence.length} records)\n`;
    for (const e of evidence) {
      sql += `INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (\n`;
      sql += `  ${esc(e.id)}, ${esc(e.report_id)}, ${esc(e.stage)}, ${esc(e.uploader_id)}, ${esc(e.uploader_role)}, ${esc(e.image_url)}, ${esc(e.sha256_hash)}, ${esc(e.perceptual_hash)}, ${e.latitude || 'NULL'}, ${e.longitude || 'NULL'}, ${e.accuracy_meters || 'NULL'}, ${e.is_blurred ? 'true' : 'false'}, ${esc(e.notes)}, ${esc(e.captured_at)}, ${esc(e.uploaded_at)}\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    }

    // Repair Claims
    const claims = db.prepare('SELECT * FROM repair_claims').all();
    if (claims.length > 0) {
      sql += `-- 5. Municipal Repair Claims (${claims.length} records)\n`;
      for (const c of claims) {
        sql += `INSERT INTO repair_claims (id, report_id, authority_id, contractor_name, description, materials_used, after_image_url, created_at) VALUES (\n`;
        sql += `  ${esc(c.id)}, ${esc(c.report_id)}, ${esc(c.authority_id)}, ${esc(c.contractor_name)}, ${esc(c.description)}, ${esc(c.materials_used)}, ${esc(c.after_image_url)}, ${esc(c.created_at)}\n`;
        sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
      }
    }

    // Verification Results
    const verifs = db.prepare('SELECT * FROM verification_results').all();
    if (verifs.length > 0) {
      sql += `-- 6. AI Verification Results (${verifs.length} records)\n`;
      for (const v of verifs) {
        sql += `INSERT INTO verification_results (id, report_id, category, same_scene_assessment, image_quality, location_evidence, time_evidence, original_defect_visible, remaining_defect_visible, repair_assessment, confidence_score, confidence_explanation, explanation, needs_human_review, model_version, duplicate_detected, scene_similarity_score, processed_at) VALUES (\n`;
        sql += `  ${esc(v.id)}, ${esc(v.report_id)}, ${esc(v.category)}::problem_category, ${esc(v.same_scene_assessment)}, ${esc(v.image_quality)}, ${esc(v.location_evidence)}, ${esc(v.time_evidence)}, ${v.original_defect_visible ? 'true' : 'false'}, ${v.remaining_defect_visible ? 'true' : 'false'}, ${esc(v.repair_assessment)}, ${v.confidence_score || 85}, ${esc(v.confidence_explanation)}, ${esc(v.explanation)}, ${v.needs_human_review ? 'true' : 'false'}, ${esc(v.model_version)}, ${v.duplicate_detected ? 'true' : 'false'}, ${v.scene_similarity_score || 0}, ${esc(v.processed_at)}\n`;
        sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
      }
    }

    // Citizen Challenges
    const challenges = db.prepare('SELECT * FROM citizen_challenges').all();
    if (challenges.length > 0) {
      sql += `-- 7. Citizen Challenges / Disputes (${challenges.length} records)\n`;
      for (const ch of challenges) {
        sql += `INSERT INTO citizen_challenges (id, report_id, citizen_id, citizen_name, reason, description, evidence_id, reinspection_image_url, status, moderator_notes, created_at) VALUES (\n`;
        sql += `  ${esc(ch.id)}, ${esc(ch.report_id)}, ${esc(ch.citizen_id)}, ${esc(ch.citizen_name)}, ${esc(ch.reason)}, ${esc(ch.description)}, ${esc(ch.evidence_id)}, ${esc(ch.reinspection_image_url)}, ${esc(ch.status)}, ${esc(ch.moderator_notes)}, ${esc(ch.created_at)}\n`;
        sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
      }
    }

    // Audit Logs
    const audits = db.prepare('SELECT * FROM audit_logs').all();
    if (audits.length > 0) {
      sql += `-- 8. Audit Logs (${audits.length} records)\n`;
      for (const a of audits) {
        sql += `INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (\n`;
        sql += `  ${esc(a.id)}, ${esc(a.report_id)}, ${esc(a.actor_id)}, ${esc(a.actor_name)}, ${esc(a.actor_role)}, ${esc(a.action)}, ${esc(a.new_value)}, ${esc(a.created_at)}\n`;
        sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
      }
    }
  }
} catch (e) {
  console.warn('Could not read sqlite:', e);
}

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

fs.writeFileSync(path.join(__dirname, '../supabase/seed.sql'), sql, 'utf-8');
console.log('Successfully generated supabase/seed.sql (' + sql.length + ' bytes)');
