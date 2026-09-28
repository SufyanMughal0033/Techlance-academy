import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/types/database.types";

/**
 * Supabase client for use in Server Components, Server Actions, and Route
 * Handlers. Still uses only the anon key — privileged/service-role access
 * lives exclusively in lib/supabase/admin.ts, which must never be imported
 * from a Client Component. Session cookies are read/written here so
 * `supabase.auth.getUser()` reflects the signed-in user on the server.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component that can't set cookies —
            // safe to ignore as long as middleware.ts is refreshing the
            // session on every request (it is; see middleware.ts).
          }
        },
      },
    }
  );
}
