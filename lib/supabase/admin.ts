import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

/**
 * Privileged Supabase client using the service-role key, which BYPASSES
 * Row Level Security entirely. The `server-only` import above makes any
 * accidental import from a Client Component fail the build, but the real
 * protection is discipline: only call this from Server Actions or Route
 * Handlers that perform their own authorization check first (e.g.
 * "is the caller an authenticated admin?") — for actions such as issuing
 * or revoking a certificate, approving an application, or creating a
 * student account, where RLS alone can't safely express the operation.
 *
 * Never import this file into anything that ships to the browser, and
 * never forward SUPABASE_SERVICE_ROLE_KEY to the client.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
