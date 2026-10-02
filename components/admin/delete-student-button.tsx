"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteStudent } from "@/app/admin/(portal)/students/actions";

type DeleteStudentButtonProps = {
  studentId: string;
  studentName: string;
  studentEmail: string;
};

export default function DeleteStudentButton({
  studentId,
  studentName,
  studentEmail,
}: DeleteStudentButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Permanently delete this student?\n\nName: ${studentName}\nEmail: ${studentEmail}\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setLoading(true);

    const result = await deleteStudent(studentId);

    if (!result.success) {
      alert(result.error || "Failed to delete student.");
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
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/50 dark:hover:bg-red-950/30"
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