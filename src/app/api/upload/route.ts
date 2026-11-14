import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { calculatePerceptualHash, calculateSha256 } from '@/lib/ai/hasher';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req: NextRequest) {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const { imageBase64, filename } = await req.json();
      if (!imageBase64) {
        return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
      }

      const cleanData = imageBase64.includes('base64,')
        ? imageBase64.split('base64,')[1]
        : imageBase64;
      const buffer = Buffer.from(cleanData, 'base64');
      const sha256 = calculateSha256(buffer);
      const pHash = calculatePerceptualHash(buffer);

      const ext = filename?.endsWith('.png') ? 'png' : 'jpg';
      const diskFilename = `${sha256.substring(0, 16)}.${ext}`;
      const filePath = path.join(UPLOAD_DIR, diskFilename);

      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        imageUrl: `/uploads/${diskFilename}`,
        sha256Hash: sha256,
        perceptualHash: pHash,
        fileSizeBytes: buffer.length,
      });
    } else {
      // Multipart form data
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: 'No file received' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const sha256 = calculateSha256(buffer);
      const pHash = calculatePerceptualHash(buffer);

      const ext = file.name.split('.').pop() || 'jpg';
      const diskFilename = `${sha256.substring(0, 16)}.${ext}`;
      const filePath = path.join(UPLOAD_DIR, diskFilename);

      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        imageUrl: `/uploads/${diskFilename}`,
        sha256Hash: sha256,
        perceptualHash: pHash,
        fileSizeBytes: buffer.length,
      });
    }
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
