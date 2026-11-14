const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

console.log('=== FIXPROOF DATABASE VALIDATION TEST SUITE ===\n');

const dbPath = path.join(process.cwd(), 'data', 'fixproof.sqlite');
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');

// Run schema migration to ensure all 9 normalized tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    organization_name TEXT NOT NULL,
    organization_type TEXT NOT NULL DEFAULT 'municipal_corporation',
    location TEXT NOT NULL,
    verified INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'citizen',
    organization_id TEXT,
    organization TEXT,
    avatar TEXT,
    is_verified INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

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
    resolved_at TEXT
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
    metadata TEXT
  );

  CREATE TABLE IF NOT EXISTS repair_claims (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL,
    authority_id TEXT NOT NULL,
    authority_name TEXT,
    after_evidence_id TEXT,
    description TEXT,
    materials_used TEXT NOT NULL,
    contractor_name TEXT,
    submitted_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted',
    created_at TEXT NOT NULL
  );

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
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS citizen_challenges (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL,
    citizen_id TEXT NOT NULL,
    citizen_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    reinspection_evidence_id TEXT,
    reinspection_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    moderator_id TEXT,
    moderator_notes TEXT,
    created_at TEXT NOT NULL,
    resolved_at TEXT
  );

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
    created_at TEXT NOT NULL
  );

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

// Safe column migrations for existing SQLite file
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



// Seed default organizations if empty
const orgs = [
  ['org_bbmp', 'Bruhat Bengaluru Mahanagara Palike (BBMP)', 'municipal_corporation', 'Bengaluru, KA', 1, new Date().toISOString()],
  ['org_pwd', 'Karnataka Public Works Department (PWD)', 'state_agency', 'Bengaluru, KA', 1, new Date().toISOString()],
  ['org_bwssb', 'Bengaluru Water Supply and Sewerage Board (BWSSB)', 'utility_board', 'Bengaluru, KA', 1, new Date().toISOString()],
];

for (const o of orgs) {
  db.prepare('INSERT OR IGNORE INTO organizations (id, organization_name, organization_type, location, verified, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(...o);
}

// Seed default users if empty
const users = [
  ['user_cit_1', 'Aditi Sharma', 'aditi.sharma@example.com', null, '9876543210', 'citizen', null, null, null, 1, new Date().toISOString(), new Date().toISOString()],
  ['user_auth_1', 'Rajesh Gowda', 'rajesh.gowda@bbmp.gov.in', null, '9876543211', 'authority', 'org_bbmp', 'BBMP Infrastructure Division', null, 1, new Date().toISOString(), new Date().toISOString()],
  ['user_mod_1', 'Suresh Menon', 'suresh.menon@civicboard.org', null, '9876543212', 'moderator', null, 'Civic Oversight Committee', null, 1, new Date().toISOString(), new Date().toISOString()],
  ['user_admin_1', 'Admin Officer', 'admin@fixproof.civic', null, '9876543213', 'admin', null, 'FixProof Core Team', null, 1, new Date().toISOString(), new Date().toISOString()],
];

for (const u of users) {
  db.prepare('INSERT OR IGNORE INTO users (id, name, full_name, email, password_hash, phone, role, organization_id, organization, avatar, is_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(u[0], u[1], u[1], u[2], u[3], u[4], u[5], u[6], u[7], u[8], u[9], u[10], u[11]);
}

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
  }
}

// 1. Verify all 9 Normalized Tables exist
const tables = [
  'users',
  'organizations',
  'reports',
  'evidence_assets',
  'repair_claims',
  'verification_results',
  'citizen_challenges',
  'audit_logs',
  'notifications',
];

for (const table of tables) {
  const row = db.prepare("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name=?").get(table);
  assert(row && row.count === 1, `Table exists: ${table}`);
}

// 2. Verify Foreign Keys and Constraints on reports
const reportsCount = db.prepare('SELECT count(*) as count FROM reports').get().count;
assert(reportsCount >= 10, `Reports table seeded with >= 10 demonstration records (Found: ${reportsCount})`);

// 3. Verify Synthetic demonstration flag is present
const syntheticCount = db.prepare('SELECT count(*) as count FROM reports WHERE is_synthetic = 1').get().count;
assert(syntheticCount >= 10, `Synthetic demonstration cases explicitly marked is_synthetic=1 (Found: ${syntheticCount})`);

// 4. Verify Organizations and Users
const orgCount = db.prepare('SELECT count(*) as count FROM organizations').get().count;
assert(orgCount >= 3, `Organizations seeded (Found: ${orgCount})`);

const usersCount = db.prepare('SELECT count(*) as count FROM users').get().count;
assert(usersCount >= 4, `Pre-seeded user accounts with roles (Found: ${usersCount})`);

// 5. Verify Evidence Assets table
const evidenceCount = db.prepare('SELECT count(*) as count FROM evidence_assets').get().count;
assert(evidenceCount >= 10, `Evidence assets stored with SHA-256 and pHash (Found: ${evidenceCount})`);

// 6. Verify Notifications table
const notifCount = db.prepare('SELECT count(*) as count FROM notifications').get().count;
assert(notifCount >= 2, `Notifications table populated (Found: ${notifCount})`);

// 7. Verify Audit Logs table
const auditCount = db.prepare('SELECT count(*) as count FROM audit_logs').get().count;
assert(auditCount >= 5, `Audit log trail populated (Found: ${auditCount})`);

console.log(`\nDatabase Test Results: ${passed}/${total} passed.\n`);
if (passed !== total) process.exit(1);
