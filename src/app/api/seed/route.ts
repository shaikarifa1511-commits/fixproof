import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    seedDatabase(true);
    return NextResponse.json({
      success: true,
      message: 'Database reset and re-seeded with 10 synthetic demonstration cases.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
