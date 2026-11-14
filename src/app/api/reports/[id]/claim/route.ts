import { NextRequest, NextResponse } from 'next/server';
import {
  addAiVerification,
  addEvidenceAsset,
  createAuditLog,
  createNotification,
  createRepairClaim,
  getReportById,
  updateReportStatus,
} from '@/lib/db';
import { calculatePerceptualHash, calculateSha256 } from '@/lib/ai/hasher';
import { runAIVerification } from '@/lib/ai/verifier';
import { getAuthenticatedUser } from '@/lib/auth/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = getReportById(params.id);
    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: `Report '${params.id}' not found`,
          error: { code: 'NOT_FOUND' },
        },
        { status: 404 }
      );
    }

    const authUser = getAuthenticatedUser(req);
    const body = await req.json();

    const imageUrl = body.imageUrl || body.afterImageUrl;
    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'Claim repair requires an after photograph (imageUrl or afterImageUrl).',
          error: { code: 'MISSING_EVIDENCE' },
        },
        { status: 400 }
      );
    }

    const uploaderId = authUser?.id || body.uploaderId || 'user_auth_1';
    const uploaderName = authUser?.name || body.contractorName || 'BBMP Ward Maintenance Division';
    const notes = body.notes || body.description || 'Repair work completed as scheduled';
    const materialsUsed = body.materialsUsed || 'Hot-mix bituminous asphalt surface seal';
    const contractorName = body.contractorName || uploaderName;
    const latitude = body.latitude ?? report.latitude;
    const longitude = body.longitude ?? report.longitude;
    const isBlurred = Boolean(body.isBlurred);
    const markClosed = body.markClosed !== false;

    // 1. Calculate cryptographic integrity hashes
    const sha256Hash = calculateSha256(imageUrl);
    const perceptualHash = calculatePerceptualHash(imageUrl);

    // 2. Add after evidence asset
    const afterAsset = addEvidenceAsset({
      reportId: report.id,
      stage: 'after',
      uploaderId,
      uploaderRole: 'authority',
      imageUrl,
      sha256Hash,
      perceptualHash,
      latitude,
      longitude,
      accuracyMeters: 4.5,
      capturedAt: body.capturedAt || new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
      isBlurred,
      notes: `${notes} [Materials: ${materialsUsed}, Contractor: ${contractorName}]`,
    });

    // 3. Record repair claim in repair_claims table
    const claim = createRepairClaim({
      reportId: report.id,
      authorityId: uploaderId,
      description: notes,
      materialsUsed,
      afterImageUrl: afterAsset.imageUrl,
      contractorName,
    });

    // 4. Update work status
    const newWorkStatus = markClosed ? 'closed' : 'repair_claimed';
    updateReportStatus(
      report.id,
      newWorkStatus,
      'ai_pending',
      contractorName,
      `Repair claimed with photographic evidence. Materials: ${materialsUsed}`
    );

    // 5. Run AI verification engine if beforeEvidence exists
    let aiResult = null;
    if (report.beforeEvidence) {
      aiResult = await runAIVerification(report, report.beforeEvidence, afterAsset);
      addAiVerification(aiResult);
    }

    // 6. Notify citizen report owner
    if (report.citizenId) {
      createNotification({
        userId: report.citizenId,
        reportId: report.id,
        title: `Repair Claimed: ${report.caseNumber || report.id}`,
        message: `Maintenance team submitted completion evidence. AI verification status: ${
          aiResult?.verdict || 'Processing'
        }. You may inspect or challenge within 7 days.`,
      });
    }

    // 7. Record comprehensive audit log
    createAuditLog({
      reportId: report.id,
      actorId: uploaderId,
      actorName: contractorName,
      actorRole: 'authority',
      action: 'repair_claimed',
      newValue: `Claim submitted by ${contractorName}. Evidence SHA-256: ${sha256Hash.substring(0, 16)}... AI Verdict: ${
        aiResult?.verdict || 'N/A'
      }`,
      metadata: {
        materialsUsed,
        afterEvidenceId: afterAsset.id,
        aiScore: aiResult?.confidenceScore,
      },
    });

    const updated = getReportById(report.id);

    return NextResponse.json({
      success: true,
      message: 'Repair claim submitted and processed through AI verification engine',
      data: {
        claim,
        aiResult,
        report: updated,
      },
      // Backward compatibility for existing frontend
      report: updated,
      aiResult,
    });
  } catch (err: any) {
    console.error('Error claiming repair:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to submit repair claim',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}
