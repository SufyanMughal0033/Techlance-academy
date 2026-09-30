"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createContent(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const contentType = getString(formData, "content_type");
  const content = getString(formData, "content");
  const excerpt = getString(formData, "excerpt");
  const imageUrl = getString(formData, "image_url");
  const status = getString(formData, "status");

  if (!title) {
    console.error("Content creation failed:", "Title is required.");
    return;
  }

  if (!slug) {
    console.error("Content creation failed:", "Slug is required.");
    return;
  }

  const { error } = await supabase.from("content").insert({
    title,
    slug,
    content_type: contentType || "page",
    content: content || null,
    excerpt: excerpt || null,
    image_url: imageUrl || null,
    status: status || "published",
  });

  if (error) {
    console.error("Content creation failed:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/content");
}

export async function updateContent(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const contentType = getString(formData, "content_type");
  const content = getString(formData, "content");
  const excerpt = getString(formData, "excerpt");
  const imageUrl = getString(formData, "image_url");
  const status = getString(formData, "status");

  if (!id) {
    console.error("Content update failed:", "Content ID is required.");
    return;
  }

  if (!title) {
    console.error("Content update failed:", "Title is required.");
    return;
  }

  if (!slug) {
    console.error("Content update failed:", "Slug is required.");
    return;
  }

  const { error } = await supabase
    .from("content")
    .update({
      title,
      slug,
      content_type: contentType || "page",
      content: content || null,
      excerpt: excerpt || null,
      image_url: imageUrl || null,
      status: status || "published",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Content update failed:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/content");
}

export async function deleteContent(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = getString(formData, "id");

  if (!id) {
    console.error("Content deletion failed:", "Content ID is required.");
    return;
  }

  const { error } = await supabase
    .from("content")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Content deletion failed:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/content");
}