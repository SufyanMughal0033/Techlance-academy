import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next");

  const redirectPath =
    next && next.startsWith("/")
      ? next
      : "/student/set-password";

  const supabase = await createClient();

  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      console.log(
        "Auth callback: Code exchange successful."
      );

      return NextResponse.redirect(
        new URL(redirectPath, requestUrl.origin)
      );
    }

    console.error(
      "Auth callback: Code exchange failed:",
      error.message
    );
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as
        | "signup"
        | "invite"
        | "magiclink"
        | "recovery"
        | "email_change"
        | "email",
    });

    if (!error) {
      console.log(
        "Auth callback: OTP verification successful."
      );

      return NextResponse.redirect(
        new URL(redirectPath, requestUrl.origin)
      );
    }

    console.error(
      "Auth callback: OTP verification failed:",
      error.message
    );
  }

  console.error(
    "Auth callback: No valid authentication code or token could be exchanged."
  );

  return NextResponse.redirect(
    new URL(
      "/student/login?error=auth_callback",
      requestUrl.origin
    )
  );
}