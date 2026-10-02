"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function deleteStudent(studentId: string) {
  const supabase = await createClient();

  // Check logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  // Check admin role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return {
      success: false,
      error: "Only administrators can delete students.",
    };
  }

  // Verify the target is actually a student
  const { data: student, error: studentError } = await supabase
    .from("profiles")
    .select("id, fullname, email, role")
    .eq("id", studentId)
    .eq("role", "student")
    .single();

  if (studentError || !student) {
    return {
      success: false,
      error: "Student account not found.",
    };
  }

  // Server-side privileged client
  const adminSupabase = createAdminClient();

  // Permanently delete Auth account.
  // profiles/students/enrollments will follow the configured
  // ON DELETE CASCADE relationships.
  const { error: deleteError } =
    await adminSupabase.auth.admin.deleteUser(studentId);

  if (deleteError) {
    return {
      success: false,
      error: deleteError.message,
    };
  }

  revalidatePath("/admin/students");
  revalidatePath("/admin/applications");

  return {
    success: true,
    message: `${student.fullname || student.email || "Student"} has been permanently deleted.`,
  };
}