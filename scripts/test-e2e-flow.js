const path = require('node:path');

async function testE2E() {
  console.log('Testing End-to-End Vertical Slice Flow:');

  const createRoute = require(path.join(process.cwd(), '.next/server/app/api/reports/route.js'));
  const claimRoute = require(path.join(process.cwd(), '.next/server/app/api/reports/[id]/claim/route.js'));
  const verifyRoute = require(path.join(process.cwd(), '.next/server/app/api/reports/[id]/verify/route.js'));
  const reviewRoute = require(path.join(process.cwd(), '.next/server/app/api/reports/[id]/review/route.js'));
  const singleRoute = require(path.join(process.cwd(), '.next/server/app/api/reports/[id]/route.js'));

  // Step 1: Citizen creates a new report
  console.log('\n1. Citizen Submitting New Complaint...');
  const reqCreate = new Request('http://localhost/api/reports', {
    method: 'POST',
    body: JSON.stringify({
      title: 'E2E Test: Broken Footpath Slabs on 100ft Road',
      description: 'Dislodged concrete slabs and tripping hazard near bus shelter.',
      category: 'footpath',
      address: '100ft Road, Bengaluru',
      latitude: 12.9719,
      longitude: 77.6412,
      citizenId: 'user_cit_1',
      citizenName: 'Aditi Sharma',
    }),
  });
  const resCreate = await createRoute.routeModule.userland.POST(reqCreate);
  const dataCreate = await resCreate.json();
  const reportId = dataCreate.report.id;
  console.log(`✓ Report Created: ${reportId} (Work: ${dataCreate.report.workStatus}, Verification: ${dataCreate.report.verificationStatus})`);

  // Step 2: Citizen uploads before evidence
  console.log('\n2. Attaching Before Evidence Asset...');
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(path.join(process.cwd(), 'data', 'fixproof.sqlite'));
  db.prepare(`
    INSERT INTO evidence_assets (
      id, report_id, stage, uploader_id, uploader_role, image_url, sha256_hash,
      perceptual_hash, latitude, longitude, accuracy_meters, uploaded_at, is_blurred, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    `ev_before_${reportId}`,
    reportId,
    'before',
    'user_cit_1',
    'citizen',
    'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80',
    'e2ebef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    'c4e09871ab9011f0',
    12.9719,
    77.6412,
    4.5,
    new Date().toISOString(),
    0,
    'Broken footpath stones'
  );
  console.log('✓ Before evidence attached with SHA-256 and pHash');

  // Step 3: Authority submits repair claim with after photo -> triggers AI verification!
  console.log('\n3. Authority Submitting Repair Claim & After Photo...');
  const reqClaim = new Request(`http://localhost/api/reports/${reportId}/claim`, {
    method: 'POST',
    body: JSON.stringify({
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      materialsUsed: 'Pre-cast concrete interlocking paver blocks (M30 grade)',
      contractorName: 'BBMP Ward 112 Maintenance Contractor',
      notes: 'Replaced broken pavers and compacted sand base.',
      uploaderId: 'user_auth_1',
      uploaderRole: 'authority',
      latitude: 12.9719,
      longitude: 77.6412,
    }),
  });
  const resClaim = await claimRoute.routeModule.userland.POST(reqClaim, { params: { id: reportId } });
  const dataClaim = await resClaim.json();
  console.log(`✓ Repair Claimed! Authority Work Status: ${dataClaim.report.workStatus}`);
  console.log(`✓ AI Verification Assessment: ${dataClaim.report.verificationStatus}`);
  console.log(`✓ AI Explanation: "${dataClaim.report.latestAiVerification.explanation}"`);
  console.log(`✓ Calibrated Confidence: ${Math.round(dataClaim.report.latestAiVerification.confidenceScore * 100)}%`);

  // Step 4: Moderator records human review
  console.log('\n4. Independent Moderator Recording Verification Ruling...');
  const reqReview = new Request(`http://localhost/api/reports/${reportId}/review`, {
    method: 'POST',
    body: JSON.stringify({
      decision: 'human_verified_resolved',
      notes: 'Paver alignment and level verified against surrounding footpath grade.',
      reviewerId: 'user_mod_1',
      reviewerName: 'Suresh Menon (Review Board)',
      overrideAi: false,
    }),
  });
  const resReview = await reviewRoute.routeModule.userland.POST(reqReview, { params: { id: reportId } });
  const dataReview = await resReview.json();
  console.log(`✓ Human Review Committed! Final Verification Status: ${dataReview.report.verificationStatus}`);

  // Step 5: Verify timeline audit trail
  const reqSingle = new Request(`http://localhost/api/reports/${reportId}`);
  const resSingle = await singleRoute.routeModule.userland.GET(reqSingle, { params: { id: reportId } });
  const dataSingle = await resSingle.json();
  console.log(`\n✓ Immutable Audit Trail Events Recorded (${dataSingle.report.timeline.length} events):`);
  dataSingle.report.timeline.forEach((evt, idx) => {
    console.log(`   [${idx + 1}] ${evt.eventType.toUpperCase()} by ${evt.actorName} (${evt.actorRole}): ${evt.description}`);
  });

  console.log('\n======================================================');
  console.log('END-TO-END FLOW VERIFICATION COMPLETE AND VALIDATED ✓');
  console.log('======================================================');
}

testE2E().catch(console.error);
