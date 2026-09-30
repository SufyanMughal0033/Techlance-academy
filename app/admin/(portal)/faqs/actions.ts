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

function getDisplayOrder(value: FormDataEntryValue | null) {
  const raw = String(value ?? "0").trim();
  const order = Number.parseInt(raw, 10);

  if (!Number.isFinite(order) || order < 0) {
    return null;
  }

  return order;
}

export async function createFaq(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const question = String(formData.get("question") || "").trim();
  const answer = String(formData.get("answer") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const displayOrder = getDisplayOrder(formData.get("display_order"));
  const status = getStatus(formData.get("status"));

  if (!question || !answer) {
    console.error("Create FAQ: Question and answer are required.");
    return;
  }

  if (displayOrder === null) {
    console.error(
      "Create FAQ: Display order must be a valid non-negative number."
    );
    return;
  }

  if (!status) {
    console.error("Create FAQ: Invalid status.");
    return;
  }

  const { error } = await supabase.from("faqs").insert({
    question,
    answer,
    category: category || null,
    display_order: displayOrder,
    status,
  });

  if (error) {
    console.error("Create FAQ Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Create FAQ Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
}

export async function updateFaq(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const question = String(formData.get("question") || "").trim();
  const answer = String(formData.get("answer") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const displayOrder = getDisplayOrder(formData.get("display_order"));
  const status = getStatus(formData.get("status"));

  if (!id || !question || !answer) {
    console.error("Update FAQ: ID, question and answer are required.");
    return;
  }

  if (displayOrder === null) {
    console.error(
      "Update FAQ: Display order must be a valid non-negative number."
    );
    return;
  }

  if (!status) {
    console.error("Update FAQ: Invalid status.");
    return;
  }

  const { error } = await supabase
    .from("faqs")
    .update({
      question,
      answer,
      category: category || null,
      display_order: displayOrder,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update FAQ Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Update FAQ Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
}

export async function deleteFaq(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete FAQ: FAQ ID is required.");
    return;
  }

  const { error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete FAQ Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Delete FAQ Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
}
