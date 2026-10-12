
import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Assignments",
};

function formatDate(date: string | null) {
  if (!date) return "No due date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
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

type ModuleRecord = {
  id: string;
  title: string;
  program_id: string;
};

type AssignmentRecord = {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  due_date: string | null;
  max_marks: number;
  assignment_order: number;
  status: string;
  module_id: string;
  attachment_url: string | null;
};

type SubmissionRecord = {
  assignment_id: string;
  status: string;
  marks: number | null;
  feedback: string | null;
  submitted_at: string | null;
};

export default async function Page() {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  // 1. Get the student's active enrollments.
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("program_id")
    .eq("student_id", user.id)
    .eq("status", "active");

  if (enrollmentError) {
    console.error("Student Assignments - Enrollment Error:", {
      message: enrollmentError.message,
      code: enrollmentError.code,
    });

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Assignments
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            View assignments, download resources, submit your work, and
            check your results.
          </p>
        </div>

        <Card>
          <CardContent className="py-14 text-center text-sm text-destructive">
            Unable to load your enrolled programs. Please try again later.
          </CardContent>
        </Card>
      </div>
    );
  }

  const programIds = (enrollments ?? [])
    .map((enrollment) => enrollment.program_id)
    .filter((id): id is string => Boolean(id));

  // 2. Get active modules belonging to the enrolled programs.
  let modules: ModuleRecord[] = [];

  if (programIds.length > 0) {
    const { data: moduleData, error: moduleError } = await supabase
      .from("modules")
      .select("id, title, program_id")
      .in("program_id", programIds)
      .eq("status", "active")
      .order("module_order", { ascending: true });

    if (moduleError) {
      console.error("Student Assignments - Module Error:", {
        message: moduleError.message,
        code: moduleError.code,
      });
    } else {
      modules = (moduleData ?? []) as ModuleRecord[];
    }
  }

  const moduleIds = modules.map((module) => module.id);

  const moduleMap = new Map(
    modules.map((module) => [module.id, module])
  );

  // 3. Get published assignments and their attachment URLs.
  let assignments: AssignmentRecord[] = [];

  if (moduleIds.length > 0) {
    const { data: assignmentData, error: assignmentError } =
      await supabase
        .from("assignments")
        .select(
          `
            id,
            title,
            description,
            instructions,
            due_date,
            max_marks,
            assignment_order,
            status,
            module_id,
            attachment_url
          `
        )
        .in("module_id", moduleIds)
        .eq("status", "published")
        .order("due_date", {
          ascending: true,
          nullsFirst: false,
        })
        .order("assignment_order", {
          ascending: true,
        });

    if (assignmentError) {
      console.error("Student Assignments - Assignment Error:", {
        message: assignmentError.message,
        code: assignmentError.code,
      });
    } else {
      assignments = (assignmentData ?? []) as AssignmentRecord[];
    }
  }

  // 4. Get the student's submissions for these assignments.
  const assignmentIds = assignments.map(
    (assignment) => assignment.id
  );

  let submissions: SubmissionRecord[] = [];

  if (assignmentIds.length > 0) {
    const { data: submissionData, error: submissionError } =
      await supabase
        .from("student_submissions")
        .select("assignment_id, status, marks, feedback, submitted_at")
        .eq("student_id", user.id)
        .in("assignment_id", assignmentIds);

    if (submissionError) {
      console.error("Student Assignments - Submission Error:", {
        message: submissionError.message,
        code: submissionError.code,
      });
    } else {
      submissions = (submissionData ?? []) as SubmissionRecord[];
    }
  }

  const submissionMap = new Map(
    submissions.map((submission) => [
      submission.assignment_id,
      submission,
    ])
  );

  // 5. Render the assignments.
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Assignments
        </h2>

        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          View your assignments, download instructor resources, submit
          your work, and check your marks and feedback.
        </p>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>

            <p className="mt-4 text-sm font-semibold text-foreground">
              No assignments available
            </p>

            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              No published assignments were found for your active
              enrolled programs. Please check again later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => {
            const submission = submissionMap.get(assignment.id);

            const submissionStatus =
              submission?.status ?? "not_submitted";

            const module = moduleMap.get(assignment.module_id);

            return (
              <Card key={assignment.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4">
                    {/* Assignment header */}
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {module?.title ?? "Module"}
                        </p>

                        <h3 className="mt-1 text-base font-semibold text-foreground">
                          {assignment.title}
                        </h3>

                        {assignment.description && (
                          <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {assignment.description}
                          </p>
                        )}
                      </div>

                      <span
                        className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          submissionStatus
                        )}`}
                      >
                        {getStatusLabel(submissionStatus)}
                      </span>
                    </div>

                    {/* Assignment information */}
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

                    {/* Assignment instructions */}
                    {assignment.instructions && (
                      <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <p className="text-sm font-semibold text-foreground">
                          Instructions
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                          {assignment.instructions}
                        </p>
                      </div>
                    )}

                    {/* Assignment attachment */}
                    {assignment.attachment_url && (
                      <div className="rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground">
                              Assignment Resource
                            </p>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              Your instructor has attached a resource
                              for this assignment.
                            </p>
                          </div>

                          <a
                            href={assignment.attachment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                          >
                            <Download className="h-4 w-4" />
                            Download File
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Instructor feedback */}
                    {submission?.feedback && (
                      <div className="rounded-xl border border-border p-4">
                        <p className="text-sm font-semibold text-foreground">
                          Instructor Feedback
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                          {submission.feedback}
                        </p>
                      </div>
                    )}

                    {/* Submission date */}
                    {submission?.submitted_at && (
                      <p className="text-xs text-muted-foreground">
                        Submitted: {formatDate(submission.submitted_at)}
                      </p>
                    )}

                    {/* View assignment */}
                    <div className="flex justify-end border-t pt-4">
                      <Link
                        href={`/student/assignments/${assignment.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
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
