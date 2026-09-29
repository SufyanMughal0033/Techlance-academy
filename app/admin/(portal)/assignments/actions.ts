"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createAssignment(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const moduleId = String(formData.get("module_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const instructions = String(formData.get("instructions") || "").trim();
  const dueDate = String(formData.get("due_date") || "").trim();
  const maxMarks = Number(formData.get("max_marks") || 100);
  const attachmentUrl = String(formData.get("attachment_url") || "").trim();
  const assignmentOrder = Number(
    formData.get("assignment_order") || 1
  );
  const status = String(formData.get("status") || "published").trim();

  if (!moduleId || !title) {
    console.error("Create Assignment: Module and title are required.");
    return;
  }

  if (!Number.isInteger(maxMarks) || maxMarks <= 0) {
    console.error("Create Assignment: Max marks must be greater than 0.");
    return;
  }

  if (!Number.isInteger(assignmentOrder) || assignmentOrder < 1) {
    console.error(
      "Create Assignment: Assignment order must be a positive number."
    );
    return;
  }

  if (!["published", "draft", "closed"].includes(status)) {
    console.error("Create Assignment: Invalid assignment status.");
    return;
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

    throw new Error(
      `Create Assignment Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/assignments");
}

export async function updateAssignment(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const moduleId = String(formData.get("module_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const instructions = String(formData.get("instructions") || "").trim();
  const dueDate = String(formData.get("due_date") || "").trim();
  const maxMarks = Number(formData.get("max_marks") || 100);
  const attachmentUrl = String(formData.get("attachment_url") || "").trim();
  const assignmentOrder = Number(
    formData.get("assignment_order") || 1
  );
  const status = String(formData.get("status") || "published").trim();

  if (!id || !moduleId || !title) {
    console.error(
      "Update Assignment: Assignment ID, module and title are required."
    );
    return;
  }

  if (!Number.isInteger(maxMarks) || maxMarks <= 0) {
    console.error("Update Assignment: Max marks must be greater than 0.");
    return;
  }

  if (!Number.isInteger(assignmentOrder) || assignmentOrder < 1) {
    console.error(
      "Update Assignment: Assignment order must be a positive number."
    );
    return;
  }

  if (!["published", "draft", "closed"].includes(status)) {
    console.error("Update Assignment: Invalid assignment status.");
    return;
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

    throw new Error(
      `Update Assignment Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/assignments");
}

export async function deleteAssignment(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete Assignment: Assignment ID is required.");
    return;
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

    throw new Error(
      `Delete Assignment Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/assignments");
}