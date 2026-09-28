"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/schemas/auth";

export async function signInStudent(values: { email: string; password: string }) {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    return { error: "Incorrect email or password." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .single();

  if (!profile || profile.role !== "student" || !profile.is_active) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have student access." };
  }

  return { success: true };
}
