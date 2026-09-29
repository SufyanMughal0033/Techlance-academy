"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createProgram(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const status = String(formData.get("status") ?? "draft").trim();

  if (!title || !slug) {
    console.error("Create Program: Title and slug are required.");
    return;
  }

  const { error } = await supabase.from("programs").insert({
    title,
    slug,
    status,
  });

  if (error) {
    console.error("Create Program Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/programs");
  redirect("/admin/programs");
}

export async function updateProgram(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const status = String(formData.get("status") ?? "draft").trim();

  if (!id || !title || !slug) {
    console.error("Update Program: Program information is incomplete.");
    return;
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
    console.error("Update Program Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/programs");
  redirect("/admin/programs");
}

export async function deleteProgram(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    console.error("Delete Program: Program ID is missing.");
    return;
  }

  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Program Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/programs");
  redirect("/admin/programs");
}