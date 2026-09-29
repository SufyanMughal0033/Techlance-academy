"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCourse(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const status = String(formData.get("status") || "draft").trim();

  if (!title || !slug) {
    return { error: "Title and slug are required." };
  }

  const { error } = await supabase.from("courses").insert({
    title,
    slug,
    description: description || null,
    program_id: programId || null,
    status,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/courses");

  return { success: true };
}

export async function updateCourse(formData: FormData) {
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const status = String(formData.get("status") || "draft").trim();

  if (!id || !title || !slug) {
    return { error: "Course ID, title and slug are required." };
  }

  const { error } = await supabase
    .from("courses")
    .update({
      title,
      slug,
      description: description || null,
      program_id: programId || null,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/courses");

  return { success: true };
}

export async function deleteCourse(formData: FormData) {
  const supabase = await createClient();

  const id = String(formData.get("id") || "");

  if (!id) {
    return { error: "Course ID is required." };
  }

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/courses");

  return { success: true };
}