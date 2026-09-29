"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createAttendance(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const classId = String(formData.get("class_id") || "").trim();
  const studentId = String(formData.get("student_id") || "").trim();
  const status = String(formData.get("status") || "present").trim();
  const remarks = String(formData.get("remarks") || "").trim();

  if (!classId || !studentId) {
    console.error("Create Attendance: Class and student are required.");
    return;
  }

  if (!["present", "absent", "late"].includes(status)) {
    console.error("Create Attendance: Invalid attendance status.");
    return;
  }

  const { error } = await supabase.from("attendance").insert({
    class_id: classId,
    student_id: studentId,
    status,
    remarks: remarks || null,
  });

  if (error) {
    console.error("Create Attendance Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Create Attendance Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/attendance");
}

export async function updateAttendance(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const classId = String(formData.get("class_id") || "").trim();
  const studentId = String(formData.get("student_id") || "").trim();
  const status = String(formData.get("status") || "present").trim();
  const remarks = String(formData.get("remarks") || "").trim();

  if (!id || !classId || !studentId) {
    console.error(
      "Update Attendance: ID, class and student are required."
    );
    return;
  }

  if (!["present", "absent", "late"].includes(status)) {
    console.error("Update Attendance: Invalid attendance status.");
    return;
  }

  const { error } = await supabase
    .from("attendance")
    .update({
      class_id: classId,
      student_id: studentId,
      status,
      remarks: remarks || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update Attendance Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Update Attendance Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/attendance");
}

export async function deleteAttendance(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete Attendance: Attendance ID is required.");
    return;
  }

  const { error } = await supabase
    .from("attendance")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Attendance Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Delete Attendance Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/attendance");
}