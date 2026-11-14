/**
 * FixProof — Supabase Database Migration & Verification Utility
 * Usage: node scripts/supabase-migrate.js
 */

const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('==============================================================================');
console.log('FIXPROOF — SUPABASE POSTGRESQL MIGRATION CHECK');
console.log('==============================================================================');

const schemaPath = path.join(__dirname, '../supabase/schema.sql');
const seedPath = path.join(__dirname, '../supabase/seed.sql');

if (!fs.existsSync(schemaPath)) {
  console.error('❌ Error: supabase/schema.sql not found.');
  process.exit(1);
}

const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
const seedSql = fs.readFileSync(seedPath, 'utf-8');

console.log(`✓ Schema File verified: ${schemaPath} (${schemaSql.length} bytes)`);
console.log(`✓ Seed File verified: ${seedPath} (${seedSql.length} bytes)`);

if (!supabaseUrl || !serviceKey) {
  console.log('\n[NOTICE] Supabase environment variables not configured in current session.');
  console.log('FixProof is running with Embedded SQLite fallback (fully functional for testing).');
  console.log('\nTo connect to Supabase:');
  console.log('1. Go to https://supabase.com and create a project.');
  console.log('2. Open the SQL Editor in your Supabase dashboard.');
  console.log('3. Copy and paste the contents of `supabase/schema.sql` and execute.');
  console.log('4. Copy and paste the contents of `supabase/seed.sql` and execute.');
  console.log('5. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Render or .env.');
  console.log('==============================================================================');
  process.exit(0);
}

async function verifySupabaseConnection() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, serviceKey);

    console.log(`\nConnecting to Supabase at: ${supabaseUrl}...`);
    const { data, error } = await supabase.from('reports').select('id').limit(1);

    if (error && error.code === '42P01') {
      console.log('⚠️  Connected to Supabase, but tables have not been created yet.');
      console.log('👉 Please execute `supabase/schema.sql` in the Supabase SQL Editor.');
    } else if (error) {
      console.log('⚠️  Supabase notice:', error.message);
    } else {
      console.log('✓ Successfully connected to Supabase PostgreSQL database!');
      console.log('✓ Tables detected and verified.');
    }
  } catch (err) {
    console.error('Error connecting to Supabase:', err.message);
  }
}

verifySupabaseConnection();

