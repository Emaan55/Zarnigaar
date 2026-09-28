import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Service-role client for trusted server-only mutations (guest checkout
// order writes, discount usage recording, admin dashboards). Never import
// this from a Client Component or expose SUPABASE_SERVICE_ROLE_KEY to the
// browser — it bypasses Row Level Security entirely.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
