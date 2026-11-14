import { NextRequest, NextResponse } from 'next/server';
import {
  addEvidenceAsset,
  createAuditLog,
  createChallenge,
  createNotification,
  getReportById,
  updateReportStatus,
} from '@/lib/db';
import { calculatePerceptualHash, calculateSha256 } from '@/lib/ai/hasher';
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

    const reason = body.reason || body.description;
    if (!reason || reason.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dispute reason must be at least 5 characters long.',
          error: { code: 'INVALID_INPUT' },
        },
        { status: 400 }
      );
    }

    const complainantId = authUser?.id || body.complainantId || 'user_cit_1';
    const complainantName = authUser?.name || body.complainantName || 'Aditi Sharma';
    const reinspectionImageUrl = body.reinspectionImageUrl || body.imageUrl;
    const latitude = body.latitude ?? report.latitude;
    const longitude = body.longitude ?? report.longitude;

    let reinspectionEvidenceId: string | undefined;

    if (reinspectionImageUrl) {
      const sha256 = calculateSha256(reinspectionImageUrl);
      const pHash = calculatePerceptualHash(reinspectionImageUrl);

      const asset = addEvidenceAsset({
        reportId: report.id,
        stage: 'reinspection',
        uploaderId: complainantId,
        uploaderRole: 'citizen',
        imageUrl: reinspectionImageUrl,
        sha256Hash: sha256,
        perceptualHash: pHash,
        latitude,
        longitude,
        accuracyMeters: 4.5,
        capturedAt: new Date().toISOString(),
        uploadedAt: new Date().toISOString(),
        notes: `Citizen on-site reinspection evidence attached to challenge: "${reason}"`,
      });
      reinspectionEvidenceId = asset.id;
    }

    const challenge = createChallenge({
      reportId: report.id,
      complainantId,
      complainantName,
      reason,
      description: body.description || reason,
      reinspectionEvidenceId,
      reinspectionImageUrl,
    });

    // Update status to DISPUTED
    updateReportStatus(
      report.id,
      'disputed',
      report.verificationStatus,
      complainantName,
      `Citizen filed challenge: "${reason}"`
    );

    // Notify authority/moderators
    createNotification({
      userId: 'user_mod_1',
      reportId: report.id,
      title: `Dispute Escalation: ${report.caseNumber || report.id}`,
      message: `Citizen ${complainantName} disputed the repair closure: "${reason}". Human review requested.`,
    });

    createAuditLog({
      reportId: report.id,
      actorId: complainantId,
      actorName: complainantName,
      actorRole: 'citizen',
      action: 'challenge_created',
      newValue: `Challenge filed by ${complainantName}: "${reason}"`,
      metadata: {
        reinspectionEvidenceId,
        hasReinspectionPhoto: Boolean(reinspectionImageUrl),
      },
    });

    const updated = getReportById(report.id);

    return NextResponse.json({
      success: true,
      message: 'Citizen challenge filed and case escalated for moderation review',
      data: {
        challenge,
        report: updated,
      },
      // Backward compatibility
      report: updated,
    });
  } catch (err: any) {
    console.error('Error filing dispute:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to submit challenge',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}
