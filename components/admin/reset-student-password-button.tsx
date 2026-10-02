"use client";

import * as React from "react";
import {
  Check,
  Copy,
  KeyRound,
  Loader2,
  MessageCircle,
  RefreshCw,
} from "lucide-react";

import { resetStudentPassword } from "@/app/admin/(portal)/applications/actions";

type Props = {
  applicationId: string;
};

export function ResetStudentPasswordButton({
  applicationId,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{
    success: boolean;
    error?: string;
    credentials?: {
      name: string;
      email: string;
      password: string;
    };
  } | null>(null);

  const [copied, setCopied] = React.useState(false);

  async function handleGenerate() {
    const confirmed = window.confirm(
      "Generate a new temporary password for this student?\n\nThe student's current password will stop working."
    );

    if (!confirmed) return;

    setLoading(true);
    setResult(null);
    setCopied(false);

    const response = await resetStudentPassword(applicationId);

    setResult(response);
    setLoading(false);
  }

  async function handleCopy() {
    if (!result?.credentials) return;

    const { name, email, password } = result.credentials;

    const text = `Techlance Academy Student Login

Name: ${name}
Email: ${email}
Temporary Password: ${password}

Student Login:
https://techlanceacademy.site/student/login`;

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function handleWhatsApp() {
    if (!result?.credentials) return;

    const { name, email, password } = result.credentials;

    const message = `Assalam o Alaikum ${name},

Your Techlance Academy student account has been activated.

Student Login:
https://techlanceacademy.site/student/login

Email: ${email}
Temporary Password: ${password}

Please login using these credentials and change your password after logging in.

Regards,
Techlance Academy`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }

  if (result?.success && result.credentials) {
    return (
      <div className="w-full max-w-sm rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-400">
          <Check className="h-4 w-4" />
          New Temporary Password Generated
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>{" "}
            <span className="font-medium">
              {result.credentials.name}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground">Email:</span>{" "}
            <span className="font-medium">
              {result.credentials.email}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground">
              Temporary Password:
            </span>

            <div className="mt-1 rounded-md bg-background px-3 py-2 font-mono text-sm">
              {result.credentials.password}
            </div>
          </div>

          <div className="pt-1">
            <span className="text-muted-foreground">
              Student Login:
            </span>

            <div className="mt-1 break-all text-xs text-primary">
              https://techlanceacademy.site/student/login
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
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
            className="inline-flex items-center gap-2 rounded-md border border-emerald-500/40 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          ⚠️ This temporary password is shown only once. It is not stored
          as plain text in the database.
        </p>
      </div>
    );
  }

  if (result && !result.success) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-red-400">
          {result.error || "Failed to generate password."}
        </p>

        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md border border-primary/40 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <KeyRound className="h-4 w-4" />
          Generate New Password
        </>
      )}
    </button>
  );
}