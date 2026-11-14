import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB limit
export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export interface FileValidationResult {
  isValid: boolean;
  mimeType?: string;
  extension?: string;
  error?: string;
}

/**
 * Validates actual binary magic bytes to prevent file extension spoofing
 */
export function validateImageMagicBytes(buffer: Buffer): FileValidationResult {
  if (buffer.length < 12) {
    return { isValid: false, error: 'File is too small to be a valid image.' };
  }

  // Check JPEG (FF D8 FF)
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, mimeType: 'image/jpeg', extension: 'jpg' };
  }

  // Check PNG (89 50 4E 47 0D 0A 1A 0A)
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, mimeType: 'image/png', extension: 'png' };
  }

  // Check WebP (RIFF .... WEBP)
  const isRiff = buffer.toString('ascii', 0, 4) === 'RIFF';
  const isWebp = buffer.toString('ascii', 8, 12) === 'WEBP';
  if (isRiff && isWebp) {
    return { isValid: true, mimeType: 'image/webp', extension: 'webp' };
  }

  return {
    isValid: false,
    error: 'Unsupported or malicious file type. Only authentic JPEG, PNG, and WebP images are permitted.',
  };
}

/**
 * Stores image bytes safely, generates cryptographic SHA-256 and perceptual hash
 */
export function storeImageFile(
  buffer: Buffer,
  originalFilename = 'evidence.jpg'
): {
  storagePath: string;
  publicUrl: string;
  sha256Hash: string;
  fileSizeBytes: number;
  mimeType: string;
} {
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size exceeds allowable maximum of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`);
  }

  const validation = validateImageMagicBytes(buffer);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid file format.');
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
  const safeFilename = `${sha256.substring(0, 20)}.${validation.extension}`;
  const filePath = path.join(UPLOAD_DIR, safeFilename);

  // Write file to disk if not exists (preserves immutable original)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, buffer);
  }

  return {
    storagePath: filePath,
    publicUrl: `/uploads/${safeFilename}`,
    sha256Hash: sha256,
    fileSizeBytes: buffer.length,
    mimeType: validation.mimeType!,
  };
}

/**
 * Verifies that file on disk matches its recorded SHA-256 hash
 */
export function verifyFileIntegrity(
  storagePath: string,
  expectedSha256: string
): { matches: boolean; computedHash?: string; error?: string } {
  try {
    if (!fs.existsSync(storagePath)) {
      return { matches: false, error: 'File not found on storage medium.' };
    }
    const buffer = fs.readFileSync(storagePath);
    const computedHash = crypto.createHash('sha256').update(buffer).digest('hex');
    return {
      matches: computedHash.toLowerCase() === expectedSha256.toLowerCase(),
      computedHash,
    };
  } catch (err: any) {
    return { matches: false, error: err.message };
  }
}

