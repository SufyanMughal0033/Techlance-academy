"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginSchema,
  type LoginInput,
} from "@/schemas/auth";

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

  const [showPassword, setShowPassword] =
    React.useState(false);

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
        <Label htmlFor="email">
          Email
        </Label>

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

        {/* Password field with Show/Hide button */}
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            className="pr-10"
            {...register("password")}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

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
          <Loader2 className="h-4 w-4" />
        )}

        {isSubmitting
          ? "Signing in…"
          : "Sign in"}
      </Button>
    </form>
  );
}