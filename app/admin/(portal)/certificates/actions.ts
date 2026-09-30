"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCertificate(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const studentId = String(formData.get("student_id") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const issueDate = String(formData.get("issue_date") || "").trim();
  const status = String(formData.get("status") || "issued").trim();
  const certificateUrl = String(
    formData.get("certificate_url") || ""
  ).trim();
  const description = String(
    formData.get("description") || ""
  ).trim();

  if (!studentId || !programId || !issueDate) {
    console.error(
      "Create Certificate: Student, program and issue date are required."
    );
    return;
  }

  if (!["issued", "revoked", "expired"].includes(status)) {
    console.error("Create Certificate: Invalid status.");
    return;
  }

  const certificateInsert = {
    student_id: studentId,
    program_id: programId,
    issue_date: issueDate,
    status,
    certificate_url: certificateUrl || null,
    description: description || null,
  };

  // certificate_number is generated automatically by the database trigger.
  // The generated database type currently marks it as required,
  // so we intentionally bypass only this stale TypeScript requirement.
  const { error } = await supabase
    .from("certificates")
    .insert(certificateInsert as never);

  if (error) {
    console.error("Create Certificate Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Create Certificate Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/certificates");
}

export async function updateCertificate(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const studentId = String(formData.get("student_id") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const issueDate = String(formData.get("issue_date") || "").trim();
  const status = String(formData.get("status") || "issued").trim();
  const certificateUrl = String(
    formData.get("certificate_url") || ""
  ).trim();
  const description = String(
    formData.get("description") || ""
  ).trim();

  if (!id || !studentId || !programId || !issueDate) {
    console.error(
      "Update Certificate: Certificate ID, student, program and issue date are required."
    );
    return;
  }

  if (!["issued", "revoked", "expired"].includes(status)) {
    console.error("Update Certificate: Invalid status.");
    return;
  }

  const certificateUpdate = {
    student_id: studentId,
    program_id: programId,
    issue_date: issueDate,
    status,
    certificate_url: certificateUrl || null,
    description: description || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("certificates")
    .update(certificateUpdate)
    .eq("id", id);

  if (error) {
    console.error("Update Certificate Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Update Certificate Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/certificates");
}

export async function deleteCertificate(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete Certificate: Certificate ID is required.");
    return;
  }

  const { error } = await supabase
    .from("certificates")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Certificate Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Delete Certificate Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/certificates");
}