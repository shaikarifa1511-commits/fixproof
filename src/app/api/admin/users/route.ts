import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, updateUser } from '@/lib/db';
import { requireAuthorization } from '@/lib/auth/server';

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuthorization(req, ['moderator', 'admin']);
    if (errorResponse) {
      return NextResponse.json(errorResponse, { status: 403 });
    }

    const users = getAllUsers();
    return NextResponse.json({
      success: true,
      message: 'User registry retrieved successfully',
      data: { users },
      users, // Backward compatibility
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to retrieve users',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuthorization(req, ['moderator', 'admin']);
    if (errorResponse) {
      return NextResponse.json(errorResponse, { status: 403 });
    }

    const body = await req.json();
    const { id, role, isVerified, organization, organizationId } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Target user ID is required',
          error: { code: 'MISSING_USER_ID' },
        },
        { status: 400 }
      );
    }

    const updated = updateUser(id, {
      role,
      is_verified: isVerified !== undefined ? (isVerified ? 1 : 0) : undefined,
      organization,
      organization_id: organizationId,
    });

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: 'No fields provided for update or user not found',
          error: { code: 'UPDATE_FAILED' },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User '${id}' permissions updated successfully`,
      data: { id, role, isVerified },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to update user',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}

