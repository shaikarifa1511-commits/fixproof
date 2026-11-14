-- ==============================================================================
-- FIXPROOF — ALL-IN-ONE SUPABASE POSTGRESQL TABLES & SEED DATA
-- "Reported. Repaired. Verified."
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('citizen', 'authority', 'moderator', 'public', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE problem_category AS ENUM ('pothole', 'garbage', 'footpath', 'drainage', 'infrastructure');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE work_status AS ENUM (
        'submitted', 'under_review', 'work_scheduled', 'in_progress', 'repair_claimed', 'closed', 'reopened'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM (
        'not_assessed', 'awaiting_after_evidence', 'ai_pending', 'appears_resolved', 'appears_unresolved',
        'partially_resolved', 'insufficient_evidence', 'human_review_required', 'human_verified_resolved', 'human_verified_unresolved'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'citizen',
    organization TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Reports
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    case_number TEXT UNIQUE NOT NULL,
    citizen_id TEXT NOT NULL,
    citizen_name TEXT NOT NULL,
    assigned_to TEXT,
    category problem_category NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    location_accuracy_meters NUMERIC(6, 2) DEFAULT 5.0,
    status TEXT DEFAULT 'SUBMITTED',
    work_status work_status DEFAULT 'submitted',
    verification_status verification_status DEFAULT 'not_assessed',
    is_synthetic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Evidence Assets
CREATE TABLE IF NOT EXISTS evidence_assets (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (stage IN ('before', 'after', 'reinspection')),
    uploader_id TEXT NOT NULL,
    uploader_role TEXT NOT NULL,
    image_url TEXT NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    perceptual_hash VARCHAR(64) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    accuracy_meters NUMERIC(6, 2),
    is_blurred BOOLEAN DEFAULT FALSE,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    captured_at TIMESTAMPTZ DEFAULT NOW(),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Repair Claims
CREATE TABLE IF NOT EXISTS repair_claims (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    authority_id TEXT NOT NULL,
    contractor_name TEXT,
    description TEXT NOT NULL,
    materials_used TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Verification Results
CREATE TABLE IF NOT EXISTS verification_results (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    category problem_category NOT NULL,
    same_scene_assessment TEXT NOT NULL,
    image_quality TEXT NOT NULL,
    location_evidence TEXT NOT NULL,
    time_evidence TEXT NOT NULL,
    original_defect_visible BOOLEAN DEFAULT TRUE,
    remaining_defect_visible BOOLEAN DEFAULT FALSE,
    repair_assessment TEXT NOT NULL,
    confidence_score NUMERIC(5, 2) DEFAULT 85.00,
    confidence_explanation TEXT NOT NULL,
    explanation TEXT NOT NULL,
    needs_human_review BOOLEAN DEFAULT FALSE,
    model_version TEXT DEFAULT 'gemini-1.5-flash',
    duplicate_detected BOOLEAN DEFAULT FALSE,
    scene_similarity_score NUMERIC(5, 2) DEFAULT 0.00,
    bounding_boxes JSONB,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Citizen Challenges
CREATE TABLE IF NOT EXISTS citizen_challenges (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    citizen_id TEXT NOT NULL,
    citizen_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_id TEXT,
    reinspection_image_url TEXT,
    status TEXT DEFAULT 'open',
    moderator_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 8. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    actor_id TEXT,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT NOT NULL,
    ip_address TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    report_id TEXT REFERENCES reports(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read reports" ON reports;
CREATE POLICY "Public read reports" ON reports FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permit insert reports" ON reports;
CREATE POLICY "Permit insert reports" ON reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read evidence" ON evidence_assets;
CREATE POLICY "Public read evidence" ON evidence_assets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permit insert evidence" ON evidence_assets;
CREATE POLICY "Permit insert evidence" ON evidence_assets FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read claims" ON repair_claims;
CREATE POLICY "Public read claims" ON repair_claims FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permit insert claims" ON repair_claims;
CREATE POLICY "Permit insert claims" ON repair_claims FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read verification" ON verification_results;
CREATE POLICY "Public read verification" ON verification_results FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permit insert verification" ON verification_results;
CREATE POLICY "Permit insert verification" ON verification_results FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read challenges" ON citizen_challenges;
CREATE POLICY "Public read challenges" ON citizen_challenges FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permit insert challenges" ON citizen_challenges;
CREATE POLICY "Permit insert challenges" ON citizen_challenges FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read audit" ON audit_logs;
CREATE POLICY "Public read audit" ON audit_logs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permit insert audit" ON audit_logs;
CREATE POLICY "Permit insert audit" ON audit_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read organizations" ON organizations;
CREATE POLICY "Public read organizations" ON organizations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read users" ON users;
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read notifications" ON notifications;
CREATE POLICY "Public read notifications" ON notifications FOR SELECT USING (true);

-- Seed Initial Organizations & Users
INSERT INTO organizations (id, name, jurisdiction, contact_email, is_verified) VALUES
('org_bbmp', 'Bruhat Bengaluru Mahanagara Palike (BBMP)', 'Bengaluru Urban Wards 1-198', 'commissioner@bbmp.gov.in', true),
('org_ghmc', 'Greater Hyderabad Municipal Corporation (GHMC)', 'Hyderabad Central & Cyberabad Zones', 'commissioner@ghmc.gov.in', true),
('org_pwd', 'State Public Works Department (Roads & Bridges)', 'State Arterial Corridors', 'superintending.engineer@pwd.gov.in', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, full_name, role, organization, avatar_url) VALUES
('user_cit_1', 'aditi.citizen@fixproof.org', 'Aditi Sharma', 'citizen', 'Resident (Indiranagar Ward 112)', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'),
('user_auth_1', 'rajesh.engineer@bbmp.gov.in', 'Rajesh Gowda', 'authority', 'BBMP Road Infrastructure & Ward Works', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'),
('user_mod_1', 'suresh.mod@fixproof.org', 'Suresh Menon', 'moderator', 'Independent Civic Review Board', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'),
('user_public', 'visitor@fixproof.org', 'Public Visitor', 'public', 'Civic Observer', NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Key Demonstration Civic Case 1 (Verified Resolved Pothole)
INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic) VALUES
('FP-000101', 'FP-000101', 'user_cit_1', 'Aditi Sharma', 'Bruhat Bengaluru Mahanagara Palike (BBMP) - Ward 112', 'pothole', 'Deep Hazardous Pothole on 100ft Road', 'Dangerous 15cm deep pothole causing two-wheelers to skid near 12th Main junction.', '100ft Road, Indiranagar, Bengaluru', 12.9719, 77.6412, 4.5, 'CLOSED', 'closed', 'appears_resolved', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes) VALUES
('ev_001_b', 'FP-000101', 'before', 'user_cit_1', 'citizen', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80', 'a8b79e13b823e201c9a1d489b1425b03e04f056291a1482b8a74e5021f19f201', 'c4e09871ab9011f0', 12.9719, 77.6412, 4.5, false, 'Deep road depression exposing crushed granite base.'),
('ev_001_a', 'FP-000101', 'after', 'user_auth_1', 'authority', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', '7c98f01b34e29a76d1e43b22091c855a90102e3b879c210a459b7201bc89a012', 'c4e09871cd4322e1', 12.9720, 77.6413, 5.0, false, 'Compacted hot bituminous concrete patch applied by ward crew.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO verification_results (id, report_id, category, same_scene_assessment, image_quality, location_evidence, time_evidence, original_defect_visible, remaining_defect_visible, repair_assessment, confidence_score, confidence_explanation, explanation, needs_human_review, model_version) VALUES
('vr_001', 'FP-000101', 'pothole', 'likely', 'sufficient', 'consistent', 'plausible', true, false, 'appears_resolved', 94.00, 'Surface elevation and texture uniformity confirm complete asphalt patch.', 'The pothole crater has been filled flush with compacted asphalt.', false, 'fixproof-cv-v2.1')
ON CONFLICT (id) DO NOTHING;

-- Seed Key Demonstration Civic Case 2 (False Closure Caught!)
INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic) VALUES
('FP-000102', 'FP-000102', 'user_cit_1', 'Aditi Sharma', 'Bruhat Bengaluru Mahanagara Palike (BBMP) - Ward 112', 'pothole', 'Dangerous Unfilled Crater on 80ft Road', 'Authority marked complaint closed, but AI verification detected the crater still remains unfilled.', '80ft Road, HAL 2nd Stage, Indiranagar, Bengaluru', 12.9698, 77.6499, 3.8, 'DISPUTED', 'reopened', 'appears_unresolved', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes) VALUES
('ev_002_b', 'FP-000102', 'before', 'user_cit_1', 'citizen', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'b7d61248c891e310d5f2a1b9c43e0582a17f09321c456891a273b0542e89d102', 'f8e08923bc1100e4', 12.9698, 77.6499, 3.8, false, 'Large crater active on lane divider.'),
('ev_002_a', 'FP-000102', 'after', 'user_auth_1', 'authority', 'https://images.unsplash.com/photo-1584463699042-3e33e49e29a9?auto=format&fit=crop&w=1200&q=80', '1e4590ab34c71289e01f5634b829c410e75a901823bc541298e321045f8910b4', 'f8e08923bc1122f9', 12.9699, 77.6501, 4.2, false, 'Contractor photo showing only thin gravel dust with crater still active.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO verification_results (id, report_id, category, same_scene_assessment, image_quality, location_evidence, time_evidence, original_defect_visible, remaining_defect_visible, repair_assessment, confidence_score, confidence_explanation, explanation, needs_human_review, model_version) VALUES
('vr_002', 'FP-000102', 'pothole', 'likely', 'sufficient', 'consistent', 'plausible', true, true, 'appears_unresolved', 91.00, 'Crater cavity remains clearly visible. Repair is superficial and non-compliant.', 'The submitted photo shows the same location, but the original crater is still clearly visible with uncompacted aggregate.', true, 'fixproof-cv-v2.1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO citizen_challenges (id, report_id, citizen_id, citizen_name, reason, description, status) VALUES
('disp_002', 'FP-000102', 'user_cit_1', 'Aditi Sharma', 'False Closure: Pothole Was Not Repaired', 'The contractor merely dumped loose stones. The 10cm crater remains active and dangerous to vehicles.', 'open')
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_name, actor_role, action, new_value) VALUES
('aud_001', 'FP-000101', 'Aditi Sharma', 'citizen', 'reported', 'Complaint reported on 100ft Road.'),
('aud_002', 'FP-000101', 'Rajesh Gowda', 'authority', 'repair_claimed', 'Repair claimed with photographic completion proof.'),
('aud_003', 'FP-000101', 'FixProof AI Verifier', 'system', 'ai_verified', 'AI verified repair: appears_resolved (94% confidence).'),
('aud_004', 'FP-000102', 'FixProof AI Verifier', 'system', 'ai_verified', 'AI verified repair: appears_unresolved! Crater still visible.'),
('aud_005', 'FP-000102', 'Aditi Sharma', 'citizen', 'disputed', 'Citizen filed official dispute against false closure.');
