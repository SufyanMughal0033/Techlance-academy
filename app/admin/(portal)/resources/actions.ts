"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getNumber(formData: FormData, key: string, fallback = 1) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

export async function createResource(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const resourceType = getString(formData, "resource_type");
  const url = getString(formData, "url");
  const thumbnailUrl = getString(formData, "thumbnail_url");
  const resourceOrder = getNumber(formData, "resource_order", 1);
  const status = getString(formData, "status");

  if (!title) {
    console.error("Resource creation failed:", "Title is required.");
    return;
  }

  if (!url) {
    console.error("Resource creation failed:", "URL is required.");
    return;
  }

  if (resourceOrder < 1) {
    console.error("Resource creation failed:", "Order must be at least 1.");
    return;
  }

  const { error } = await supabase.from("resources").insert({
    title,
    description: description || null,
    resource_type: resourceType || "link",
    url,
    thumbnail_url: thumbnailUrl || null,
    resource_order: resourceOrder,
    status: status || "published",
  });

  if (error) {
    console.error("Resource creation failed:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/resources");
}

export async function updateResource(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const resourceType = getString(formData, "resource_type");
  const url = getString(formData, "url");
  const thumbnailUrl = getString(formData, "thumbnail_url");
  const resourceOrder = getNumber(formData, "resource_order", 1);
  const status = getString(formData, "status");

  if (!id) {
    console.error("Resource update failed:", "Resource ID is required.");
    return;
  }

  if (!title) {
    console.error("Resource update failed:", "Title is required.");
    return;
  }

  if (!url) {
    console.error("Resource update failed:", "URL is required.");
    return;
  }

  if (resourceOrder < 1) {
    console.error("Resource update failed:", "Order must be at least 1.");
    return;
  }

  const { error } = await supabase
    .from("resources")
    .update({
      title,
      description: description || null,
      resource_type: resourceType || "link",
      url,
      thumbnail_url: thumbnailUrl || null,
      resource_order: resourceOrder,
      status: status || "published",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Resource update failed:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/resources");
}

export async function deleteResource(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = getString(formData, "id");

  if (!id) {
    console.error("Resource deletion failed:", "Resource ID is required.");
    return;
  }

  const { error } = await supabase
    .from("resources")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Resource deletion failed:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/resources");
}