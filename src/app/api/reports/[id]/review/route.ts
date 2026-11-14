import { NextRequest, NextResponse } from 'next/server';
import { addHumanReview, createAuditLog, createNotification, getReportById } from '@/lib/db';
import { ResolveReviewSchema } from '@/lib/validation/schemas';
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

    const parseResult = ResolveReviewSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${(parseResult.error as any).errors?.[0]?.message || parseResult.error.message}`,
          error: {
            code: 'VALIDATION_ERROR',
            details: parseResult.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { decision, notes, overrideAi } = parseResult.data;
    const reviewerId = authUser?.id || body.reviewerId || 'user_mod_1';
    const reviewerName = authUser?.name || body.reviewerName || 'Suresh Menon (Civic Review Board)';

    // Map decision to verification status
    let mappedDecision: any = decision.toLowerCase();
    if (decision === 'VERIFIED_RESOLVED') mappedDecision = 'human_verified_resolved';
    if (decision === 'NOT_RESOLVED') mappedDecision = 'human_verified_unresolved';
    if (decision === 'PARTIALLY_RESOLVED') mappedDecision = 'requires_more_evidence';

    addHumanReview({
      reportId: report.id,
      reviewerId,
      reviewerName,
      decision: mappedDecision,
      notes,
      overrideAi,
    });

    // Notify citizen complainant
    if (report.citizenId) {
      createNotification({
        userId: report.citizenId,
        reportId: report.id,
        title: `Moderation Ruling: ${report.caseNumber || report.id}`,
        message: `Independent moderator issued ruling: ${decision.replace(/_/g, ' ')}. Justification: "${notes}"`,
      });
    }

    createAuditLog({
      reportId: report.id,
      actorId: reviewerId,
      actorName: reviewerName,
      actorRole: 'moderator',
      action: 'moderator_ruling',
      newValue: `Decision: ${decision}. Notes: ${notes}. AI Override: ${overrideAi ? 'YES' : 'NO'}`,
    });

    const updated = getReportById(report.id);

    return NextResponse.json({
      success: true,
      message: 'Moderation review recorded and dispute resolved',
      data: {
        report: updated,
      },
      // Backward compatibility
      report: updated,
    });
  } catch (err: any) {
    console.error('Error reviewing report:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to submit review',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}
