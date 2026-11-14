import { NextRequest, NextResponse } from 'next/server';
import { getReportById, updateReportStatus } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const report = getReportById(params.id);
    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { workStatus, verificationStatus, actorName, notes } = body;

    updateReportStatus(params.id, workStatus, verificationStatus, actorName, notes);
    const updated = getReportById(params.id);
    return NextResponse.json({ success: true, report: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

