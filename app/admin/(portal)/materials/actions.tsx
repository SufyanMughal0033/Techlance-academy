"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createMaterial(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const moduleId = String(formData.get("module_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const materialType = String(
    formData.get("material_type") || "pdf"
  ).trim();
  const fileUrl = String(formData.get("file_url") || "").trim();
  const externalUrl = String(
    formData.get("external_url") || ""
  ).trim();
  const materialOrder = Number(
    formData.get("material_order") || 1
  );
  const status = String(
    formData.get("status") || "published"
  ).trim();

  if (!moduleId || !title) {
    console.error(
      "Create Material: Module and title are required."
    );
    return;
  }

  if (
    ![
      "pdf",
      "video",
      "document",
      "link",
      "slides",
      "other",
    ].includes(materialType)
  ) {
    console.error("Create Material: Invalid material type.");
    return;
  }

  if (!["published", "draft"].includes(status)) {
    console.error("Create Material: Invalid status.");
    return;
  }

  if (!Number.isInteger(materialOrder) || materialOrder < 1) {
    console.error(
      "Create Material: Material order must be a positive integer."
    );
    return;
  }

  const { error } = await supabase.from("materials").insert({
    module_id: moduleId,
    title,
    description: description || null,
    material_type: materialType,
    file_url: fileUrl || null,
    external_url: externalUrl || null,
    material_order: materialOrder,
    status,
  });

  if (error) {
    console.error("Create Material Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Create Material Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/materials");
}

export async function updateMaterial(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const moduleId = String(formData.get("module_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const materialType = String(
    formData.get("material_type") || "pdf"
  ).trim();
  const fileUrl = String(formData.get("file_url") || "").trim();
  const externalUrl = String(
    formData.get("external_url") || ""
  ).trim();
  const materialOrder = Number(
    formData.get("material_order") || 1
  );
  const status = String(
    formData.get("status") || "published"
  ).trim();

  if (!id || !moduleId || !title) {
    console.error(
      "Update Material: Required fields are missing."
    );
    return;
  }

  if (
    ![
      "pdf",
      "video",
      "document",
      "link",
      "slides",
      "other",
    ].includes(materialType)
  ) {
    console.error("Update Material: Invalid material type.");
    return;
  }

  if (!["published", "draft"].includes(status)) {
    console.error("Update Material: Invalid status.");
    return;
  }

  if (!Number.isInteger(materialOrder) || materialOrder < 1) {
    console.error(
      "Update Material: Material order must be a positive integer."
    );
    return;
  }

  const { error } = await supabase
    .from("materials")
    .update({
      module_id: moduleId,
      title,
      description: description || null,
      material_type: materialType,
      file_url: fileUrl || null,
      external_url: externalUrl || null,
      material_order: materialOrder,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update Material Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Update Material Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/materials");
}

export async function deleteMaterial(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete Material: Material ID is required.");
    return;
  }

  const { error } = await supabase
    .from("materials")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Material Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Delete Material Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/materials");
}