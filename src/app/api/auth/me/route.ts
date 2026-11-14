import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: 'No active session found.',
        error: { code: 'UNAUTHORIZED' },
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'User authenticated',
    data: { user },
  });
}

