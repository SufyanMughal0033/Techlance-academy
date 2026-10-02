"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function deleteApplication(applicationId: string) {
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
      error: "Only administrators can delete applications.",
    };
  }

  // Verify application exists
  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select("id, full_name, email")
    .eq("id", applicationId)
    .single();

  if (applicationError || !application) {
    return {
      success: false,
      error: "Application not found.",
    };
  }

  // Use privileged client for permanent deletion
  const adminSupabase = createAdminClient();

  const { error: deleteError } = await adminSupabase
    .from("applications")
    .delete()
    .eq("id", applicationId);

  if (deleteError) {
    return {
      success: false,
      error: deleteError.message,
    };
  }

  revalidatePath("/admin/applications");

  return {
    success: true,
    message: "Application deleted successfully.",
  };
}