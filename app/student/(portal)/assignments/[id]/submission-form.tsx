"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Send } from "lucide-react";

import { submitAssignment } from "./actions";

type SubmissionFormProps = {
  assignmentId: string;
  existingText: string | null;
  existingStatus: string | null;
};

export function SubmissionForm({
  assignmentId,
  existingText,
  existingStatus,
}: SubmissionFormProps) {
  const [text, setText] = useState(existingText ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const isGraded = existingStatus === "graded";

  function handleSubmit() {
    setMessage("");
    setError("");

    startTransition(async () => {
      const result = await submitAssignment(
        assignmentId,
        text
      );

      if (result.error) {
        setError(result.error);
        return;
      }

      setMessage(
        result.message ?? "Assignment submitted successfully."
      );
    });
  }

  if (isGraded) {
    return (
      <div className="mt-5 rounded-lg border bg-muted/40 p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />

          <p className="text-sm font-medium text-foreground">
            This assignment has been graded.
          </p>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Your submitted answer can no longer be changed.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-4">
      <div>
        <label
          htmlFor="submission"
          className="text-sm font-medium text-foreground"
        >
          Your Answer
        </label>

        <textarea
          id="submission"
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={isPending}
          placeholder="Write your assignment answer here..."
          rows={10}
          className="mt-2 w-full resize-y rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {message && (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || text.trim().length < 10}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-4 w-4" />

        {isPending ? "Submitting..." : "Submit Assignment"}
      </button>
    </div>
  );
}