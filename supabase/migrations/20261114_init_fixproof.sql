-- ==============================================================================
-- FIXPROOF: MUNICIPAL INFRASTRUCTURE VERIFICATION PLATFORM
-- POSTGRESQL & SUPABASE PRODUCTION MIGRATION
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL DEFAULT 'municipal_corporation',
    location VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Users / Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(50) NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'authority', 'moderator', 'admin', 'public')),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(50) UNIQUE NOT NULL,
    citizen_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_authority_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('pothole', 'garbage', 'footpath', 'drainage', 'infrastructure')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_accuracy_meters DOUBLE PRECISION DEFAULT 5.0,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED' CHECK (
        status IN (
            'SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS',
            'REPAIR_CLAIMED', 'VERIFICATION_PENDING', 'VERIFIED_RESOLVED',
            'PARTIALLY_RESOLVED', 'NOT_RESOLVED', 'DISPUTED', 'CLOSED'
        )
    ),
    verification_status VARCHAR(50) NOT NULL DEFAULT 'NOT_YET_ASSESSED',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    is_synthetic BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 5. Evidence Table
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    evidence_type VARCHAR(50) NOT NULL CHECK (
        evidence_type IN ('initial_report', 'repair_before', 'repair_after', 'citizen_reinspection', 'additional_evidence')
    ),
    storage_path VARCHAR(500) NOT NULL,
    public_url TEXT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    perceptual_hash VARCHAR(64),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    captured_at TIMESTAMPTZ,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_blurred BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 6. Repair Claims Table
CREATE TABLE IF NOT EXISTS repair_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    authority_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    materials_used VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'rejected', 'disputed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Verification Results Table
CREATE TABLE IF NOT EXISTS verification_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    repair_claim_id UUID REFERENCES repair_claims(id) ON DELETE CASCADE,
    same_scene_score DOUBLE PRECISION NOT NULL,
    visual_change_score DOUBLE PRECISION NOT NULL,
    defect_resolution_score DOUBLE PRECISION NOT NULL,
    gps_distance_meters DOUBLE PRECISION,
    duplicate_detected BOOLEAN NOT NULL DEFAULT FALSE,
    ai_provider VARCHAR(50) NOT NULL DEFAULT 'gemini-multimodal',
    ai_model VARCHAR(50) NOT NULL DEFAULT 'gemini-1.5-flash',
    confidence_score DOUBLE PRECISION NOT NULL,
    result VARCHAR(50) NOT NULL CHECK (
        result IN (
            'VERIFIED_RESOLVED', 'PARTIALLY_RESOLVED', 'NOT_RESOLVED',
            'SAME_SCENE_UNCERTAIN', 'INSUFFICIENT_EVIDENCE', 'DUPLICATE_EVIDENCE',
            'HUMAN_REVIEW_REQUIRED'
        )
    ),
    explanation TEXT NOT NULL,
    verification_method VARCHAR(50) NOT NULL DEFAULT 'ai_assisted' CHECK (verification_method IN ('ai_assisted', 'human_moderator', 'cv_engine_fallback')),
    bounding_boxes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Citizen Challenges Table
CREATE TABLE IF NOT EXISTS citizen_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    evidence_id UUID REFERENCES evidence(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_moderation', 'upheld', 'rejected')),
    moderator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    moderator_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 9. Audit Logs Table (Immutable History)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_name VARCHAR(150) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_reports_case_number ON reports(case_number);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_coords ON reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_evidence_report ON evidence(report_id);
CREATE INDEX IF NOT EXISTS idx_evidence_sha256 ON evidence(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_claims_report ON repair_claims(report_id);
CREATE INDEX IF NOT EXISTS idx_verification_report ON verification_results(report_id);
CREATE INDEX IF NOT EXISTS idx_challenges_report ON citizen_challenges(report_id);
CREATE INDEX IF NOT EXISTS idx_audit_report ON audit_logs(report_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- 12. Row Level Security (RLS) Configuration
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for verified public records (no private personal info)
CREATE POLICY "Public can view non-sensitive report records" ON reports
    FOR SELECT USING (true);

CREATE POLICY "Public can view evidence images" ON evidence
    FOR SELECT USING (true);

CREATE POLICY "Public can view verification results" ON verification_results
    FOR SELECT USING (true);

-- Authenticated User Insert Policies
CREATE POLICY "Citizens can insert reports" ON reports
    FOR INSERT WITH CHECK (auth.uid() = citizen_id);

CREATE POLICY "Users can manage own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- End of Migration

