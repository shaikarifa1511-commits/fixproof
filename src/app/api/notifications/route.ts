import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, markNotificationRead } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const authUser = getAuthenticatedUser(req);
    const userId = searchParams.get('userId') || authUser?.id || 'user_cit_1';

    const notifications = getNotifications(userId);

    return NextResponse.json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        total: notifications.length,
        unread: notifications.filter((n) => !n.read).length,
        notifications,
      },
      notifications, // Backward compatibility
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to retrieve notifications',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.id) {
      markNotificationRead(body.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
      data: { id: body.id, read: true },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to update notification',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}
