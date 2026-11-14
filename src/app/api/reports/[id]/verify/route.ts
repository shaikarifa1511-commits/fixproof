import { NextRequest, NextResponse } from 'next/server';
import { addAiVerification, getReportById } from '@/lib/db';
import { runAIVerification } from '@/lib/ai/verifier';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const report = getReportById(params.id);
    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    if (!report.beforeEvidence || !report.afterEvidence) {
      return NextResponse.json(
        {
          success: false,
          error: 'Verification requires both before and after photographic evidence.',
        },
        { status: 400 }
      );
    }

    const aiResult = await runAIVerification(report, report.beforeEvidence, report.afterEvidence);
    addAiVerification(aiResult);

    const updated = getReportById(report.id);
    return NextResponse.json({ success: true, aiResult, report: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

