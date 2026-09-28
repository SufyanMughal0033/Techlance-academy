import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database.types";

/**
 * Supabase client for use in Client Components. Uses the public URL and
 * anon key only — this is safe to ship to the browser. Row Level Security
 * policies (see supabase/migrations) are what actually restrict what this
 * client can read or write, never trust checks made only in the UI.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
