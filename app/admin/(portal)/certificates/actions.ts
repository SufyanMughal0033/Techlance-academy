"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCertificate(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const studentId = String(formData.get("student_id") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const issueDate = String(formData.get("issue_date") || "").trim();
  const expiryDate = String(formData.get("expiry_date") || "").trim();
  const status = String(formData.get("status") || "issued").trim();
  const certificateUrl = String(formData.get("certificate_url") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!studentId || !issueDate) {
    console.error(
      "Create Certificate: Student and issue date are required."
    );
    return;
  }

  if (!["issued", "revoked", "expired"].includes(status)) {
    console.error("Create Certificate: Invalid status.");
    return;
  }

  if (expiryDate && issueDate && expiryDate < issueDate) {
    console.error(
      "Create Certificate: Expiry date cannot be before issue date."
    );
    return;
  }

  const { error } = await supabase.from("certificates").insert({
    student_id: studentId,
    program_id: programId || null,
    issue_date: issueDate,
    expiry_date: expiryDate || null,
    status,
    certificate_url: certificateUrl || null,
    notes: notes || null,
  });

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
  const expiryDate = String(formData.get("expiry_date") || "").trim();
  const status = String(formData.get("status") || "issued").trim();
  const certificateUrl = String(formData.get("certificate_url") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!id || !studentId || !issueDate) {
    console.error(
      "Update Certificate: Required fields are missing."
    );
    return;
  }

  if (!["issued", "revoked", "expired"].includes(status)) {
    console.error("Update Certificate: Invalid status.");
    return;
  }

  if (expiryDate && issueDate && expiryDate < issueDate) {
    console.error(
      "Update Certificate: Expiry date cannot be before issue date."
    );
    return;
  }

  const { error } = await supabase
    .from("certificates")
    .update({
      student_id: studentId,
      program_id: programId || null,
      issue_date: issueDate,
      expiry_date: expiryDate || null,
      status,
      certificate_url: certificateUrl || null,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
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