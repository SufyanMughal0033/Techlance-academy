import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { TestPlayer } from "./test-player";

export const metadata = {
  title: "Take Test",
};

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { user } = await requireRole("student");
  const supabase = await createClient();

  const { data: test } = await supabase
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
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (!test) {
    notFound();
  }

  const moduleData = test.module;

  const module = Array.isArray(moduleData)
    ? moduleData[0]
    : moduleData;

  if (!module) {
    notFound();
  }

  // Verify enrollment
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

  // Check existing unfinished attempt
  const { data: existingAttempt } = await supabase
    .from("test_attempts")
    .select("id, started_at, status")
    .eq("test_id", test.id)
    .eq("student_id", user.id)
    .eq("status", "in_progress")
    .maybeSingle();

  // Get questions
  const { data: questions } = await supabase
    .from("test_questions")
    .select(`
      id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      marks,
      question_order
    `)
    .eq("test_id", test.id)
    .order("question_order", { ascending: true });

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <Link
          href="/student/tests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tests
        </Link>

        <Card>
          <CardContent className="py-14 text-center">
            <p className="text-sm font-medium text-foreground">
              No questions available
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              This test does not have any questions yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/student/tests"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tests
        </Link>

        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {module.title}
        </p>

        <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
          {test.title}
        </h2>

        {test.description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {test.description}
          </p>
        )}
      </div>

      <TestPlayer
        testId={test.id}
        title={test.title}
        durationMinutes={test.duration_minutes}
        totalMarks={test.total_marks}
        passingMarks={test.passing_marks}
        questions={questions}
        existingAttempt={
          existingAttempt
            ? {
                id: existingAttempt.id,
                startedAt: existingAttempt.started_at,
              }
            : null
        }
      />
    </div>
  );
}