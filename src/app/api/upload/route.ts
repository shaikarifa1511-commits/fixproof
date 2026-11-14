import { NextRequest, NextResponse } from 'next/server';
import { storeImageFile } from '@/lib/storage';
import { calculatePerceptualHash } from '@/lib/ai/hasher';
import { addEvidenceAsset, getReportById } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer;
    let originalFilename = 'evidence.jpg';
    let reportId: string | undefined;
    let stage: 'before' | 'after' | 'reinspection' = 'before';
    let latitude: number | undefined;
    let longitude: number | undefined;
    let accuracyMeters: number | undefined;
    let notes: string | undefined;

    if (contentType.includes('application/json')) {
      const body = await req.json();
      if (!body.imageBase64 && !body.imageUrl) {
        return NextResponse.json(
          {
            success: false,
            message: 'No image data provided',
            error: { code: 'INVALID_PAYLOAD' },
          },
          { status: 400 }
        );
      }

      reportId = body.reportId;
      stage = body.stage || 'before';
      latitude = body.latitude;
      longitude = body.longitude;
      accuracyMeters = body.accuracyMeters;
      notes = body.notes;

      const raw = body.imageBase64 || body.imageUrl;
      const cleanData = raw.includes('base64,') ? raw.split('base64,')[1] : raw;
      buffer = Buffer.from(cleanData, 'base64');
      originalFilename = body.filename || 'capture.jpg';
    } else {
      // Multipart form data
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json(
          {
            success: false,
            message: 'No file received in form submission',
            error: { code: 'FILE_MISSING' },
          },
          { status: 400 }
        );
      }

      reportId = (formData.get('reportId') as string) || undefined;
      stage = (formData.get('stage') as any) || 'before';
      originalFilename = file.name;
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    }

    // Validate magic bytes & store safely
    const stored = storeImageFile(buffer, originalFilename);
    const pHash = calculatePerceptualHash(buffer);

    // If reportId provided, save directly to database
    let assetId: string | undefined;
    if (reportId) {
      const asset = addEvidenceAsset({
        reportId,
        stage,
        imageUrl: stored.publicUrl,
        sha256Hash: stored.sha256Hash,
        perceptualHash: pHash,
        latitude,
        longitude,
        accuracyMeters: accuracyMeters || 5.0,
        notes,
      });
      assetId = asset.id;
    }

    const payload = {
      id: assetId,
      imageUrl: stored.publicUrl,
      sha256Hash: stored.sha256Hash,
      perceptualHash: pHash,
      fileSizeBytes: stored.fileSizeBytes,
      mimeType: stored.mimeType,
      storagePath: stored.storagePath,
    };

    return NextResponse.json({
      success: true,
      message: 'Image uploaded, cryptographically hashed, and verified successfully.',
      data: payload,
      // Backward compatibility top-level fields for existing frontend
      ...payload,
    });
  } catch (err: any) {
    console.error('Evidence upload error:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Image upload failed',
        error: { code: 'UPLOAD_FAILED', details: err.message },
      },
      { status: 400 }
    );
  }
}
