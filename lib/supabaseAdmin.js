import { createClient } from "@supabase/supabase-js";

const SERVICE_ROLE_KEY = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!SERVICE_ROLE_KEY && process.env.NODE_ENV !== 'production') {
  console.warn('[supabaseAdmin] SUPABASE_SERVICE_ROLE_KEY not set. Admin operations will fail without it.');
}

export const supabaseAdmin = () => {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Supabase admin credentials missing.');
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false }});
};