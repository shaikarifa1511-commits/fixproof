import { NextRequest, NextResponse } from 'next/server';
import { createReport, getAllReports } from '@/lib/db';
import { CreateReportSchema } from '@/lib/validation/schemas';
import { getAuthenticatedUser } from '@/lib/auth/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const workStatus = searchParams.get('workStatus') || undefined;
    const verificationStatus = searchParams.get('verificationStatus') || undefined;
    const search = searchParams.get('search') || undefined;

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const offset = (page - 1) * limit;

    let bbox: { minLat: number; maxLat: number; minLng: number; maxLng: number } | undefined;
    const minLat = searchParams.get('minLat');
    const maxLat = searchParams.get('maxLat');
    const minLng = searchParams.get('minLng');
    const maxLng = searchParams.get('maxLng');
    if (minLat && maxLat && minLng && maxLng) {
      bbox = {
        minLat: parseFloat(minLat),
        maxLat: parseFloat(maxLat),
        minLng: parseFloat(minLng),
        maxLng: parseFloat(maxLng),
      };
    }

    const { reports, total } = getAllReports({
      category,
      status,
      workStatus,
      verificationStatus,
      search,
      bbox,
      limit,
      offset,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: 'Reports retrieved successfully',
      data: {
        reports,
        total,
        page,
        limit,
        totalPages,
      },
      // Backward compatibility for existing frontend
      reports,
    });
  } catch (err: any) {
    console.error('Error fetching reports:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to fetch reports',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Authenticate user if available, or fall back to payload / demo citizen
    const authUser = getAuthenticatedUser(req);
    const citizenId = authUser?.id || body.citizenId || 'user_cit_1';
    const citizenName = authUser?.name || body.citizenName || 'Aditi Sharma';

    const parseResult = CreateReportSchema.safeParse({
      ...body,
      citizenId,
      citizenName,
    });

    if (!parseResult.success) {
      const errorDetails = parseResult.error.format();
      const firstErrorMessage =
        (parseResult.error as any).errors?.[0]?.message || parseResult.error.message || 'Invalid input data';
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${firstErrorMessage}`,
          error: {
            code: 'VALIDATION_ERROR',
            details: errorDetails,
          },
        },
        { status: 400 }
      );
    }

    const report = createReport(parseResult.data);

    return NextResponse.json(
      {
        success: true,
        message: 'Civic complaint submitted successfully',
        data: { report },
        // Backward compatibility for existing frontend
        report,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error creating report:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to create report',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}
