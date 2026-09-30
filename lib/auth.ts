import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type UserRole =
  | "admin"
  | "student"
  | "instructor";

const LOGIN_PATH: Record<UserRole, string> = {
  admin: "/admin/login",
  student: "/student/login",
  instructor: "/student/login",
};

/**
 * Server-side authorization check:
 * confirms there's a signed-in Supabase user AND that their
 * profiles.role matches the required portal role.
 */
export async function requireRole(role: UserRole) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(LOGIN_PATH[role]);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    profile.role !== role ||
    !profile.is_active
  ) {
    redirect(LOGIN_PATH[role]);
  }

  return {
    user,
    profile,
  };
}