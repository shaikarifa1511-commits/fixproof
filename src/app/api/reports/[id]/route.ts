import { NextRequest, NextResponse } from 'next/server';
import { getReportById, updateReportStatus } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = getReportById(params.id);
    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: `Report '${params.id}' not found`,
          error: { code: 'NOT_FOUND' },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Report retrieved successfully',
      data: { report },
      report, // Backward compatibility
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to retrieve report',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = getReportById(params.id);
    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: `Report '${params.id}' not found`,
          error: { code: 'NOT_FOUND' },
        },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { workStatus, verificationStatus, actorName, notes } = body;

    // Check user identity or fallback to actorName
    const user = getAuthenticatedUser(req);
    const finalActorName = user?.name || actorName || 'BBMP Field Officer';

    updateReportStatus(
      params.id,
      workStatus,
      verificationStatus,
      finalActorName,
      notes || 'Status updated via authority portal'
    );

    const updated = getReportById(params.id);

    return NextResponse.json({
      success: true,
      message: 'Report status updated successfully',
      data: { report: updated },
      report: updated, // Backward compatibility
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to update report',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}
