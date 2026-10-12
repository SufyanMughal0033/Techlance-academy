
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "assignment-submissions";
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

export async function submitAssignment(
  assignmentId: string,
  submissionText: string,
  submissionUrl: string,
  pdfFile: File | null
) {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  const text = submissionText.trim();
  const urlText = submissionUrl.trim();
  const hasPdf = !!pdfFile && pdfFile.size > 0;

  if (text && text.length < 10 && !urlText && !hasPdf) {
    return {
      error: "Please write at least 10 characters, or submit a URL/PDF.",
    };
  }

  if (!text && !urlText && !hasPdf) {
    return {
      error: "Please provide an answer, a project URL, or a PDF file.",
    };
  }

  let validatedUrl: string | null = null;

  if (urlText) {
    try {
      const parsedUrl = new URL(urlText);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return { error: "Please enter a valid HTTP or HTTPS URL." };
      }

      validatedUrl = parsedUrl.toString();
    } catch {
      return { error: "Please enter a valid project URL." };
    }
  }

  if (hasPdf && pdfFile) {
    if (
      pdfFile.type !== "application/pdf" &&
      !pdfFile.name.toLowerCase().endsWith(".pdf")
    ) {
      return { error: "Only PDF files are allowed." };
    }

    if (pdfFile.size > MAX_PDF_SIZE) {
      return { error: "PDF size must be 10 MB or less." };
    }
  }

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
    return { error: "Assignment not found." };
  }

  const moduleData = assignment.module;
  const module = Array.isArray(moduleData)
    ? moduleData[0]
    : moduleData;

  if (!module) {
    return { error: "Assignment module not found." };
  }

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

  const { data: existingSubmission, error: existingError } =
    await supabase
      .from("student_submissions")
      .select("id, status, submission_pdf_path")
      .eq("assignment_id", assignmentId)
      .eq("student_id", user.id)
      .maybeSingle();

  if (existingError) {
    return { error: "Unable to check your previous submission." };
  }

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

  let pdfPath: string | null =
    existingSubmission?.submission_pdf_path ?? null;

  if (hasPdf && pdfFile) {
    const safeFileName = pdfFile.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(-100);

    const newPath =
      `${user.id}/${assignmentId}/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(newPath, pdfFile, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Assignment PDF upload error:", uploadError.message);

      return {
        error:
          "PDF upload failed. Please check the Storage bucket and its permissions.",
      };
    }

    pdfPath = newPath;
  }

  const submissionData = {
    submission_text: text || null,
    submission_url: validatedUrl,
    submission_pdf_path: pdfPath,
    submitted_at: now.toISOString(),
    status: submissionStatus,
    updated_at: now.toISOString(),
  };

  if (existingSubmission) {
    const { error } = await supabase
      .from("student_submissions")
      .update(submissionData)
      .eq("id", existingSubmission.id)
      .eq("student_id", user.id);

    if (error) {
      console.error("Submission update error:", error.message);

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
        ...submissionData,
      });

    if (error) {
      console.error("Submission insert error:", error.message);

      return {
        error: "Unable to submit your assignment. Please try again.",
      };
    }
  }

  revalidatePath("/student/assignments");
  revalidatePath(`/student/assignments/${assignmentId}`);

  return {
    success: true,
    message: isLate
      ? "Assignment submitted late."
      : "Assignment submitted successfully.",
  };
}

/**
 * Creates a temporary link for the logged-in student's submitted PDF.
 */
export async function getMySubmissionPdfUrl(assignmentId: string) {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  const { data: submission, error } = await supabase
    .from("student_submissions")
    .select("submission_pdf_path")
    .eq("assignment_id", assignmentId)
    .eq("student_id", user.id)
    .maybeSingle();

  if (error || !submission?.submission_pdf_path) {
    return { error: "No submitted PDF was found." };
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(submission.submission_pdf_path, 60 * 5);

  if (signedUrlError || !data?.signedUrl) {
    return { error: "Unable to open the submitted PDF." };
  }

  return { url: data.signedUrl };
}
