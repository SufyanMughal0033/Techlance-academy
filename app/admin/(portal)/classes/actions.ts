"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createClass(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const moduleId = String(formData.get("module_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const classDate = String(formData.get("class_date") || "").trim();
  const startTime = String(formData.get("start_time") || "").trim();
  const endTime = String(formData.get("end_time") || "").trim();
  const meetingUrl = String(formData.get("meeting_url") || "").trim();
  const recordingUrl = String(formData.get("recording_url") || "").trim();
  const classOrder = Number(formData.get("class_order") || 1);
  const status = String(formData.get("status") || "scheduled").trim();

  if (!moduleId || !title) {
    console.error("Create Class: Module and class title are required.");
    return;
  }

  if (!Number.isInteger(classOrder) || classOrder < 1) {
    console.error("Create Class: Class order must be a positive number.");
    return;
  }

  if (!["scheduled", "live", "completed"].includes(status)) {
    console.error("Create Class: Invalid class status.");
    return;
  }

  const { error } = await supabase.from("classes").insert({
    module_id: moduleId,
    title,
    description: description || null,
    class_date: classDate || null,
    start_time: startTime || null,
    end_time: endTime || null,
    meeting_url: meetingUrl || null,
    recording_url: recordingUrl || null,
    class_order: classOrder,
    status,
  });

  if (error) {
    console.error("Create Class Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/classes");
}

export async function updateClass(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const moduleId = String(formData.get("module_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const classDate = String(formData.get("class_date") || "").trim();
  const startTime = String(formData.get("start_time") || "").trim();
  const endTime = String(formData.get("end_time") || "").trim();
  const meetingUrl = String(formData.get("meeting_url") || "").trim();
  const recordingUrl = String(formData.get("recording_url") || "").trim();
  const classOrder = Number(formData.get("class_order") || 1);
  const status = String(formData.get("status") || "scheduled").trim();

  if (!id || !moduleId || !title) {
    console.error(
      "Update Class: Class ID, module and title are required."
    );
    return;
  }

  if (!Number.isInteger(classOrder) || classOrder < 1) {
    console.error("Update Class: Class order must be a positive number.");
    return;
  }

  if (!["scheduled", "live", "completed"].includes(status)) {
    console.error("Update Class: Invalid class status.");
    return;
  }

  const { error } = await supabase
    .from("classes")
    .update({
      module_id: moduleId,
      title,
      description: description || null,
      class_date: classDate || null,
      start_time: startTime || null,
      end_time: endTime || null,
      meeting_url: meetingUrl || null,
      recording_url: recordingUrl || null,
      class_order: classOrder,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update Class Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/classes");
}

export async function deleteClass(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete Class: Class ID is required.");
    return;
  }

  const { error } = await supabase
    .from("classes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Class Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/classes");
}