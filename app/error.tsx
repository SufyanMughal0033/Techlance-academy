"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          An unexpected error occurred. Please refresh the page and try again.
        </p>

        <a
          href="/admin/attendance"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to Attendance
        </a>
      </div>
    </div>
  );
}