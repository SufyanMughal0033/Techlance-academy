"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function submitAssignment(
  assignmentId: string,
  submissionText: string
) {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  const text = submissionText.trim();

  if (!text) {
    return {
      error: "Please write your answer before submitting.",
    };
  }

  if (text.length < 10) {
    return {
      error: "Your submission is too short.",
    };
  }

  // Get the assignment and its program.
  const { data: assignment, error: assignmentError } =
    await supabase
      .from("assignments")
      .select(`
        id,
        due_date,
        status,
        module:modules (
          program_id
        )
      `)
      .eq("id", assignmentId)
      .eq("status", "published")
      .maybeSingle();

  if (assignmentError || !assignment) {
    return {
      error: "Assignment not found.",
    };
  }

  const moduleData = assignment.module;

  const module = Array.isArray(moduleData)
    ? moduleData[0]
    : moduleData;

  if (!module) {
    return {
      error: "Assignment module not found.",
    };
  }

  // Make sure this student is enrolled in the assignment's program.
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", user.id)
    .eq("program_id", module.program_id)
    .eq("status", "active")
    .maybeSingle();

  if (!enrollment) {
    return {
      error: "You are not enrolled in this assignment's program.",
    };
  }

  // Check existing submission.
  const { data: existingSubmission } = await supabase
    .from("student_submissions")
    .select("id, status")
    .eq("assignment_id", assignmentId)
    .eq("student_id", user.id)
    .maybeSingle();

  /*
   * Once an assignment has been graded, the student should not
   * overwrite the graded submission.
   */
  if (existingSubmission?.status === "graded") {
    return {
      error: "This assignment has already been graded.",
    };
  }

  const now = new Date();
  const dueDate = assignment.due_date
    ? new Date(assignment.due_date)
    : null;

  const isLate = dueDate ? now > dueDate : false;

  const submissionStatus = isLate ? "late" : "submitted";

  if (existingSubmission) {
    const { error } = await supabase
      .from("student_submissions")
      .update({
        submission_text: text,
        submitted_at: now.toISOString(),
        status: submissionStatus,
        updated_at: now.toISOString(),
      })
      .eq("id", existingSubmission.id)
      .eq("student_id", user.id);

    if (error) {
      return {
        error: "Unable to update your submission. Please try again.",
      };
    }
  } else {
    const { error } = await supabase
      .from("student_submissions")
      .insert({
        assignment_id: assignmentId,
        student_id: user.id,
        submission_text: text,
        submitted_at: now.toISOString(),
        status: submissionStatus,
      });

    if (error) {
      return {
        error: "Unable to submit your assignment. Please try again.",
      };
    }
  }

  revalidatePath("/student/assignments");
  revalidatePath(`/student/assignments/${assignmentId}`);

  return {
    success: true,
    message:
      submissionStatus === "late"
        ? "Assignment submitted late."
        : "Assignment submitted successfully.",
  };
}