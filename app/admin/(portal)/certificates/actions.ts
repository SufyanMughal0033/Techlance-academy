"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "certificates";

function getSafeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadCertificatePdf(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  certificateNumber: string
) {
  if (!file || file.size === 0) {
    return null;
  }

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }

  // 10 MB maximum
  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Certificate PDF must be smaller than 10 MB.");
  }

  const safeName = getSafeFileName(file.name) || "certificate.pdf";

  const filePath = `${certificateNumber}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    console.error("Certificate PDF Upload Error:", {
      message: uploadError.message,
      name: uploadError.name,
    });

    throw new Error(
      `Certificate PDF upload failed: ${uploadError.message}`
    );
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function createCertificate(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const studentId = String(formData.get("student_id") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const issueDate = String(formData.get("issue_date") || "").trim();
  const status = String(formData.get("status") || "issued").trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const certificateFile = formData.get("certificate_file");

  if (!studentId || !programId || !issueDate) {
    throw new Error(
      "Student, program and issue date are required."
    );
  }

  if (!["issued", "revoked", "expired"].includes(status)) {
    throw new Error("Invalid certificate status.");
  }

  if (
    certificateFile &&
    !(certificateFile instanceof File)
  ) {
    throw new Error("Invalid certificate file.");
  }

  /*
   * Generate certificate number first.
   *
   * This uses the existing database function already used
   * by the project for certificate numbers.
   */
  const { data: certificateNumberData, error: numberError } =
    await (supabase.rpc as any)("generate_certificate_number");

  if (numberError) {
    console.error("Certificate Number Error:", numberError);

    throw new Error(
      `Unable to generate certificate number: ${numberError.message}`
    );
  }

  let certificateNumber = "";

  if (typeof certificateNumberData === "string") {
    certificateNumber = certificateNumberData;
  } else if (
    Array.isArray(certificateNumberData) &&
    certificateNumberData.length > 0
  ) {
    certificateNumber = String(
      certificateNumberData[0]
    );
  } else if (certificateNumberData) {
    certificateNumber = String(certificateNumberData);
  }

  if (!certificateNumber) {
    throw new Error(
      "Certificate number could not be generated."
    );
  }

  let certificateUrl: string | null = null;

  if (
    certificateFile instanceof File &&
    certificateFile.size > 0
  ) {
    certificateUrl = await uploadCertificatePdf(
      supabase,
      certificateFile,
      certificateNumber
    );
  }

  const certificateInsert = {
    certificate_number: certificateNumber,
    student_id: studentId,
    program_id: programId,
    issue_date: issueDate,
    status,
    certificate_url: certificateUrl,
    description: description || null,
  };

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
  revalidatePath("/certificate-verification");
}

export async function updateCertificate(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const studentId = String(formData.get("student_id") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const issueDate = String(formData.get("issue_date") || "").trim();
  const status = String(formData.get("status") || "issued").trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const certificateFile = formData.get("certificate_file");

  if (!id || !studentId || !programId || !issueDate) {
    throw new Error(
      "Certificate ID, student, program and issue date are required."
    );
  }

  if (!["issued", "revoked", "expired"].includes(status)) {
    throw new Error("Invalid certificate status.");
  }

  if (
    certificateFile &&
    !(certificateFile instanceof File)
  ) {
    throw new Error("Invalid certificate file.");
  }

  // Get existing certificate so we can preserve its PDF URL
  // if the admin doesn't upload a new PDF.
  const { data: existingCertificate, error: existingError } =
    await supabase
      .from("certificates")
      .select("certificate_number, certificate_url")
      .eq("id", id)
      .single();

  if (existingError || !existingCertificate) {
    throw new Error("Certificate could not be found.");
  }

  let certificateUrl =
    existingCertificate.certificate_url ?? null;

  // If a new PDF was selected, upload it.
  if (
    certificateFile instanceof File &&
    certificateFile.size > 0
  ) {
    certificateUrl = await uploadCertificatePdf(
      supabase,
      certificateFile,
      existingCertificate.certificate_number
    );
  }

  const certificateUpdate = {
    student_id: studentId,
    program_id: programId,
    issue_date: issueDate,
    status,
    certificate_url: certificateUrl,
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
  revalidatePath("/certificate-verification");
}

export async function deleteCertificate(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("Certificate ID is required.");
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
  revalidatePath("/certificate-verification");
}