import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { SubmissionForm } from "./submission-form";

export const metadata = {
  title: "Assignment",
};

function formatDate(date: string | null) {
  if (!date) return "No due date";

  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatStatus(status: string | null | undefined) {
  if (!status) return "Not Submitted";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { user } = await requireRole("student");
  const supabase = await createClient();

  /*
   * Get assignment
   */
  const { data: assignment, error: assignmentError } =
    await supabase
      .from("assignments")
      .select(`
        id,
        title,
        description,
        instructions,
        due_date,
        max_marks,
        status,
        module:modules (
          id,
          title,
          program_id
        )
      `)
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle();

  if (assignmentError || !assignment) {
    notFound();
  }

  const moduleData = assignment.module;

  const module = Array.isArray(moduleData)
    ? moduleData[0]
    : moduleData;

  if (!module) {
    notFound();
  }

  /*
   * Verify student's enrollment
   */
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", user.id)
    .eq("program_id", module.program_id)
    .eq("status", "active")
    .maybeSingle();

  if (!enrollment) {
    notFound();
  }

  /*
   * Get current student's submission
   */
  const { data: submission } = await supabase
    .from("student_submissions")
    .select(`
      id,
      submission_text,
      file_url,
      submitted_at,
      status,
      marks,
      feedback
    `)
    .eq("assignment_id", assignment.id)
    .eq("student_id", user.id)
    .maybeSingle();

  const submissionStatus =
    submission?.status ?? "not_submitted";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <Link
          href="/student/assignments"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assignments
        </Link>

        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {module.title}
        </p>

        <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
          {assignment.title}
        </h2>

        {assignment.description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {assignment.description}
          </p>
        )}
      </div>

      {/* Assignment Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Clock3 className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Due Date
              </p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {formatDate(assignment.due_date)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <FileText className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Maximum Marks
              </p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {assignment.max_marks}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Submission
              </p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {formatStatus(submissionStatus)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      {assignment.instructions && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-base font-semibold text-foreground">
              Assignment Instructions
            </h3>

            <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {assignment.instructions}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-base font-semibold text-foreground">
            Your Submission
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Submit your answer below. You can update your submission
            until it has been graded.
          </p>

          <SubmissionForm
            assignmentId={assignment.id}
            existingText={submission?.submission_text ?? null}
            existingStatus={submission?.status ?? null}
          />

          {/* Grading Information */}
          {submission && (
            <div className="mt-6 space-y-4 border-t pt-5">
              {submission.submitted_at && (
                <p className="text-xs text-muted-foreground">
                  Submitted on{" "}
                  {formatDate(submission.submitted_at)}
                </p>
              )}

              {submission.marks !== null &&
                submission.marks !== undefined && (
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">
                      Marks
                    </p>

                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {submission.marks} / {assignment.max_marks}
                    </p>
                  </div>
                )}

              {submission.feedback && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-medium text-foreground">
                    Instructor Feedback
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {submission.feedback}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}