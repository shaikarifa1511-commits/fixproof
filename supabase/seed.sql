-- ==============================================================================
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

-- 3. Civic Defect Reports (11 records)
INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (
  'FP-000101', NULL, 'user_cit_1', 'Aditi Sharma', 'Bruhat Bengaluru Mahanagara Palike (BBMP) - Ward 112', 'pothole'::problem_category, 'Deep Hazardous Pothole on 100ft Road', 'Dangerous 15cm deep pothole causing two-wheelers to skid near 12th Main junction.', '100ft Road, Near 12th Main Junction, Indiranagar, Bengaluru, KA 560038', 12.9719, 77.6412, 4.5, NULL, 'closed'::work_status, 'appears_resolved'::verification_status, true, '2026-11-01T09:30:00Z', '2026-11-04T15:00:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (
  'FP-000102', NULL, 'user_cit_2', 'Rahul Varma', 'Bengaluru Development Authority (BDA) Roads Wing', 'pothole'::problem_category, 'Gaping Pothole on Outer Ring Road Flyover Approach', 'Sharp crater in central lane tearing tire sidewalls. Vehicle traffic repeatedly braking violently.', 'ORR Flyover Approach, Bellandur, Bengaluru, KA 560103', 12.9352, 77.6835, 6, NULL, 'closed'::work_status, 'appears_unresolved'::verification_status, true, '2026-11-02T11:00:00Z', '2026-11-05T16:00:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (
  'FP-000103', NULL, 'user_cit_3', 'Sneha Patel', 'BBMP South Zone Infrastructure', 'pothole'::problem_category, 'Broad Pothole Cluster on Bannerghatta Road', 'Multiple connected road depressions across two traffic lanes.', 'Near Arekere Gate, Bannerghatta Main Road, Bengaluru, KA 560076', 12.8893, 77.5968, 5.2, NULL, 'in_progress'::work_status, 'partially_resolved'::verification_status, true, '2026-11-03T08:15:00Z', '2026-11-06T11:30:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (
  'FP-000104', NULL, 'user_cit_4', 'Deepak Rao', 'BBMP Solid Waste Management (SWM)', 'garbage'::problem_category, 'Overflowing Waste Dump Beside Metro Pillar 140', 'Illegal dumping site spanning 10 meters of pedestrian footpath with decaying organic waste.', 'Beside Metro Pillar 140, CMH Road, Indiranagar, Bengaluru, KA 560038', 12.9784, 77.6408, 4, NULL, 'closed'::work_status, 'appears_resolved'::verification_status, true, '2026-11-04T07:45:00Z', '2026-11-05T13:20:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (
  'FP-000105', NULL, 'user_cit_5', 'Farhan Ali', 'BBMP East Zone Sanitation', 'garbage'::problem_category, 'Persistent Commercial Waste Heap behind Commercial Street', 'Packaging crates, plastic bags and food debris dumped every evening.', 'Behind Commercial Street, Tasker Town, Shivajinagar, Bengaluru, KA 560051', 12.9818, 77.6083, 5.5, NULL, 'closed'::work_status, 'appears_unresolved'::verification_status, true, '2026-11-05T14:10:00Z', '2026-11-07T10:00:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (
  'FP-000106', NULL, 'user_cit_6', 'Meera Nambiar', 'BBMP Major Stormwater Drains Division', 'drainage'::problem_category, 'Broken Storm Drain Slabs on MG Road', 'Concrete drain cover shattered leaving open 6-foot pit on walking path.', 'Opposite Metro Station Exit B, MG Road, Bengaluru, KA 560001', 12.9754, 77.6067, 4, NULL, 'under_review'::work_status, 'insufficient_evidence'::verification_status, true, '2026-11-06T10:00:00Z', '2026-11-08T12:00:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (
  'FP-000107', NULL, 'user_cit_7', 'Kavita Swaminathan', 'BBMP South Zone Pedestrian Infrastructure', 'footpath'::problem_category, 'Displaced Paving Stones on Jayanagar 4th Block Footpath', 'Tripping hazard near bus stop where senior citizens have fallen.', 'Opposite Jayanagar 4th Block Complex, Bengaluru, KA 560011', 12.9298, 77.5828, 4.8, NULL, 'in_progress'::work_status, 'insufficient_evidence'::verification_status, true, '2026-11-07T11:20:00Z', '2026-11-09T14:10:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (
  'FP-000108', NULL, 'user_cit_8', 'Vikram Joshi', 'BMRCL & Traffic Police Infrastructure Cell', 'pothole'::problem_category, 'Waterlogged Pothole at Silk Board Junction Ramp', 'Water-filled road crater concealing exposed rebar.', 'Silk Board Junction Flyover Ramp, Bengaluru, KA 560068', 12.9172, 77.6228, 5, NULL, 'under_review'::work_status, 'appears_unresolved'::verification_status, true, '2026-11-08T08:30:00Z', '2026-11-10T16:20:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (
  'FP-000109', NULL, 'user_cit_9', 'Priya Sundaram', 'Mahadevapura Zone BBMP', 'drainage'::problem_category, 'Missing Drainage Grating near ITPL Main Gate', 'Pedestrian storm drain metal grating stolen, leaving open ditch.', 'ITPL Main Gate, Whitefield, Bengaluru, KA 560066', 12.9863, 77.7314, 5, NULL, 'in_progress'::work_status, 'insufficient_evidence'::verification_status, true, '2026-11-09T09:10:00Z', '2026-11-11T14:40:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (
  'FP-000110', NULL, 'user_cit_10', 'Ramesh Hegde', 'BBMP West Zone Maintenance', 'pothole'::problem_category, 'Pavement Depression and Water Stagnation in Malleshwaram', 'Severe depression on 8th Cross road trapping stagnant foul water.', '8th Cross, Sampige Road, Malleshwaram, Bengaluru, KA 560003', 12.9984, 77.5712, 4.2, NULL, 'reopened'::work_status, 'human_verified_unresolved'::verification_status, true, '2026-11-10T10:00:00Z', '2026-11-13T17:00:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (id, case_number, citizen_id, citizen_name, assigned_to, category, title, description, address, latitude, longitude, location_accuracy_meters, status, work_status, verification_status, is_synthetic, created_at, updated_at) VALUES (
  'FP-121117', NULL, 'user_cit_1', 'Aditi Sharma', 'Bruhat Bengaluru Mahanagara Palike (BBMP)', 'footpath'::problem_category, 'E2E Test: Broken Footpath Slabs on 100ft Road', 'Dislodged concrete slabs and tripping hazard near bus shelter.', '100ft Road, Bengaluru', 12.9719, 77.6412, 5, NULL, 'closed'::work_status, 'human_verified_resolved'::verification_status, false, '2026-11-14T05:39:42.395Z', '2026-11-14T05:39:42.465Z'
) ON CONFLICT (id) DO NOTHING;

