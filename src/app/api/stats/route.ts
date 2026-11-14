import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDemo = searchParams.get('includeDemo') !== 'false';
    const stats = getAnalytics(includeDemo);

    return NextResponse.json({
      success: true,
      message: 'Civic analytics and verification metrics retrieved successfully',
      data: { stats },
      stats, // Backward compatibility
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to retrieve analytics',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}
