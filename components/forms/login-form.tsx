"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/schemas/auth";

interface LoginFormProps {
  action: (
    values: LoginInput
  ) => Promise<{ success?: boolean; error?: string }>;
  redirectTo: string;
}

export function LoginForm({
  action,
  redirectTo,
}: LoginFormProps) {
  const router = useRouter();

  const [serverError, setServerError] =
    React.useState<string | null>(null);

  const [resetMode, setResetMode] =
    React.useState(false);

  const [resetEmail, setResetEmail] =
    React.useState("");

  const [resetLoading, setResetLoading] =
    React.useState(false);

  const [resetMessage, setResetMessage] =
    React.useState<string | null>(null);

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: "",
    password: "",
  },
});
  async function onSubmit(values: LoginInput) {
    setServerError(null);

    const result = await action(values);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    router.replace(redirectTo);
    router.refresh();
  }

  async function handlePasswordReset(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setResetMessage(null);

    const email = resetEmail.trim().toLowerCase();

    if (!email) {
      setResetMessage(
        "Please enter your email address."
      );
      return;
    }

    setResetLoading(true);

    const supabase = createClient();

    const { error } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/student/set-password`,
      });

    setResetLoading(false);

    if (error) {
      setResetMessage(error.message);
      return;
    }

    setResetMessage(
      "Password reset email sent. Please check your inbox."
    );
  }

  if (resetMode) {
    return (
      <form
        onSubmit={handlePasswordReset}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reset-email">
            Email
          </Label>

          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={resetEmail}
            onChange={(event) =>
              setResetEmail(event.target.value)
            }
            required
          />
        </div>

        {resetMessage && (
          <p
            role="alert"
            className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary"
          >
            {resetMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={resetLoading}
        >
          {resetLoading && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {resetLoading
            ? "Sending..."
            : "Send Reset Email"}
        </Button>

        <button
          type="button"
          onClick={() => {
            setResetMode(false);
            setResetMessage(null);
          }}
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to Student Login
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />

        {errors.email && (
          <p className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">
            Password
          </Label>

          <button
            type="button"
            onClick={() => {
              setResetMode(true);
              setResetEmail("");
              setResetMessage(null);
              setServerError(null);
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password")}
        />

        {errors.password && (
          <p className="text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2"
      >
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {isSubmitting
          ? "Signing in…"
          : "Sign in"}
      </Button>
    </form>
  );
}