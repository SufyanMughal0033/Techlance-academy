"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createModule(formData: FormData) {
  const supabase = await createClient();

  const programId = String(formData.get("program_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const moduleOrder = Number(formData.get("module_order") || 1);
  const status = String(formData.get("status") || "active").trim();

  if (!programId || !title) {
    return {
      error: "Program and module title are required.",
    };
  }

  if (!Number.isInteger(moduleOrder) || moduleOrder < 1) {
    return {
      error: "Module order must be a positive number.",
    };
  }

  if (!["active", "inactive"].includes(status)) {
    return {
      error: "Invalid module status.",
    };
  }

  const { error } = await supabase.from("modules").insert({
    program_id: programId,
    title,
    description: description || null,
    module_order: moduleOrder,
    status,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/admin/modules");

  return {
    success: true,
  };
}

export async function updateModule(formData: FormData) {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const programId = String(formData.get("program_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const moduleOrder = Number(formData.get("module_order") || 1);
  const status = String(formData.get("status") || "active").trim();

  if (!id || !programId || !title) {
    return {
      error: "Module ID, program and title are required.",
    };
  }

  if (!Number.isInteger(moduleOrder) || moduleOrder < 1) {
    return {
      error: "Module order must be a positive number.",
    };
  }

  if (!["active", "inactive"].includes(status)) {
    return {
      error: "Invalid module status.",
    };
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
    return {
      error: error.message,
    };
  }

  revalidatePath("/admin/modules");

  return {
    success: true,
  };
}

export async function deleteModule(formData: FormData) {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    return {
      error: "Module ID is required.",
    };
  }

  const { error } = await supabase
    .from("modules")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/admin/modules");

  return {
    success: true,
  };
}