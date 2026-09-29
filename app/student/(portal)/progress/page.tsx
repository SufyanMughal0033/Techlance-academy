import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  PlayCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Progress",
  description: "Track your learning progress and course completion.",
};

type ModuleRecord = {
  id: string;
  title: string;
  description: string | null;
  module_order: number;
};

type EnrollmentRecord = {
  id: string;
  program_id: string;
  enrolled_at: string;
  programs:
    | {
        id: string;
        title: string;
        slug: string;
      }
    | {
        id: string;
        title: string;
        slug: string;
      }[]
    | null;
};

export default async function ProgressPage() {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      program_id,
      enrolled_at,
      programs (
        id,
        title,
        slug
      )
    `)
    .eq("student_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false });

  const activeEnrollments =
    (enrollments ?? []) as unknown as EnrollmentRecord[];

  const programIds = activeEnrollments.map(
    (enrollment) => enrollment.program_id
  );

  let modules: ModuleRecord[] = [];

  if (programIds.length > 0) {
    const { data: moduleData } = await supabase
      .from("modules")
      .select("id, title, description, module_order")
      .in("program_id", programIds)
      .eq("status", "active")
      .order("module_order", { ascending: true });

    modules = moduleData ?? [];
  }

  const moduleIds = modules.map((module) => module.id);

  let classes: {
    id: string;
    module_id: string;
    status: string;
  }[] = [];

  let assignments: {
    id: string;
    module_id: string;
    status: string;
  }[] = [];

  let tests: {
    id: string;
    module_id: string;
    title: string;
  }[] = [];

  if (moduleIds.length > 0) {
    const [classesResponse, assignmentsResponse, testsResponse] =
      await Promise.all([
        supabase
          .from("classes")
          .select("id, module_id, status")
          .in("module_id", moduleIds),

        supabase
          .from("assignments")
          .select("id, module_id, status")
          .in("module_id", moduleIds)
          .eq("status", "published"),

        supabase
          .from("tests")
          .select("id, module_id, title")
          .in("module_id", moduleIds)
          .eq("status", "published"),
      ]);

    classes = classesResponse.data ?? [];
    assignments = assignmentsResponse.data ?? [];
    tests = testsResponse.data ?? [];
  }

  const assignmentIds = assignments.map(
    (assignment) => assignment.id
  );

  const testIds = tests.map((test) => test.id);

  let submissions: {
    assignment_id: string;
    status: string;
    marks: number | null;
  }[] = [];

  let attempts: {
    test_id: string;
    status: string;
    percentage: number | null;
  }[] = [];

  if (assignmentIds.length > 0) {
    const { data } = await supabase
      .from("student_submissions")
      .select("assignment_id, status, marks")
      .eq("student_id", user.id)
      .in("assignment_id", assignmentIds);

    submissions = data ?? [];
  }

  if (testIds.length > 0) {
    const { data } = await supabase
      .from("test_attempts")
      .select("test_id, status, percentage")
      .eq("student_id", user.id)
      .in("test_id", testIds)
      .order("created_at", { ascending: false });

    attempts = data ?? [];
  }

  const completedClasses = classes.filter(
    (classItem) => classItem.status === "completed"
  ).length;

  const submittedAssignments = submissions.filter(
    (submission) =>
      submission.status === "submitted" ||
      submission.status === "graded"
  ).length;

  const completedTests = attempts.filter(
    (attempt) =>
      attempt.status === "passed" ||
      attempt.status === "failed"
  ).length;

  const passedTests = attempts.filter(
    (attempt) => attempt.status === "passed"
  ).length;

  const overallItems =
    classes.length + assignments.length + tests.length;

  const completedItems =
    completedClasses +
    submittedAssignments +
    completedTests;

  const overallProgress =
    overallItems > 0
      ? Math.round((completedItems / overallItems) * 100)
      : 0;

  function getProgramTitle(enrollment: EnrollmentRecord) {
    if (!enrollment.programs) return "Program";

    const program = Array.isArray(enrollment.programs)
      ? enrollment.programs[0]
      : enrollment.programs;

    return program?.title ?? "Program";
  }

  function getModuleStats(moduleId: string) {
    const moduleClasses = classes.filter(
      (item) => item.module_id === moduleId
    );

    const moduleAssignments = assignments.filter(
      (item) => item.module_id === moduleId
    );

    const moduleTests = tests.filter(
      (item) => item.module_id === moduleId
    );

    const completedModuleClasses = moduleClasses.filter(
      (item) => item.status === "completed"
    ).length;

    const completedModuleAssignments = moduleAssignments.filter(
      (assignment) =>
        submissions.some(
          (submission) =>
            submission.assignment_id === assignment.id &&
            (submission.status === "submitted" ||
              submission.status === "graded")
        )
    ).length;

    const completedModuleTests = moduleTests.filter(
      (test) =>
        attempts.some(
          (attempt) =>
            attempt.test_id === test.id &&
            (attempt.status === "passed" ||
              attempt.status === "failed")
        )
    ).length;

    const total =
      moduleClasses.length +
      moduleAssignments.length +
      moduleTests.length;

    const completed =
      completedModuleClasses +
      completedModuleAssignments +
      completedModuleTests;

    const percentage =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      classes: moduleClasses.length,
      assignments: moduleAssignments.length,
      tests: moduleTests.length,
      completed,
      total,
      percentage,
    };
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Student Portal
        </p>

        <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
          My Progress
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Track your learning activity, completed work, tests, and
          course progress.
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Overall Learning Progress
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Based on classes, assignments, and tests.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-3xl font-semibold text-foreground">
                {overallProgress}%
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {completedItems} of {overallItems} activities
              </p>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${overallProgress}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Classes Completed
                </p>

                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {completedClasses}
                </p>
              </div>

              <PlayCircle className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Assignments Done
                </p>

                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {submittedAssignments}
                </p>
              </div>

              <ClipboardCheck className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Tests Completed
                </p>

                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {completedTests}
                </p>
              </div>

              <BookOpen className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Tests Passed
                </p>

                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {passedTests}
                </p>
              </div>

              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Program Progress
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Your progress across enrolled programs.
          </p>
        </div>

        {activeEnrollments.length === 0 ? (
          <Card>
            <CardContent className="py-14 text-center">
              <GraduationCap className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-4 text-sm font-medium text-foreground">
                No active programs
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your program progress will appear here after enrollment.
              </p>
            </CardContent>
          </Card>
        ) : (
          activeEnrollments.map((enrollment) => {
            const programModules = modules.filter(
              (module) =>
                moduleIds.includes(module.id)
            );

            const programStats = programModules.reduce(
              (total, module) => {
                const stats = getModuleStats(module.id);

                return {
                  total: total.total + stats.total,
                  completed: total.completed + stats.completed,
                };
              },
              { total: 0, completed: 0 }
            );

            const programProgress =
              programStats.total > 0
                ? Math.round(
                    (programStats.completed /
                      programStats.total) *
                      100
                  )
                : 0;

            return (
              <Card key={enrollment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Enrolled Program
                      </p>

                      <h4 className="mt-1 text-lg font-semibold text-foreground">
                        {getProgramTitle(enrollment)}
                      </h4>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-semibold text-foreground">
                        {programProgress}%
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {programStats.completed} /{" "}
                        {programStats.total} completed
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${programProgress}%`,
                      }}
                    />
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <p className="text-xs text-muted-foreground">
                        Modules
                      </p>

                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {programModules.length}
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <p className="text-xs text-muted-foreground">
                        Activities
                      </p>

                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {programStats.total}
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <p className="text-xs text-muted-foreground">
                        Completed
                      </p>

                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {programStats.completed}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Modules */}
      {modules.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="border-b p-5">
              <h3 className="text-base font-semibold text-foreground">
                Module Progress
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Activity completion by module.
              </p>
            </div>

            <div className="divide-y">
              {modules.map((module) => {
                const stats = getModuleStats(module.id);

                return (
                  <div key={module.id} className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-foreground">
                              {module.title}
                            </h4>

                            {module.description && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {module.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-sm font-semibold text-foreground">
                        {stats.percentage}%
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${stats.percentage}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                      <span>
                        Classes: {stats.classes}
                      </span>

                      <span>
                        Assignments: {stats.assignments}
                      </span>

                      <span>
                        Tests: {stats.tests}
                      </span>

                      <span>
                        Completed: {stats.completed}/{stats.total}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty activity notice */}
      {overallItems === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Clock3 className="h-8 w-8 text-muted-foreground" />

            <p className="mt-4 text-sm font-medium text-foreground">
              Progress data is being prepared
            </p>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Your progress will automatically update as classes,
              assignments, and tests are completed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}