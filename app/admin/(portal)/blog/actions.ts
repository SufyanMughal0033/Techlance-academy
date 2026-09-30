"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function getTags(formData: FormData): string[] {
  const rawTags = String(formData.get("tags") || "");

  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createBlogPost(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "")
    .trim()
    .toLowerCase();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const featuredImage = String(
    formData.get("featured_image") || ""
  ).trim();
  const category = String(formData.get("category") || "").trim();
  const seoTitle = String(
    formData.get("seo_title") || ""
  ).trim();
  const seoDescription = String(
    formData.get("seo_description") || ""
  ).trim();
  const status = String(
    formData.get("status") || "draft"
  ).trim();
  const publishedAt = String(
    formData.get("published_at") || ""
  ).trim();

  const tags = getTags(formData);

  if (!title || !slug || !content) {
    console.error(
      "Create Blog Post: Title, slug and content are required."
    );
    return;
  }

  if (!["draft", "published"].includes(status)) {
    console.error("Create Blog Post: Invalid status.");
    return;
  }

  const { error } = await supabase.from("blog_posts").insert({
    title,
    slug,
    excerpt: excerpt || null,
    content,
    featured_image: featuredImage || null,
    category: category || null,
    tags: tags.length ? tags : null,
    seo_title: seoTitle || null,
    seo_description: seoDescription || null,
    status,
    published_at:
      status === "published"
        ? publishedAt || new Date().toISOString()
        : null,
  });

  if (error) {
    console.error("Create Blog Post Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Create Blog Post Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updateBlogPost(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "")
    .trim()
    .toLowerCase();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const featuredImage = String(
    formData.get("featured_image") || ""
  ).trim();
  const category = String(formData.get("category") || "").trim();
  const seoTitle = String(
    formData.get("seo_title") || ""
  ).trim();
  const seoDescription = String(
    formData.get("seo_description") || ""
  ).trim();
  const status = String(
    formData.get("status") || "draft"
  ).trim();
  const publishedAt = String(
    formData.get("published_at") || ""
  ).trim();

  const tags = getTags(formData);

  if (!id || !title || !slug || !content) {
    console.error(
      "Update Blog Post: ID, title, slug and content are required."
    );
    return;
  }

  if (!["draft", "published"].includes(status)) {
    console.error("Update Blog Post: Invalid status.");
    return;
  }

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      featured_image: featuredImage || null,
      category: category || null,
      tags: tags.length ? tags : null,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      status,
      published_at:
        status === "published"
          ? publishedAt || new Date().toISOString()
          : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update Blog Post Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Update Blog Post Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deleteBlogPost(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete Blog Post: Blog post ID is required.");
    return;
  }

  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Blog Post Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Delete Blog Post Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}