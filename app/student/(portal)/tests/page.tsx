import Link from "next/link";
import { ArrowRight, Clock3, FileQuestion } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Tests",
};

export default async function Page() {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  // Get student's active enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("program_id")
    .eq("student_id", user.id)
    .eq("status", "active");

  const programIds = (enrollments ?? []).map(
    (enrollment) => enrollment.program_id
  );

  let tests: Array<{
    id: string;
    title: string;
    description: string | null;
    duration_minutes: number;
    total_marks: number;
    passing_marks: number;
    attempt_limit: number;
    status: string;
    module: {
      id: string;
      title: string;
      program_id: string;
    } | null;
  }> = [];

  if (programIds.length > 0) {
    const { data, error } = await supabase
      .from("tests")
      .select(`
        id,
        title,
        description,
        duration_minutes,
        total_marks,
        passing_marks,
        attempt_limit,
        status,
        module:modules (
          id,
          title,
          program_id
        )
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (!error && data) {
      tests = (data as typeof tests).filter((test) => {
        return (
          test.module &&
          programIds.includes(test.module.program_id)
        );
      });
    }
  }

  // Get student's previous attempts
  const testIds = tests.map((test) => test.id);

  let attempts: Array<{
    id: string;
    test_id: string;
    marks_obtained: number | null;
    total_marks: number | null;
    percentage: number | null;
    status: string;
    submitted_at: string | null;
  }> = [];

  if (testIds.length > 0) {
    const { data } = await supabase
      .from("test_attempts")
      .select(`
        id,
        test_id,
        marks_obtained,
        total_marks,
        percentage,
        status,
        submitted_at
      `)
      .eq("student_id", user.id)
      .in("test_id", testIds)
      .order("created_at", { ascending: false });

    attempts = data ?? [];
  }

  const attemptsMap = new Map<string, typeof attempts>();

  for (const attempt of attempts) {
    const existing = attemptsMap.get(attempt.test_id) ?? [];
    existing.push(attempt);
    attemptsMap.set(attempt.test_id, existing);
  }

  function getLatestAttempt(testId: string) {
    return attemptsMap.get(testId)?.[0] ?? null;
  }

  function getAttemptCount(testId: string) {
    return attemptsMap.get(testId)?.length ?? 0;
  }

  function getStatusLabel(status: string | null) {
    if (!status) return "Not Attempted";

    switch (status) {
      case "passed":
        return "Passed";
      case "failed":
        return "Failed";
      case "submitted":
        return "Submitted";
      case "in_progress":
        return "In Progress";
      default:
        return "Not Attempted";
    }
  }

  function getStatusClass(status: string | null) {
    switch (status) {
      case "passed":
        return "bg-green-500/10 text-green-600 dark:text-green-400";

      case "failed":
        return "bg-red-500/10 text-red-600 dark:text-red-400";

      case "submitted":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";

      case "in_progress":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";

      default:
        return "bg-muted text-muted-foreground";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Tests & Quizzes
        </h2>

        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Take tests, complete quizzes, and view your previous results.
        </p>
      </div>

      {/* Empty State */}
      {tests.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <FileQuestion className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-4 text-sm font-medium text-foreground">
              No tests available
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your instructor has not published any tests for your
              enrolled program yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tests.map((test) => {
            const latestAttempt = getLatestAttempt(test.id);
            const attemptCount = getAttemptCount(test.id);

            const attemptsRemaining = Math.max(
              test.attempt_limit - attemptCount,
              0
            );

            return (
              <Card key={test.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-5">
                    {/* Header */}
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {test.module?.title ?? "Module"}
                        </p>

                        <h3 className="mt-1 text-base font-semibold text-foreground">
                          {test.title}
                        </h3>

                        {test.description && (
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            {test.description}
                          </p>
                        )}
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          latestAttempt?.status ?? null
                        )}`}
                      >
                        {getStatusLabel(
                          latestAttempt?.status ?? null
                        )}
                      </span>
                    </div>

                    {/* Test Information */}
                    <div className="grid gap-4 border-t pt-4 sm:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-muted-foreground" />

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Duration
                          </p>

                          <p className="mt-1 text-sm font-medium text-foreground">
                            {test.duration_minutes} minutes
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Total Marks
                        </p>

                        <p className="mt-1 text-sm font-medium text-foreground">
                          {test.total_marks}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Passing Marks
                        </p>

                        <p className="mt-1 text-sm font-medium text-foreground">
                          {test.passing_marks}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Attempts
                        </p>

                        <p className="mt-1 text-sm font-medium text-foreground">
                          {attemptCount} / {test.attempt_limit}
                        </p>
                      </div>
                    </div>

                    {/* Latest Result */}
                    {latestAttempt &&
                      latestAttempt.status !== "in_progress" && (
                        <div className="rounded-lg bg-muted/50 p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Latest Result
                              </p>

                              <p className="mt-1 text-sm font-semibold text-foreground">
                                {latestAttempt.marks_obtained ?? 0} /{" "}
                                {latestAttempt.total_marks ??
                                  test.total_marks}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground">
                                Percentage
                              </p>

                              <p className="mt-1 text-sm font-semibold text-foreground">
                                {latestAttempt.percentage !== null
                                  ? `${latestAttempt.percentage}%`
                                  : "Not available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Action */}
                    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        {attemptsRemaining > 0
                          ? `${attemptsRemaining} attempt${
                              attemptsRemaining === 1 ? "" : "s"
                            } remaining`
                          : "No attempts remaining"}
                      </p>

                      {attemptsRemaining > 0 ? (
                        <Link
                          href={`/student/tests/${test.id}`}
                          className="inline-flex w-fit items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          Start Test
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="inline-flex w-fit cursor-not-allowed items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground opacity-60">
                          Attempts Completed
                        </span>
                      )}
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