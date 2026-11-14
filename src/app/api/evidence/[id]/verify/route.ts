import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyFileIntegrity } from '@/lib/storage';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const evidence = db
      .prepare('SELECT * FROM evidence WHERE id = ? OR sha256_hash = ?')
      .get(params.id, params.id) as any;

    if (!evidence) {
      return NextResponse.json(
        {
          success: false,
          message: 'Evidence record not found in ledger.',
          error: { code: 'NOT_FOUND' },
        },
        { status: 404 }
      );
    }

    const integrity = verifyFileIntegrity(evidence.storage_path, evidence.sha256_hash);

    return NextResponse.json({
      success: true,
      message: integrity.matches
        ? 'Evidence cryptographic integrity verified: On-disk file strictly matches SHA-256 hash.'
        : 'Integrity Warning: On-disk file hash differs from recorded hash.',
      data: {
        evidenceId: evidence.id,
        reportId: evidence.report_id,
        stage: evidence.stage,
        recordedSha256: evidence.sha256_hash,
        computedSha256: integrity.computedHash,
        matches: integrity.matches,
        storagePath: evidence.storage_path,
        uploadedAt: evidence.uploaded_at,
        isTampered: !integrity.matches,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Integrity verification failed',
        error: { code: 'VERIFICATION_ERROR', details: err.message },
      },
      { status: 500 }
    );
  }
}

