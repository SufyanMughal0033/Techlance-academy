"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createModule(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const programId = String(formData.get("program_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const moduleOrder = Number(formData.get("module_order") || 1);
  const status = String(formData.get("status") || "active").trim();

  if (!programId || !title) {
    console.error("Create Module: Program and module title are required.");
    return;
  }

  if (!Number.isInteger(moduleOrder) || moduleOrder < 1) {
    console.error("Create Module: Module order must be a positive number.");
    return;
  }

  if (!["active", "inactive"].includes(status)) {
    console.error("Create Module: Invalid module status.");
    return;
  }

  const { error } = await supabase.from("modules").insert({
    program_id: programId,
    title,
    description: description || null,
    module_order: moduleOrder,
    status,
  });

  if (error) {
    console.error("Create Module Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/modules");
}

export async function updateModule(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const moduleOrder = Number(formData.get("module_order") || 1);
  const status = String(formData.get("status") || "active").trim();

  if (!id || !programId || !title) {
    console.error(
      "Update Module: Module ID, program and title are required."
    );
    return;
  }

  if (!Number.isInteger(moduleOrder) || moduleOrder < 1) {
    console.error(
      "Update Module: Module order must be a positive number."
    );
    return;
  }

  if (!["active", "inactive"].includes(status)) {
    console.error("Update Module: Invalid module status.");
    return;
  }

  const { error } = await supabase
    .from("modules")
    .update({
      program_id: programId,
      title,
      description: description || null,
      module_order: moduleOrder,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update Module Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/modules");
}

export async function deleteModule(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete Module: Module ID is required.");
    return;
  }

  const { error } = await supabase
    .from("modules")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Module Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/modules");
}