import { NextRequest, NextResponse } from 'next/server';
import {
  addAiVerification,
  addEvidenceAsset,
  addTimelineEvent,
  getReportById,
  updateReportStatus,
} from '@/lib/db';
import { calculatePerceptualHash, calculateSha256 } from '@/lib/ai/hasher';
import { runAIVerification } from '@/lib/ai/verifier';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const report = getReportById(params.id);
    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      imageUrl,
      uploaderId = 'user_auth_1',
      uploaderRole = 'authority',
      latitude,
      longitude,
      notes = '',
      materialsUsed = 'Hot-mix bituminous asphalt',
      contractorName = 'BBMP Ward Maintenance Division',
      isBlurred = false,
      markClosed = true,
    } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Claim repair requires an after photograph.' },
        { status: 400 }
      );
    }

    // 1. Calculate cryptographic integrity hashes
    const sha256Hash = calculateSha256(imageUrl);
    const perceptualHash = calculatePerceptualHash(imageUrl);

    // 2. Add after evidence asset
    const afterAsset = addEvidenceAsset({
      reportId: report.id,
      stage: 'after',
      uploaderId,
      uploaderRole,
      imageUrl,
      sha256Hash,
      perceptualHash,
      latitude: latitude ?? report.latitude,
      longitude: longitude ?? report.longitude,
      accuracyMeters: 5.0,
      capturedAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
      isBlurred: Boolean(isBlurred),
      notes: `${notes} [Materials: ${materialsUsed}, Contractor: ${contractorName}]`,
    });

    // 3. Update work status
    const newWorkStatus = markClosed ? 'closed' : 'repair_claimed';
    updateReportStatus(
      report.id,
      newWorkStatus,
      'ai_pending',
      contractorName,
      `Repair claimed with after photographic evidence. Materials: ${materialsUsed}`
    );

    // 4. Run AI verification engine if beforeEvidence exists
    if (report.beforeEvidence) {
      const aiResult = await runAIVerification(report, report.beforeEvidence, afterAsset);
      addAiVerification(aiResult);
    }

    const updated = getReportById(report.id);
    return NextResponse.json({ success: true, report: updated });
  } catch (err: any) {
    console.error('Error claiming repair:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
