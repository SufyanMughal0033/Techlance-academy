
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ASSIGNMENT_BUCKET = "assignment-files";
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "zip",
  "png",
  "jpg",
  "jpeg",
];

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Upload an optional assignment file from the admin's local computer.
 * Returns the public URL, or null if no file was selected.
 */
async function uploadAssignmentFile(
  supabase: SupabaseServerClient,
  formData: FormData
): Promise<string | null> {
  const file = formData.get("attachment_file");

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must not exceed 20 MB.");
  }

  const originalName = file.name;
  const extension = originalName.split(".").pop()?.toLowerCase();

  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    throw new Error(
      "Unsupported file. Allowed formats: PDF, DOC, DOCX, PPT, PPTX, ZIP, PNG, JPG and JPEG."
    );
  }

  // Generate a unique storage path to prevent filename collisions.
  const safeName = originalName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  const filePath = `${crypto.randomUUID()}-${safeName || "assignment"}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(ASSIGNMENT_BUCKET)
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

  if (uploadError) {
    console.error("Assignment File Upload Error:", uploadError);

    throw new Error(
      `Assignment file upload failed: ${uploadError.message}`
    );
  }

  const { data } = supabase.storage
    .from(ASSIGNMENT_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * CREATE ASSIGNMENT
 */
export async function createAssignment(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const moduleId = String(formData.get("module_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const instructions = String(formData.get("instructions") || "").trim();
  const dueDate = String(formData.get("due_date") || "").trim();

  const maxMarksValue = String(formData.get("max_marks") || "100").trim();
  const assignmentOrderValue = String(
    formData.get("assignment_order") || "1"
  ).trim();

  const maxMarks = Number(maxMarksValue);
  const assignmentOrder = Number(assignmentOrderValue);

  let attachmentUrl = String(
    formData.get("attachment_url") || ""
  ).trim();

  const status = String(
    formData.get("status") || "published"
  ).trim();

  if (!moduleId || !title) {
    throw new Error("Module and assignment title are required.");
  }

  if (!Number.isInteger(maxMarks) || maxMarks <= 0) {
    throw new Error("Max marks must be a positive integer.");
  }

  if (!Number.isInteger(assignmentOrder) || assignmentOrder < 1) {
    throw new Error("Assignment order must be a positive integer.");
  }

  if (!["published", "draft", "closed"].includes(status)) {
    throw new Error("Invalid assignment status.");
  }

  // Upload the selected local file, if provided.
  const uploadedUrl = await uploadAssignmentFile(supabase, formData);

  if (uploadedUrl) {
    attachmentUrl = uploadedUrl;
  }

  const { error } = await supabase.from("assignments").insert({
    module_id: moduleId,
    title,
    description: description || null,
    instructions: instructions || null,
    due_date: dueDate || null,
    max_marks: maxMarks,
    attachment_url: attachmentUrl || null,
    assignment_order: assignmentOrder,
    status,
  });

  if (error) {
    console.error("Create Assignment Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(`Failed to create assignment: ${error.message}`);
  }

  revalidatePath("/admin/assignments");
}

/**
 * UPDATE ASSIGNMENT
 */
export async function updateAssignment(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const moduleId = String(formData.get("module_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const instructions = String(formData.get("instructions") || "").trim();
  const dueDate = String(formData.get("due_date") || "").trim();

  const maxMarksValue = String(formData.get("max_marks") || "100").trim();
  const assignmentOrderValue = String(
    formData.get("assignment_order") || "1"
  ).trim();

  const maxMarks = Number(maxMarksValue);
  const assignmentOrder = Number(assignmentOrderValue);

  let attachmentUrl = String(
    formData.get("attachment_url") || ""
  ).trim();

  const status = String(
    formData.get("status") || "published"
  ).trim();

  if (!id || !moduleId || !title) {
    throw new Error(
      "Assignment ID, module and title are required."
    );
  }

  if (!Number.isInteger(maxMarks) || maxMarks <= 0) {
    throw new Error("Max marks must be a positive integer.");
  }

  if (!Number.isInteger(assignmentOrder) || assignmentOrder < 1) {
    throw new Error("Assignment order must be a positive integer.");
  }

  if (!["published", "draft", "closed"].includes(status)) {
    throw new Error("Invalid assignment status.");
  }

  // If a new file is selected, its URL replaces the existing URL.
  // Otherwise, the existing attachment URL is preserved.
  const uploadedUrl = await uploadAssignmentFile(supabase, formData);

  if (uploadedUrl) {
    attachmentUrl = uploadedUrl;
  }

  const { error } = await supabase
    .from("assignments")
    .update({
      module_id: moduleId,
      title,
      description: description || null,
      instructions: instructions || null,
      due_date: dueDate || null,
      max_marks: maxMarks,
      attachment_url: attachmentUrl || null,
      assignment_order: assignmentOrder,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update Assignment Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(`Failed to update assignment: ${error.message}`);
  }

  revalidatePath("/admin/assignments");
}

/**
 * DELETE ASSIGNMENT
 */
export async function deleteAssignment(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("Assignment ID is required.");
  }

  const { error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Assignment Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(`Failed to delete assignment: ${error.message}`);
  }

  revalidatePath("/admin/assignments");
}
