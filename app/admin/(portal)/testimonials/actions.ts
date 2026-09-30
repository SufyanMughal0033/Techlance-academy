"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function getStatus(value: FormDataEntryValue | null) {
  const status = String(value || "draft").trim();

  if (status !== "draft" && status !== "published") {
    return null;
  }

  return status;
}

function getRating(value: FormDataEntryValue | null) {
  const rating = Number.parseInt(String(value ?? "5").trim(), 10);

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return null;
  }

  return rating;
}

function getDisplayOrder(value: FormDataEntryValue | null) {
  const order = Number.parseInt(String(value ?? "0").trim(), 10);

  if (!Number.isFinite(order) || order < 0) {
    return null;
  }

  return order;
}

export async function createTestimonial(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const avatarUrl = String(formData.get("avatar_url") || "").trim();

  const rating = getRating(formData.get("rating"));
  const displayOrder = getDisplayOrder(
    formData.get("display_order")
  );
  const status = getStatus(formData.get("status"));

  if (!name || !content) {
    console.error(
      "Create Testimonial: Name and testimonial content are required."
    );
    return;
  }

  if (rating === null) {
    console.error(
      "Create Testimonial: Rating must be between 1 and 5."
    );
    return;
  }

  if (displayOrder === null) {
    console.error(
      "Create Testimonial: Display order must be a valid non-negative number."
    );
    return;
  }

  if (!status) {
    console.error("Create Testimonial: Invalid status.");
    return;
  }

  const { error } = await supabase
    .from("testimonials")
    .insert({
      name,
      role: role || null,
      company: company || null,
      content,
      rating,
      avatar_url: avatarUrl || null,
      display_order: displayOrder,
      status,
    });

  if (error) {
    console.error("Create Testimonial Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Create Testimonial Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function updateTestimonial(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const avatarUrl = String(formData.get("avatar_url") || "").trim();

  const rating = getRating(formData.get("rating"));
  const displayOrder = getDisplayOrder(
    formData.get("display_order")
  );
  const status = getStatus(formData.get("status"));

  if (!id || !name || !content) {
    console.error(
      "Update Testimonial: ID, name and testimonial content are required."
    );
    return;
  }

  if (rating === null) {
    console.error(
      "Update Testimonial: Rating must be between 1 and 5."
    );
    return;
  }

  if (displayOrder === null) {
    console.error(
      "Update Testimonial: Display order must be a valid non-negative number."
    );
    return;
  }

  if (!status) {
    console.error("Update Testimonial: Invalid status.");
    return;
  }

  const { error } = await supabase
    .from("testimonials")
    .update({
      name,
      role: role || null,
      company: company || null,
      content,
      rating,
      avatar_url: avatarUrl || null,
      display_order: displayOrder,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update Testimonial Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Update Testimonial Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete Testimonial: Testimonial ID is required.");
    return;
  }

  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Testimonial Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Delete Testimonial Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}
