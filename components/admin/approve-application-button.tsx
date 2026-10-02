"use client";

import * as React from "react";
import { Check, Copy, Loader2, MessageCircle } from "lucide-react";

import {
  approveApplication,
  type ApproveApplicationResult,
} from "@/app/admin/(portal)/applications/actions";

interface ApproveApplicationButtonProps {
  applicationId: string;
}

export function ApproveApplicationButton({
  applicationId,
}: ApproveApplicationButtonProps) {
  const [loading, setLoading] =
    React.useState(false);

  const [result, setResult] =
    React.useState<ApproveApplicationResult | null>(
      null
    );

  const [copied, setCopied] =
    React.useState(false);

  async function handleApprove() {
    const confirmed = window.confirm(
      "Are you sure you want to approve this application and create the student account?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const formData = new FormData();

      formData.append("id", applicationId);

      const response =
        await approveApplication(formData);

      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result?.credentials) {
      return;
    }

    const credentialsText = `Techlance Academy Student Login

Name: ${result.credentials.name}
Email: ${result.credentials.email}
Temporary Password: ${result.credentials.password}

Student Login:
https://techlanceacademy.site/student/login`;

    try {
      await navigator.clipboard.writeText(
        credentialsText
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      setCopied(false);
    }
  }

  function handleWhatsApp() {
    if (!result?.credentials) {
      return;
    }

    const message = `Assalam-o-Alaikum ${result.credentials.name},

Congratulations! Your admission at Techlance Academy has been approved.

Your student portal login details are:

Email: ${result.credentials.email}
Temporary Password: ${result.credentials.password}

Student Login:
https://techlanceacademy.site/student/login

Please keep these credentials safe.

Regards,
Techlance Academy`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      message
    )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /*
   * ----------------------------------------------------
   * SUCCESS + CREDENTIALS
   * ----------------------------------------------------
   */

  if (
    result?.success &&
    result.credentials
  ) {
    return (
      <div className="w-[360px] rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">
              Student Account Created
            </p>

            <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80">
              Application approved successfully.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3 rounded-lg border border-emerald-200 bg-background p-3 dark:border-emerald-900/50">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Student
            </p>

            <p className="mt-1 text-sm font-medium text-foreground">
              {result.credentials.name}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Email
            </p>

            <p className="mt-1 break-all text-sm text-foreground">
              {result.credentials.email}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Temporary Password
            </p>

            <p className="mt-1 break-all rounded-md bg-muted px-3 py-2 font-mono text-sm font-semibold text-foreground">
              {result.credentials.password}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Student Login
            </p>

            <p className="mt-1 break-all text-xs text-primary">
              https://techlanceacademy.site/student/login
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Credentials
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          ⚠️ This temporary password is shown only once.
          It is not stored in the database.
        </p>
      </div>
    );
  }

  /*
   * ----------------------------------------------------
   * SUCCESS BUT ACCOUNT ALREADY EXISTED
   * ----------------------------------------------------
   */

  if (result?.success) {
    return (
      <div className="w-[320px] rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex items-start gap-2">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

          <div>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Admission Approved
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {result.message}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              The student can use the{" "}
              <strong>Forgot password</strong> option
              if needed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ----------------------------------------------------
   * ERROR
   * ----------------------------------------------------
   */

  if (result?.error) {
    return (
      <div className="flex max-w-[300px] flex-col gap-2">
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {result.error}
        </div>

        <button
          type="button"
          onClick={() => {
            setResult(null);
          }}
          className="text-left text-xs font-medium text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  /*
   * ----------------------------------------------------
   * APPROVE BUTTON
   * ----------------------------------------------------
   */

  return (
    <button
      type="button"
      onClick={handleApprove}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}

      {loading
        ? "Creating Account..."
        : "Approve"}
    </button>
  );
}