-- 4. Evidence Assets with Cryptographic Fingerprints (23 records)
INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_001_b', 'FP-000101', 'before', 'user_cit_1', 'citizen', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80', 'a8b79e13b823e201c9a1d489b1425b03e04f056291a1482b8a74e5021f19f201', 'c4e09871ab9011f0', 12.9719, 77.6412, 4.5, false, 'Deep road depression exposing crushed granite base.', '2026-11-01T09:25:00Z', '2026-11-01T09:30:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_001_a', 'FP-000101', 'after', 'user_auth_1', 'authority', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', '7c98f01b34e29a76d1e43b22091c855a90102e3b879c210a459b7201bc89a012', 'c4e09871cd4322e1', 12.972, 77.6413, 5, false, 'Milled edge, compacted hot bituminous concrete patch applied by ward crew.', '2026-11-04T14:20:00Z', '2026-11-04T14:45:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_002_b', 'FP-000102', 'before', 'user_cit_2', 'citizen', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80', 'b1029384756cbad0918273645bca9081273645bbcd9081273645bcad09182736', 'e5f12890cdba3412', 12.9352, 77.6835, 6, false, 'Crater approx 1m wide with loose rocks.', '2026-11-02T10:55:00Z', '2026-11-02T11:00:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_002_a', 'FP-000102', 'after', 'user_auth_2', 'authority', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80', 'b1029384756cbad0918273645bca9081273645bbcd9081273645bcad09182736', 'e5f12890cdba3412', 12.9353, 77.6836, 6.2, false, 'Visibly remains - contractor claimed closed without laying asphalt.', '2026-11-05T15:30:00Z', '2026-11-05T15:55:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_003_b', 'FP-000103', 'before', 'user_cit_3', 'citizen', 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80', 'c90182348576abef0918273645bca9081273645bbcd9081273645bcad09182736', 'b4a18902cd445511', 12.8893, 77.5968, 5.2, false, 'Substantial crater cluster.', '2026-11-03T08:10:00Z', '2026-11-03T08:15:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_003_a', 'FP-000103', 'after', 'user_auth_1', 'authority', 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80', 'd0192837465abef10918273645bca9081273645bbcd9081273645bcad09182736', 'b4a18902cd445588', 12.8894, 77.5969, 5.8, false, 'partial gravel infill - final asphalt pending roller delivery', '2026-11-06T11:15:00Z', '2026-11-06T11:28:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_004_b', 'FP-000104', 'before', 'user_cit_4', 'citizen', 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=80', 'e12349876540192837465bca9081273645bbcd9081273645bcad0918273645ab', 'f0012984acde1122', 12.9784, 77.6408, 4, false, 'Severe trash mound overflowing onto road shoulder.', '2026-11-04T07:40:00Z', '2026-11-04T07:45:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_004_a', 'FP-000104', 'after', 'user_auth_3', 'authority', 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1200&q=80', 'f45678901230192837465bca9081273645bbcd9081273645bcad0918273645cd', 'f0012984acde9988', 12.9785, 77.6409, 4.2, false, 'Cleared by compacting tipper truck team. Bleaching powder sprinkled.', '2026-11-05T12:50:00Z', '2026-11-05T13:15:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_005_b', 'FP-000105', 'before', 'user_cit_5', 'citizen', 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=80', 'a55549876540192837465bca9081273645bbcd9081273645bcad0918273645aa', 'c1234984acde1122', 12.9818, 77.6083, 5.5, false, 'Heavy waste dump.', '2026-11-05T14:05:00Z', '2026-11-05T14:10:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_005_a', 'FP-000105', 'after', 'user_auth_3', 'authority', 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=80', 'a55549876540192837465bca9081273645bbcd9081273645bcad0918273645aa', 'c1234984acde1122', 12.9819, 77.6084, 6, false, 'visibly remains - contractor claims sweep completed but garbage heap remains in photo', '2026-11-07T09:30:00Z', '2026-11-07T09:55:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_006_b', 'FP-000106', 'before', 'user_cit_6', 'citizen', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80', '98765432100192837465bca9081273645bbcd9081273645bcad0918273645ee', 'd1902834bcee1133', 12.9754, 77.6067, 4, false, 'Drain slab shattered.', '2026-11-06T09:50:00Z', '2026-11-06T10:00:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_006_a', 'FP-000106', 'after', 'user_auth_1', 'authority', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', '11223344550192837465bca9081273645bbcd9081273645bcad0918273645ff', 'a9901823bcde9999', 12.9755, 77.6068, 5, false, 'wrong location - submitted park pavement instead of MG road storm drain', '2026-11-08T11:40:00Z', '2026-11-08T11:55:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_007_b', 'FP-000107', 'before', 'user_cit_7', 'citizen', 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80', '77889900110192837465bca9081273645bbcd9081273645bcad0918273645gg', 'c8812903bfee1144', 12.9298, 77.5828, 4.8, false, 'Dislodged curb and paving slabs.', '2026-11-07T11:15:00Z', '2026-11-07T11:20:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_007_a', 'FP-000107', 'after', 'user_auth_1', 'authority', 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80', '99001122330192837465bca9081273645bbcd9081273645bcad0918273645hh', '0000000000000000', 12.9299, 77.5829, 5.1, true, 'blurred photo submitted with heavy camera motion jitter', '2026-11-09T13:50:00Z', '2026-11-09T14:05:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_008_b', 'FP-000108', 'before', 'user_cit_8', 'citizen', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80', 'deadbeef1234567890abcdef1234567890abcdef1234567890abcdef12345678', 'c4e09871ab9011f0', 12.9172, 77.6228, 5, false, 'Flooded pothole.', '2026-11-08T08:25:00Z', '2026-11-08T08:30:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_008_a', 'FP-000108', 'after', 'user_auth_2', 'authority', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80', 'deadbeef1234567890abcdef1234567890abcdef1234567890abcdef12345678', 'c4e09871ab9011f0', 12.9172, 77.6228, 5, false, 'Identical photograph submitted as claimed completion.', '2026-11-10T16:00:00Z', '2026-11-10T16:15:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_009_b', 'FP-000109', 'before', 'user_cit_9', 'citizen', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80', '33445566770192837465bca9081273645bbcd9081273645bcad0918273645ii', 'c7712903bfee1155', 12.9863, 77.7314, 5, false, 'Missing grating at Whitefield.', '2026-11-09T09:05:00Z', '2026-11-09T09:10:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_009_a', 'FP-000109', 'after', 'user_auth_1', 'authority', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', '55667788990192837465bca9081273645bbcd9081273645bcad0918273645jj', 'c7712903bfee2266', 12.9719, 77.6412, 4.5, false, 'claimed repair photographed 14km away in Indiranagar', '2026-11-11T14:20:00Z', '2026-11-11T14:35:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_010_b', 'FP-000110', 'before', 'user_cit_10', 'citizen', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80', '99887766550192837465bca9081273645bbcd9081273645bcad0918273645kk', 'c9912903bfee1166', 12.9984, 77.5712, 4.2, false, 'Foul stagnant puddle in road depression.', '2026-11-10T09:55:00Z', '2026-11-10T10:00:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_010_a', 'FP-000110', 'after', 'user_auth_1', 'authority', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', '11002233440192837465bca9081273645bbcd9081273645bcad0918273645ll', 'c9912903bfee3377', 12.9985, 77.5713, 4.8, false, 'authority claimed road resurfaced and marked closed', '2026-11-12T15:00:00Z', '2026-11-12T15:30:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_010_re', 'FP-000110', 'reinspection', 'user_cit_10', 'citizen', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80', '22334455660192837465bca9081273645bbcd9081273645bcad0918273645mm', 'c9912903bfee1166', 12.9984, 77.5712, 4.1, false, 'Citizen physical reinspection: Pothole has not been touched at all. Photo taken this morning.', '2026-11-13T11:00:00Z', '2026-11-13T11:30:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_before_FP-121117', 'FP-121117', 'before', 'user_cit_1', 'citizen', 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80', 'e2ebef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'c4e09871ab9011f0', 12.9719, 77.6412, 4.5, false, 'Broken footpath stones', NULL, '2026-11-14T05:39:42.414Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence_assets (id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash, perceptual_hash, latitude, longitude, accuracy_meters, is_blurred, notes, captured_at, uploaded_at) VALUES (
  'ev_1794634782425_a9hz', 'FP-121117', 'after', 'user_auth_1', 'authority', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', 'abba07326ce74a79a7fe76da989f84b8849032d765133a69815ad019b720aee0', '2a259aa474f45a23', 12.9719, 77.6412, 5, false, 'Replaced broken pavers and compacted sand base. [Materials: Pre-cast concrete interlocking paver blocks (M30 grade), Contractor: BBMP Ward 112 Maintenance Contractor]', '2026-11-14T05:39:42.425Z', '2026-11-14T05:39:42.425Z'
) ON CONFLICT (id) DO NOTHING;

