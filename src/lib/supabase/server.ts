import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://oxadkcfreovybavscgko.supabase.co';
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

let serverClientInstance: SupabaseClient | null = null;

export function isSupabaseServerConfigured(): boolean {
  return Boolean(supabaseUrl && serviceRoleKey);
}

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!serviceRoleKey) return null;

  if (!serverClientInstance) {
    serverClientInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverClientInstance;
}
