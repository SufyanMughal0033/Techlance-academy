import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Assignments" };

function formatDate(date: string | null) {
  if (!date) return "No due date";

  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getStatusLabel(status: string | undefined) {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "late":
      return "Late";
    case "graded":
      return "Graded";
    default:
      return "Not submitted";
  }
}

function getStatusClass(status: string | undefined) {
  switch (status) {
    case "submitted":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "late":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
    case "graded":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default async function Page() {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("program_id")
    .eq("student_id", user.id)
    .eq("status", "active");

  if (enrollmentError) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Assignments
          </h2>

          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Assignments due, submitted, and reviewed, with marks and feedback
            once graded.
          </p>
        </div>

        <Card>
          <CardContent className="py-14 text-center text-sm text-destructive">
            Unable to load your enrolled programs.
          </CardContent>
        </Card>
      </div>
    );
  }

  const programIds = (enrollments ?? []).map(
    (enrollment) => enrollment.program_id
  );

  let assignments: Array<{
    id: string;
    title: string;
    description: string | null;
    instructions: string | null;
    due_date: string | null;
    max_marks: number;
    assignment_order: number;
    status: string;
    module: {
      id: string;
      title: string;
      program_id: string;
    } | null;
  }> = [];

  if (programIds.length > 0) {
    const { data, error } = await supabase
      .from("assignments")
      .select(`
        id,
        title,
        description,
        instructions,
        due_date,
        max_marks,
        assignment_order,
        status,
        module:modules (
          id,
          title,
          program_id
        )
      `)
      .eq("status", "published")
      .in("modules.program_id", programIds)
      .order("due_date", { ascending: true });

    if (!error && data) {
      assignments = data as typeof assignments;
    }
  }

  const assignmentIds = assignments.map(
    (assignment) => assignment.id
  );

  let submissions: Array<{
    assignment_id: string;
    status: string;
    marks: number | null;
    feedback: string | null;
    submitted_at: string | null;
  }> = [];

  if (assignmentIds.length > 0) {
    const { data } = await supabase
      .from("student_submissions")
      .select(
        "assignment_id, status, marks, feedback, submitted_at"
      )
      .eq("student_id", user.id)
      .in("assignment_id", assignmentIds);

    submissions = data ?? [];
  }

  const submissionMap = new Map(
    submissions.map((submission) => [
      submission.assignment_id,
      submission,
    ])
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Assignments
        </h2>

        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Assignments due, submitted, and reviewed, with marks and feedback
          once graded.
        </p>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <p className="text-sm font-medium text-foreground">
              No assignments available
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your instructor has not published any assignments for your
              enrolled program yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => {
            const submission = submissionMap.get(assignment.id);

            const submissionStatus =
              submission?.status ?? "not_submitted";

            return (
              <Card key={assignment.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {assignment.module?.title ?? "Module"}
                        </p>

                        <h3 className="mt-1 text-base font-semibold text-foreground">
                          {assignment.title}
                        </h3>

                        {assignment.description && (
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            {assignment.description}
                          </p>
                        )}
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          submissionStatus
                        )}`}
                      >
                        {getStatusLabel(submissionStatus)}
                      </span>
                    </div>

                    {/* Assignment Information */}
                    <div className="grid gap-3 border-t pt-4 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Due date
                        </p>

                        <p className="mt-1 font-medium text-foreground">
                          {formatDate(assignment.due_date)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Maximum marks
                        </p>

                        <p className="mt-1 font-medium text-foreground">
                          {assignment.max_marks}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Result
                        </p>

                        <p className="mt-1 font-medium text-foreground">
                          {submission?.marks !== null &&
                          submission?.marks !== undefined
                            ? `${submission.marks} / ${assignment.max_marks}`
                            : "Not graded"}
                        </p>
                      </div>
                    </div>

                    {/* Instructions */}
                    {assignment.instructions && (
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs font-medium text-foreground">
                          Instructions
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                          {assignment.instructions}
                        </p>
                      </div>
                    )}

                    {/* Feedback */}
                    {submission?.feedback && (
                      <div className="rounded-lg border p-4">
                        <p className="text-xs font-medium text-foreground">
                          Instructor Feedback
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                          {submission.feedback}
                        </p>
                      </div>
                    )}

                    {/* Submitted Date */}
                    {submission?.submitted_at && (
                      <p className="text-xs text-muted-foreground">
                        Submitted: {formatDate(submission.submitted_at)}
                      </p>
                    )}

                    {/* View Assignment Button */}
                    <div className="flex justify-end border-t pt-4">
                      <Link
                        href={`/student/assignments/${assignment.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        View Assignment
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}