-- 8. Audit Logs (35 records)
INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_001_1', 'FP-000101', NULL, 'Aditi Sharma', 'citizen', 'reported', 'Complaint registered with initial photographic evidence.', '2026-11-01T09:30:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_001_2', 'FP-000101', NULL, 'BBMP Operations', 'authority', 'repair_claimed', 'Repair claimed: Bituminous concrete patch executed.', '2026-11-04T14:45:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_001_3', 'FP-000101', NULL, 'FixProof AI Engine', 'system', 'ai_verified', 'Verification result: Appears Resolved (94% calibrated confidence).', '2026-11-04T14:46:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_002_1', 'FP-000102', NULL, 'Rahul Varma', 'citizen', 'reported', 'Hazardous pothole report filed on Outer Ring Road.', '2026-11-02T11:00:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_002_2', 'FP-000102', NULL, 'BDA Roads Contractor', 'authority', 'repair_claimed', 'Authority marked work status Closed with completion assertion.', '2026-11-05T15:55:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_002_3', 'FP-000102', NULL, 'FixProof AI Engine', 'system', 'ai_verified', 'Independent Verification Alert: Appears Unresolved. Complaint marked closed but evidence shows defect remains.', '2026-11-05T15:56:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_003_1', 'FP-000103', NULL, 'Sneha Patel', 'citizen', 'reported', 'Report filed with photographic evidence.', '2026-11-03T08:15:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_003_2', 'FP-000103', NULL, 'BBMP South Zone', 'authority', 'status_change', 'Status moved to In Progress (Provisional gravel backfill).', '2026-11-06T11:28:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_003_3', 'FP-000103', NULL, 'FixProof AI Engine', 'system', 'ai_verified', 'Verification result: Partially Resolved. Not certified for closure.', '2026-11-06T11:29:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_004_1', 'FP-000104', NULL, 'Deepak Rao', 'citizen', 'reported', 'Citizen report filed with photo evidence.', '2026-11-04T07:45:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_004_2', 'FP-000104', NULL, 'BBMP SWM Team', 'authority', 'repair_claimed', 'Clearance claimed: Tipper compactor cleared waste.', '2026-11-05T13:15:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_004_3', 'FP-000104', NULL, 'FixProof AI Engine', 'system', 'ai_verified', 'Verification result: Appears Resolved (95% confidence).', '2026-11-05T13:16:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_005_1', 'FP-000105', NULL, 'Farhan Ali', 'citizen', 'reported', 'Civic complaint submitted.', '2026-11-05T14:10:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_005_2', 'FP-000105', NULL, 'East Zone Sanitation Contractor', 'authority', 'repair_claimed', 'Authority marked case Closed.', '2026-11-07T09:55:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_005_3', 'FP-000105', NULL, 'FixProof AI Engine', 'system', 'ai_verified', 'Verification Alert: Appears Unresolved. Refuse still visible in claimed completion photo.', '2026-11-07T09:56:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_006_1', 'FP-000106', NULL, 'Meera Nambiar', 'citizen', 'reported', 'Hazardous broken storm drain slab reported on MG Road.', '2026-11-06T10:00:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_006_2', 'FP-000106', NULL, 'Drainage Contractor', 'authority', 'repair_claimed', 'After photograph uploaded claiming slab restoration.', '2026-11-08T11:55:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_006_3', 'FP-000106', NULL, 'FixProof AI Engine', 'system', 'ai_verified', 'Verification Alert: Insufficient Evidence — Wrong Scene. Landmarks do not match.', '2026-11-08T11:56:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_007_1', 'FP-000107', NULL, 'Kavita Swaminathan', 'citizen', 'reported', 'Damaged footpath complaint lodged.', '2026-11-07T11:20:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_007_2', 'FP-000107', NULL, 'Footpath Contractor', 'authority', 'repair_claimed', 'Completion claimed with blurry camera photo.', '2026-11-09T14:05:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_007_3', 'FP-000107', NULL, 'FixProof AI Engine', 'system', 'ai_verified', 'Verification Alert: Insufficient Evidence — Optical blur. Re-inspection recapture required.', '2026-11-09T14:06:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_008_1', 'FP-000108', NULL, 'Vikram Joshi', 'citizen', 'reported', 'Silk Board crater complaint registered.', '2026-11-08T08:30:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_008_2', 'FP-000108', NULL, 'Maintenance Crew', 'authority', 'repair_claimed', 'Authority attempted closure with evidence submission.', '2026-11-10T16:15:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_008_3', 'FP-000108', NULL, 'FixProof Integrity Guard', 'system', 'ai_verified', 'Fraud Flag: SHA-256 byte match. Re-used original complaint image as repair proof.', '2026-11-10T16:16:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_009_1', 'FP-000109', NULL, 'Priya Sundaram', 'citizen', 'reported', 'Missing drainage grating reported in Whitefield.', '2026-11-09T09:10:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_009_2', 'FP-000109', NULL, 'Drainage Division', 'authority', 'repair_claimed', 'Work completion photo submitted.', '2026-11-11T14:35:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_009_3', 'FP-000109', NULL, 'FixProof Location Engine', 'system', 'ai_verified', 'Verification Alert: Insufficient Evidence — GPS coordinates indicate photo taken 13.8km away.', '2026-11-11T14:36:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_010_1', 'FP-000110', NULL, 'Ramesh Hegde', 'citizen', 'reported', 'Road depression reported in Malleshwaram.', '2026-11-10T10:00:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_010_2', 'FP-000110', NULL, 'West Zone Maintenance', 'authority', 'repair_claimed', 'Work marked Closed with submitted photo.', '2026-11-12T15:30:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_010_3', 'FP-000110', NULL, 'Ramesh Hegde', 'citizen', 'disputed', 'Citizen challenged closure: Uploaded live on-site reinspection proof.', '2026-11-13T11:30:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_010_4', 'FP-000110', NULL, 'Suresh Menon', 'moderator', 'human_verified', 'Independent Moderator Ruled: Human Verified Unresolved. Case reopened.', '2026-11-13T16:55:00Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_1794634782401_xir0', 'FP-121117', 'user_cit_1', 'Aditi Sharma', 'citizen', 'reported', 'Complaint submitted with initial photographic evidence.', '2026-11-14T05:39:42.401Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_1794634782433_krjw', 'FP-121117', NULL, 'BBMP Ward 112 Maintenance Contractor', 'authority', 'status_change', 'Work status transitioned to Closed. Repair claimed with after photographic evidence. Materials: Pre-cast concrete interlocking paver blocks (M30 grade)', '2026-11-14T05:39:42.434Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_1794634782452_kgai', 'FP-121117', NULL, 'FixProof AI Inspector', 'system', 'ai_verified', 'AI Inspection completed: Appears Resolved. The reported municipal issue has been repaired flush with municipal guidelines. No residual defect is visible.', '2026-11-14T05:39:42.452Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, report_id, actor_id, actor_name, actor_role, action, new_value, created_at) VALUES (
  'tl_1794634782477_rqx9', 'FP-121117', 'user_mod_1', 'Suresh Menon (Review Board)', 'moderator', 'human_verified', 'Human Review Recorded: Human Verified Resolved. Reason: Paver alignment and level verified against surrounding footpath grade.', '2026-11-14T05:39:42.477Z'
) ON CONFLICT (id) DO NOTHING;

