import { NextRequest, NextResponse } from 'next/server';
import { addHumanReview, getReportById } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const report = getReportById(params.id);
    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      decision,
      notes,
      reviewerId = 'user_mod_1',
      reviewerName = 'Suresh Menon (Civic Review Board)',
      overrideAi = false,
    } = body;

    if (!decision || !notes) {
      return NextResponse.json(
        { success: false, error: 'Decision and review notes/justification are required.' },
        { status: 400 }
      );
    }

    addHumanReview({
      reportId: report.id,
      reviewerId,
      reviewerName,
      decision,
      notes,
      overrideAi: Boolean(overrideAi),
    });

    const updated = getReportById(report.id);
    return NextResponse.json({ success: true, report: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
