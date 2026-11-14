import { NextRequest, NextResponse } from 'next/server';
import { addEvidenceAsset, createDispute, getReportById } from '@/lib/db';
import { calculatePerceptualHash, calculateSha256 } from '@/lib/ai/hasher';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const report = getReportById(params.id);
    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      reason,
      reinspectionImageUrl,
      complainantId = 'user_cit_1',
      complainantName = 'Aditi Sharma',
      latitude,
      longitude,
    } = body;

    if (!reason) {
      return NextResponse.json(
        { success: false, error: 'Dispute reason is required.' },
        { status: 400 }
      );
    }

    let reinspectionEvidenceId: string | undefined;

    if (reinspectionImageUrl) {
      const sha256 = calculateSha256(reinspectionImageUrl);
      const pHash = calculatePerceptualHash(reinspectionImageUrl);

      const asset = addEvidenceAsset({
        reportId: report.id,
        stage: 'reinspection',
        uploaderId: complainantId,
        uploaderRole: 'citizen',
        imageUrl: reinspectionImageUrl,
        sha256Hash: sha256,
        perceptualHash: pHash,
        latitude: latitude ?? report.latitude,
        longitude: longitude ?? report.longitude,
        accuracyMeters: 4.5,
        capturedAt: new Date().toISOString(),
        uploadedAt: new Date().toISOString(),
        notes: `Citizen on-site reinspection evidence attached to dispute: "${reason}"`,
      });
      reinspectionEvidenceId = asset.id;
    }

    createDispute({
      reportId: report.id,
      complainantId,
      complainantName,
      reason,
      reinspectionEvidenceId,
      reinspectionImageUrl,
    });

    const updated = getReportById(report.id);
    return NextResponse.json({ success: true, report: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

