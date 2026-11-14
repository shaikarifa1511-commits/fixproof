import { NextRequest, NextResponse } from 'next/server';
import { getAllReports } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    // Optional bounding box
    const minLat = searchParams.get('minLat');
    const maxLat = searchParams.get('maxLat');
    const minLng = searchParams.get('minLng');
    const maxLng = searchParams.get('maxLng');

    const bbox =
      minLat && maxLat && minLng && maxLng
        ? {
            minLat: parseFloat(minLat),
            maxLat: parseFloat(maxLat),
            minLng: parseFloat(minLng),
            maxLng: parseFloat(maxLng),
          }
        : undefined;

    const { reports, total } = getAllReports({ category, status, search, bbox, limit: 150 });

    // Sanitize PII for public map safety (DPDP compliance)
    const publicMarkers = reports.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      address: r.address,
      latitude: r.latitude,
      longitude: r.longitude,
      workStatus: r.workStatus,
      verificationStatus: r.verificationStatus,
      thumbnailUrl: r.beforeEvidence?.imageUrl,
      afterThumbnailUrl: r.afterEvidence?.imageUrl,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({
      success: true,
      message: 'Civic map points retrieved successfully.',
      data: {
        points: publicMarkers,
        count: publicMarkers.length,
        total,
      },
      // Backward compatibility top-level fields
      reports,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve map markers',
        error: { code: 'MAP_QUERY_ERROR', details: err.message },
      },
      { status: 500 }
    );
  }
}

