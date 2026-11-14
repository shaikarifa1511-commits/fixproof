import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RegisterSchema } from '@/lib/validation/schemas';
import { createSessionToken } from '@/lib/auth/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

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

    const { fullName, email, password, phone, role, organizationId } = parsed.data;
    const db = getDb();

    // Check existing email
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this email address already exists.',
          error: { code: 'DUPLICATE_EMAIL' },
        },
        { status: 409 }
      );
    }

    // Hash password
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex') + ':' + salt;

    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, phone, role, organization_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, fullName, email, passwordHash, phone || null, role, organizationId || null, now, now);

    const token = createSessionToken({ id, email, role });
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully.',
        data: {
          user: { id, fullName, email, role, phone },
          token,
        },
      },
      { status: 201 }
    );

    // Set secure cookie
    response.cookies.set('fixproof_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during registration',
        error: { code: 'INTERNAL_ERROR', details: err.message },
      },
      { status: 500 }
    );
  }
}

