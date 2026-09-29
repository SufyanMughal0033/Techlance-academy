"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCourse(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const status = String(formData.get("status") || "draft").trim();

  if (!title || !slug) {
    console.error("Create Course: Title and slug are required.");
    return;
  }

  const { error } = await supabase.from("courses").insert({
    title,
    slug,
    description: description || null,
    program_id: programId || null,
    status,
  });

  if (error) {
    console.error("Create Course Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/courses");
}

export async function updateCourse(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const status = String(formData.get("status") || "draft").trim();

  if (!id || !title || !slug) {
    console.error(
      "Update Course: Course ID, title and slug are required."
    );
    return;
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
    console.error("Update Course Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/courses");
}

export async function deleteCourse(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete Course: Course ID is required.");
    return;
  }

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Course Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/courses");
}