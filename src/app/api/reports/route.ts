import { NextRequest, NextResponse } from 'next/server';
import { createReport, getAllReports } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const workStatus = searchParams.get('workStatus') || undefined;
    const verificationStatus = searchParams.get('verificationStatus') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const reports = getAllReports({ category, workStatus, verificationStatus, search, limit });
    return NextResponse.json({ success: true, reports });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Title and Category are required.' },
        { status: 400 }
      );
    }

    const report = createReport(body);
    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
