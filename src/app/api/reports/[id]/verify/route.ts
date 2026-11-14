import { NextRequest, NextResponse } from 'next/server';
import { addAiVerification, getReportById } from '@/lib/db';
import { runAIVerification } from '@/lib/ai/verifier';

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

    if (!report.beforeEvidence || !report.afterEvidence) {
      return NextResponse.json(
        {
          success: false,
          message: 'Verification requires both before and after photographic evidence.',
          error: { code: 'INSUFFICIENT_EVIDENCE' },
        },
        { status: 400 }
      );
    }

    const aiResult = await runAIVerification(report, report.beforeEvidence, report.afterEvidence);
    addAiVerification(aiResult);

    const updated = getReportById(report.id);

    return NextResponse.json({
      success: true,
      message: 'AI verification executed and scores recorded',
      data: {
        aiResult,
        report: updated,
      },
      // Backward compatibility
      aiResult,
      report: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to execute verification',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}
