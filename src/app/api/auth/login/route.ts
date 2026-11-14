import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { LoginSchema } from '@/lib/validation/schemas';
import { createSessionToken } from '@/lib/auth/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const db = getDb();

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password.',
          error: { code: 'INVALID_CREDENTIALS' },
        },
        { status: 401 }
      );
    }

    // Verify password if hash exists
    if (user.password_hash) {
      const [hash, salt] = user.password_hash.split(':');
      const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
      if (hash !== verifyHash) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid email or password.',
            error: { code: 'INVALID_CREDENTIALS' },
          },
          { status: 401 }
        );
      }
    }

    const token = createSessionToken({ id: user.id, email: user.email, role: user.role });
    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          organization: user.organization_id,
        },
        token,
      },
    });

    response.cookies.set('fixproof_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600,
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during login',
        error: { code: 'INTERNAL_ERROR', details: err.message },
      },
      { status: 500 }
    );
  }
}

