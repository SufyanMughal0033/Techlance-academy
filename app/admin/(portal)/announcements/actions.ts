"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createAnnouncement(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const title = getString(formData, "title");
  const message = getString(formData, "message");
  const announcementType = getString(
    formData,
    "announcement_type"
  );
  const targetType = getString(formData, "target_type");
  const programId = getString(formData, "program_id");
  const publishedAt = getString(formData, "published_at");
  const status = getString(formData, "status");

  if (!title) {
    console.error(
      "Announcement creation failed:",
      "Title is required."
    );
    return;
  }

  if (!message) {
    console.error(
      "Announcement creation failed:",
      "Message is required."
    );
    return;
  }

  if (targetType === "program" && !programId) {
    console.error(
      "Announcement creation failed:",
      "Program is required when target is a program."
    );
    return;
  }

  const { error } = await supabase
    .from("announcements")
    .insert({
      title,
      message,
      announcement_type: announcementType || "general",
      target_type: targetType || "all",
      program_id:
        targetType === "program" && programId
          ? programId
          : null,
      published_at: publishedAt
        ? new Date(publishedAt).toISOString()
        : null,
      status: status || "published",
    });

  if (error) {
    console.error(
      "Announcement creation failed:",
      error.message
    );
    throw new Error(error.message);
  }

  revalidatePath("/admin/announcements");
}

export async function updateAnnouncement(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const message = getString(formData, "message");
  const announcementType = getString(
    formData,
    "announcement_type"
  );
  const targetType = getString(formData, "target_type");
  const programId = getString(formData, "program_id");
  const publishedAt = getString(formData, "published_at");
  const status = getString(formData, "status");

  if (!id) {
    console.error(
      "Announcement update failed:",
      "Announcement ID is required."
    );
    return;
  }

  if (!title) {
    console.error(
      "Announcement update failed:",
      "Title is required."
    );
    return;
  }

  if (!message) {
    console.error(
      "Announcement update failed:",
      "Message is required."
    );
    return;
  }

  if (targetType === "program" && !programId) {
    console.error(
      "Announcement update failed:",
      "Program is required when target is a program."
    );
    return;
  }

  const { error } = await supabase
    .from("announcements")
    .update({
      title,
      message,
      announcement_type: announcementType || "general",
      target_type: targetType || "all",
      program_id:
        targetType === "program" && programId
          ? programId
          : null,
      published_at: publishedAt
        ? new Date(publishedAt).toISOString()
        : null,
      status: status || "published",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Announcement update failed:",
      error.message
    );
    throw new Error(error.message);
  }

  revalidatePath("/admin/announcements");
}

export async function deleteAnnouncement(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = getString(formData, "id");

  if (!id) {
    console.error(
      "Announcement deletion failed:",
      "Announcement ID is required."
    );
    return;
  }

  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Announcement deletion failed:",
      error.message
    );
    throw new Error(error.message);
  }

  revalidatePath("/admin/announcements");
}