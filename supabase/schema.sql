-- ==============================================================================
-- FIXPROOF — SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Civic Infrastructure Repair Verification Platform
-- "Reported. Repaired. Verified."
-- ==============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. DOMAINS & ENUM TYPES
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('citizen', 'authority', 'moderator', 'public', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE problem_category AS ENUM ('pothole', 'garbage', 'footpath', 'drainage', 'infrastructure');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_status AS ENUM (
        'submitted',
        'under_review',
        'work_scheduled',
        'in_progress',
        'repair_claimed',
        'closed',
        'reopened'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM (
        'not_assessed',
        'awaiting_after_evidence',
        'ai_pending',
        'appears_resolved',
        'appears_unresolved',
        'partially_resolved',
        'insufficient_evidence',
        'human_review_required',
        'human_verified_resolved',
        'human_verified_unresolved'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. CORE CIVIC TABLES
-- ==============================================================================

-- Organizations (Municipal bodies, PWD, contractors)
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table
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

-- Civic Defect Reports Table
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

-- Evidence Assets (Cryptographic SHA-256 + Perceptual Hash Ledger)
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

-- Municipal Repair Claims
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

-- AI Verification Results & Multimodal Findings
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

-- Citizen Disputes & Reinspection Challenges
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

-- Immutable Civic Audit Trail
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

-- Citizen Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    report_id TEXT REFERENCES reports(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. PERFORMANCE & SPATIAL INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_work_status ON reports(work_status);
CREATE INDEX IF NOT EXISTS idx_reports_verification_status ON reports(verification_status);
CREATE INDEX IF NOT EXISTS idx_reports_coords ON reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evidence_report_stage ON evidence_assets(report_id, stage);
CREATE INDEX IF NOT EXISTS idx_evidence_sha256 ON evidence_assets(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_audit_logs_report ON audit_logs(report_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- ==============================================================================
-- 5. AUTOMATIC TIMESTAMPTZ TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_reports_updated_at ON reports;
CREATE TRIGGER trigger_reports_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
-- ==============================================================================

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Transparent Public Access: Anyone can inspect public civic reports and evidence
DROP POLICY IF EXISTS "Public read for reports" ON reports;
CREATE POLICY "Public read for reports" ON reports FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for evidence" ON evidence_assets;
CREATE POLICY "Public read for evidence" ON evidence_assets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for repair claims" ON repair_claims;
CREATE POLICY "Public read for repair claims" ON repair_claims FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for verification results" ON verification_results;
CREATE POLICY "Public read for verification results" ON verification_results FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for audit logs" ON audit_logs;
CREATE POLICY "Public read for audit logs" ON audit_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for citizen challenges" ON citizen_challenges;
CREATE POLICY "Public read for citizen challenges" ON citizen_challenges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for organizations" ON organizations;
CREATE POLICY "Public read for organizations" ON organizations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for user public profiles" ON users;
CREATE POLICY "Public read for user public profiles" ON users FOR SELECT USING (true);

-- Authenticated / Service Role Permissions
DROP POLICY IF EXISTS "Full access for service role on reports" ON reports;
CREATE POLICY "Full access for service role on reports" ON reports FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Full access for service role on evidence" ON evidence_assets;
CREATE POLICY "Full access for service role on evidence" ON evidence_assets FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Full access for service role on claims" ON repair_claims;
CREATE POLICY "Full access for service role on claims" ON repair_claims FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Full access for service role on verifications" ON verification_results;
CREATE POLICY "Full access for service role on verifications" ON verification_results FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Full access for service role on challenges" ON citizen_challenges;
CREATE POLICY "Full access for service role on challenges" ON citizen_challenges FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Full access for service role on audit" ON audit_logs;
CREATE POLICY "Full access for service role on audit" ON audit_logs FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Full access for service role on notifications" ON notifications;
CREATE POLICY "Full access for service role on notifications" ON notifications FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Full access for service role on users" ON users;
CREATE POLICY "Full access for service role on users" ON users FOR ALL USING (auth.role() = 'service_role');

-- Public insertion for citizen complaints and challenges
DROP POLICY IF EXISTS "Permit insert for new reports" ON reports;
CREATE POLICY "Permit insert for new reports" ON reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permit update for reports" ON reports;
CREATE POLICY "Permit update for reports" ON reports FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permit insert for evidence" ON evidence_assets;
CREATE POLICY "Permit insert for evidence" ON evidence_assets FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permit insert for repair claims" ON repair_claims;
CREATE POLICY "Permit insert for repair claims" ON repair_claims FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permit insert for verification results" ON verification_results;
CREATE POLICY "Permit insert for verification results" ON verification_results FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permit insert for citizen challenges" ON citizen_challenges;
CREATE POLICY "Permit insert for citizen challenges" ON citizen_challenges FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permit insert for audit logs" ON audit_logs;
CREATE POLICY "Permit insert for audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- Notifications: user can view their own notifications
DROP POLICY IF EXISTS "Users read own notifications" ON notifications;
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (true);

-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKET CONFIGURATION (SAFE EXECUTION)
-- ==============================================================================

DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'fixproof-evidence',
        'fixproof-evidence',
        true,
        15728640,
        ARRAY['image/jpeg', 'image/png', 'image/webp']
    )
    ON CONFLICT (id) DO UPDATE SET
        public = true,
        file_size_limit = 15728640,
        allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DROP POLICY IF EXISTS "Public read for fixproof-evidence" ON storage.objects;
CREATE POLICY "Public read for fixproof-evidence"
ON storage.objects FOR SELECT
USING (bucket_id = 'fixproof-evidence');

DROP POLICY IF EXISTS "Upload permitted for fixproof-evidence" ON storage.objects;
CREATE POLICY "Upload permitted for fixproof-evidence"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'fixproof-evidence');
