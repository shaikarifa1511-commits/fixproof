import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/db';
import { requireAuthorization } from '@/lib/auth/server';

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuthorization(req, ['moderator', 'admin']);
    if (errorResponse) {
      return NextResponse.json(errorResponse, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get('reportId') || undefined;
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '100', 10)));

    const auditLogs = getAuditLogs(reportId, limit);

    return NextResponse.json({
      success: true,
      message: 'Audit trail records retrieved successfully',
      data: {
        total: auditLogs.length,
        auditLogs,
      },
      auditLogs, // Backward compatibility
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to retrieve audit logs',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}

