"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProgress(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const studentId = String(formData.get("student_id") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const completionPercentage = Number(
    formData.get("completion_percentage") || 0
  );
  const status = String(formData.get("status") || "not_started").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!studentId) {
    console.error("Create Progress: Student is required.");
    return;
  }

  if (
    !Number.isInteger(completionPercentage) ||
    completionPercentage < 0 ||
    completionPercentage > 100
  ) {
    console.error(
      "Create Progress: Completion percentage must be between 0 and 100."
    );
    return;
  }

  if (
    !["not_started", "in_progress", "completed"].includes(
      status
    )
  ) {
    console.error("Create Progress: Invalid status.");
    return;
  }

  const { error } = await supabase.from("progress").insert({
    student_id: studentId,
    program_id: programId || null,
    completion_percentage: completionPercentage,
    status,
    notes: notes || null,
  });

  if (error) {
    console.error("Create Progress Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Create Progress Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/progress");
}

export async function updateProgress(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const studentId = String(formData.get("student_id") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const completionPercentage = Number(
    formData.get("completion_percentage") || 0
  );
  const status = String(formData.get("status") || "not_started").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!id || !studentId) {
    console.error(
      "Update Progress: ID and student are required."
    );
    return;
  }

  if (
    !Number.isInteger(completionPercentage) ||
    completionPercentage < 0 ||
    completionPercentage > 100
  ) {
    console.error(
      "Update Progress: Completion percentage must be between 0 and 100."
    );
    return;
  }

  if (
    !["not_started", "in_progress", "completed"].includes(
      status
    )
  ) {
    console.error("Update Progress: Invalid status.");
    return;
  }

  const { error } = await supabase
    .from("progress")
    .update({
      student_id: studentId,
      program_id: programId || null,
      completion_percentage: completionPercentage,
      status,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update Progress Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Update Progress Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/progress");
}

export async function deleteProgress(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete Progress: Progress ID is required.");
    return;
  }

  const { error } = await supabase
    .from("progress")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Progress Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Delete Progress Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/progress");
}