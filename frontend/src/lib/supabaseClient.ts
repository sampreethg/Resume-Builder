import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qviujuzxjnsyomjnieit.supabase.co";
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_yvFrLbKpDcz_HeTENBc_4Q_o_ZfAkj2";

/**
 * Public client for client-side queries, auth sessions, and user-isolated RLS queries.
 * Safe to execute in the browser.
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
