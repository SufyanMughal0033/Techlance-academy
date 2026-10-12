
"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, ExternalLink, FileText, Send } from "lucide-react";
import {
  getMySubmissionPdfUrl,
  submitAssignment,
} from "./actions";

type SubmissionFormProps = {
  assignmentId: string;
  existingText: string | null;
  existingStatus: string | null;
  existingUrl: string | null;
  hasExistingPdf: boolean;
};

const MAX_PDF_SIZE = 10 * 1024 * 1024;

export function SubmissionForm({
  assignmentId,
  existingText,
  existingStatus,
  existingUrl,
  hasExistingPdf,
}: SubmissionFormProps) {
  const [text, setText] = useState(existingText ?? "");
  const [url, setUrl] = useState(existingUrl ?? "");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isOpeningPdf, setIsOpeningPdf] = useState(false);

  const isGraded = existingStatus === "graded";

  function handleSubmit() {
    setMessage("");
    setError("");

    if (!text.trim() && !url.trim() && !pdfFile) {
      setError("Please provide an answer, a URL, or a PDF file.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitAssignment(
          assignmentId,
          text,
          url,
          pdfFile
        );

        if (result.error) {
          setError(result.error);
          return;
        }

        setMessage(
          result.message ?? "Assignment submitted successfully."
        );

        // Refresh server-rendered submission details.
        window.location.reload();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  async function handleOpenPdf() {
    setError("");
    setIsOpeningPdf(true);

    try {
      const result = await getMySubmissionPdfUrl(assignmentId);

      if (result.error || !result.url) {
        setError(result.error ?? "Unable to open the submitted PDF.");
        return;
      }

      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Unable to open the submitted PDF.");
    } finally {
      setIsOpeningPdf(false);
    }
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
    <div className="mt-5 space-y-5">
      {/* Written answer */}
      <div>
        <label
          htmlFor="submission"
          className="text-sm font-medium text-foreground"
        >
          Your Answer
        </label>

        <p className="mt-1 text-xs text-muted-foreground">
          Optional if you submit a URL or PDF. If writing an answer,
          enter at least 10 characters.
        </p>

        <textarea
          id="submission"
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={isPending}
          placeholder="Write your assignment answer here..."
          rows={8}
          className="mt-2 w-full resize-y rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* URL */}
      <div>
        <label
          htmlFor="submission-url"
          className="text-sm font-medium text-foreground"
        >
          Project / Answer URL
        </label>

        <p className="mt-1 text-xs text-muted-foreground">
          Add a GitHub repository, live project, Google Drive link, or
          another HTTP/HTTPS link if applicable.
        </p>

        <input
          id="submission-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          disabled={isPending}
          placeholder="https://..."
          className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* PDF upload */}
      <div>
        <label
          htmlFor="submission-pdf"
          className="text-sm font-medium text-foreground"
        >
          Upload PDF
        </label>

        <p className="mt-1 text-xs text-muted-foreground">
          PDF only, maximum file size 10 MB.
        </p>

        <input
          id="submission-pdf"
          type="file"
          accept=".pdf,application/pdf"
          disabled={isPending}
          onChange={(event) => {
            setError("");
            const selectedFile = event.target.files?.[0] ?? null;

            if (!selectedFile) {
              setPdfFile(null);
              return;
            }

            if (
              selectedFile.type !== "application/pdf" &&
              !selectedFile.name.toLowerCase().endsWith(".pdf")
            ) {
              setError("Only PDF files are allowed.");
              event.target.value = "";
              setPdfFile(null);
              return;
            }

            if (selectedFile.size > MAX_PDF_SIZE) {
              setError("PDF size must be 10 MB or less.");
              event.target.value = "";
              setPdfFile(null);
              return;
            }

            setPdfFile(selectedFile);
          }}
          className="mt-2 block w-full rounded-lg border bg-background px-3 py-3 text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium"
        />

        {pdfFile && (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            {pdfFile.name}
          </p>
        )}

        {hasExistingPdf && !pdfFile && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted-foreground">
              A PDF has already been submitted.
            </p>

            <button
              type="button"
              onClick={handleOpenPdf}
              disabled={isOpeningPdf}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline disabled:opacity-60"
            >
              <ExternalLink className="h-4 w-4" />
              {isOpeningPdf ? "Opening..." : "Open submitted PDF"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={
          isPending ||
          (!text.trim() &&
            !url.trim() &&
            !pdfFile &&
            !hasExistingPdf)
        }
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {isPending ? "Submitting..." : "Submit Assignment"}
      </button>
    </div>
  );
}
