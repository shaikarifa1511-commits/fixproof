import { NextResponse } from 'next/server';
import { isSupabaseServerConfigured } from '@/lib/supabase/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const isSupabase = isSupabaseServerConfigured();
  let dbStatus = 'connected_sqlite';

  try {
    if (isSupabase) {
      dbStatus = 'connected_supabase_postgres';
    } else {
      const db = getDb();
      const count = db.prepare('SELECT COUNT(*) as c FROM reports').get() as { c: number };
      dbStatus = `connected_sqlite (${count.c} reports active)`;
    }
  } catch (err: any) {
    dbStatus = `error: ${err.message}`;
  }

  return NextResponse.json({
    status: 'healthy',
    service: 'FixProof Civic Verification Engine',
    tagline: 'Reported. Repaired. Verified.',
    timestamp: new Date().toISOString(),
    database: {
      provider: isSupabase ? 'Supabase PostgreSQL' : 'Embedded SQLite',
      status: dbStatus,
    },
    version: '2.0.0',
    platform: process.env.RENDER ? 'Render Cloud' : process.env.VERCEL ? 'Vercel' : 'Local Node Server',
  });
}
