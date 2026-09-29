"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Send,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { startTest, submitTest } from "./actions";

type Question = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  marks: number;
  question_order: number;
};

type ExistingAttempt = {
  id: string;
  startedAt: string;
};

type TestPlayerProps = {
  testId: string;
  title: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questions: Question[];
  existingAttempt: ExistingAttempt | null;
};

type Result = {
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
};

export function TestPlayer({
  testId,
  title,
  durationMinutes,
  totalMarks,
  passingMarks,
  questions,
  existingAttempt,
}: TestPlayerProps) {
  const [attemptId, setAttemptId] = useState<string | null>(
    existingAttempt?.id ?? null
  );

  const [startedAt, setStartedAt] = useState<string | null>(
    existingAttempt?.startedAt ?? null
  );

  const [answers, setAnswers] = useState<
    Record<string, string>
  >({});

  const [currentIndex, setCurrentIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(
    durationMinutes * 60
  );

  const [result, setResult] = useState<Result | null>(null);

  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();

  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  /*
   * Start test automatically when there is no existing attempt.
   */
  useEffect(() => {
    if (attemptId || result) return;

    startTransition(async () => {
      const response = await startTest(testId);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.success && response.attemptId) {
        setAttemptId(response.attemptId);

        setStartedAt(new Date().toISOString());
      }
    });
  }, [attemptId, result, testId]);

  /*
   * Calculate remaining time.
   */
  useEffect(() => {
    if (!attemptId || !startedAt || result) return;

    const calculateTime = () => {
      const started = new Date(startedAt).getTime();

      const end =
        started + durationMinutes * 60 * 1000;

      const remaining = Math.max(
        Math.ceil((end - Date.now()) / 1000),
        0
      );

      setTimeLeft(remaining);

      if (remaining === 0) {
        handleSubmit(true);
      }
    };

    calculateTime();

    const interval = setInterval(
      calculateTime,
      1000
    );

    return () => clearInterval(interval);
  }, [
    attemptId,
    startedAt,
    durationMinutes,
    result,
  ]);

  function selectAnswer(answer: string) {
    if (!currentQuestion || isPending) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: answer,
    }));
  }

  function handlePrevious() {
    if (currentIndex === 0) return;

    setCurrentIndex((index) => index - 1);
  }

  function handleNext() {
    if (currentIndex >= questions.length - 1) return;

    setCurrentIndex((index) => index + 1);
  }

  function handleSubmit(autoSubmit = false) {
    if (!attemptId || isPending || result) return;

    setError("");

    if (!autoSubmit) {
      const confirmed = window.confirm(
        `Submit your test?\n\nYou have answered ${answeredCount} of ${questions.length} questions.`
      );

      if (!confirmed) return;
    }

    startTransition(async () => {
      const response = await submitTest(
        attemptId,
        Object.entries(answers).map(
          ([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer,
          })
        )
      );

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.success) {
        setResult({
          marksObtained: response.marksObtained ?? 0,
          totalMarks: response.totalMarks ?? totalMarks,
          percentage: response.percentage ?? 0,
          passed: response.passed ?? false,
        });
      }
    });
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  /*
   * Result Screen
   */
  if (result) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-foreground">
              Test Submitted
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Your test has been evaluated automatically.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">
                  Marks
                </p>

                <p className="mt-1 text-xl font-semibold text-foreground">
                  {result.marksObtained} /{" "}
                  {result.totalMarks}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">
                  Percentage
                </p>

                <p className="mt-1 text-xl font-semibold text-foreground">
                  {result.percentage}%
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">
                  Result
                </p>

                <p
                  className={`mt-1 text-xl font-semibold ${
                    result.passed
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {result.passed ? "Passed" : "Failed"}
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Passing marks: {passingMarks} /{" "}
              {result.totalMarks}
            </p>

            <a
              href="/student/tests"
              className="mt-6 inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Back to Tests
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  /*
   * Loading / Starting
   */
  if (!attemptId) {
    return (
      <Card>
        <CardContent className="py-14 text-center">
          {error ? (
            <>
              <p className="text-sm font-medium text-destructive">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-muted-foreground" />

              <p className="mt-4 text-sm font-medium text-foreground">
                Starting test...
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please wait while your test is being prepared.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  /*
   * Test Player
   */
  return (
    <div className="flex flex-col gap-5">
      {/* Top Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Question {currentIndex + 1} of{" "}
                {questions.length}
              </p>

              <h3 className="mt-1 text-sm font-semibold text-foreground">
                {title}
              </h3>
            </div>

            <div
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold ${
                timeLeft <= 60
                  ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                  : "text-foreground"
              }`}
            >
              <Clock3 className="h-4 w-4" />

              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {answeredCount} of {questions.length} answered
              </span>

              <span>
                {Math.round(
                  (answeredCount / questions.length) * 100
                )}
                %
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${
                    (answeredCount / questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Question */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Question {currentIndex + 1}
              </p>

              <h3 className="mt-2 text-lg font-semibold leading-7 text-foreground">
                {currentQuestion.question}
              </h3>
            </div>

            <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {currentQuestion.marks}{" "}
              {currentQuestion.marks === 1
                ? "Mark"
                : "Marks"}
            </span>
          </div>

          {/* Options */}
          <div className="mt-6 grid gap-3">
            {(
              [
                ["a", currentQuestion.option_a],
                ["b", currentQuestion.option_b],
                ["c", currentQuestion.option_c],
                ["d", currentQuestion.option_d],
              ] as const
            ).map(([key, label]) => {
              const selected =
                answers[currentQuestion.id] === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectAnswer(key)}
                  disabled={isPending}
                  className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                    selected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {key.toUpperCase()}
                  </span>

                  <span className="pt-1 text-sm leading-6 text-foreground">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Test
                </>
              )}
            </button>
          )}
        </CardContent>
      </Card>

      {/* Question Navigator */}
      <Card>
        <CardContent className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Questions
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {questions.map((question, index) => {
              const answered =
                answers[question.id] !== undefined;

              const active = index === currentIndex;

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : answered
                        ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                        : "hover:bg-muted"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}