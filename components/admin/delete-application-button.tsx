"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteApplication } from "@/app/admin/(portal)/applications/delete-action";

type DeleteApplicationButtonProps = {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
};

export default function DeleteApplicationButton({
  applicationId,
  applicantName,
  applicantEmail,
}: DeleteApplicationButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Permanently delete this application?\n\nName: ${applicantName}\nEmail: ${applicantEmail}\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    const result = await deleteApplication(applicationId);

    if (!result.success) {
      alert(result.error || "Failed to delete application.");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}

      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}