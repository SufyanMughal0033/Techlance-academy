"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/student/login");
      return;
    }

    const { error: updateError } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(
      "Your password has been changed successfully."
    );

    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);

    setTimeout(() => {
      router.replace("/student/dashboard");
      router.refresh();
    }, 1200);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="h-6 w-6" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Change Password
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create a new password for your Techlance
              Academy student account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium"
              >
                New Password
              </label>

              <div className="relative">
                <input
                  id="new-password"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="Enter new password"
                  minLength={8}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-lg border bg-background px-3 py-2.5 pr-11 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={
                    showNewPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground">
                Minimum 8 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium"
              >
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  minLength={8}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-lg border bg-background px-3 py-2.5 pr-11 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {success}
              </div>
            )}

            {/* Update Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading
                ? "Updating Password..."
                : "Update Password"}
            </button>

            {/* Back */}
            <button
              type="button"
              onClick={() =>
                router.push("/student/dashboard")
              }
              className="w-full text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to Dashboard
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
