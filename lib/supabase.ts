import { createClient } from '@supabase/supabase-js';

// Database types
export interface Vote {
  id: number;
  created_at: string;
  voter_name: string;
  brought_candy: string;
  hate_vote: string;
  love_vote: string;
}

// Supabase client with anon key (for reading)
export function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Supabase client with service role key (for writing)
export function getSupabaseServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase service role environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}
