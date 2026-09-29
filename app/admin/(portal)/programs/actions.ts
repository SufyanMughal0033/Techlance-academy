"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProgram(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const status = String(formData.get("status") ?? "draft").trim();

  if (!title || !slug) {
    return { error: "Title and slug are required." };
  }

  const { error } = await supabase.from("programs").insert({
    title,
    slug,
    status,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/programs");

  return { success: true };
}

export async function updateProgram(formData: FormData) {
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const status = String(formData.get("status") ?? "draft").trim();

  if (!id || !title || !slug) {
    return { error: "Program information is incomplete." };
  }

  const { error } = await supabase
    .from("programs")
    .update({
      title,
      slug,
      status,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/programs");

  return { success: true };
}

export async function deleteProgram(formData: FormData) {
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Program ID is missing." };
  }

  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/programs");

  return { success: true };
}