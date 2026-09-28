import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Required by @supabase/ssr: Server Components can't write cookies, so if
 * nothing ever refreshes the session cookie, a long-lived session will
 * quietly expire. This runs on every request, refreshes the auth token if
 * needed, and writes the updated cookie onto the response.
 *
 * This does session refresh only. Role-based route protection (redirecting
 * a signed-out visitor away from /student/* or /admin/*, or a student away
 * from /admin/*) is done in the respective (portal) layout.tsx files
 * instead, because that's where we can also load the profile row to check
 * role — see app/student/(portal)/layout.tsx and app/admin/(portal)/layout.tsx.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Not configured yet (e.g. local build without a Supabase project) —
    // skip rather than throw, so the rest of the site keeps working.
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
