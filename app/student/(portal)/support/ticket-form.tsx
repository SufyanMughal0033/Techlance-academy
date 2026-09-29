"use client";

import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";

import { createSupportTicket } from "./actions";

const categories = [
  { value: "general", label: "General Support" },
  { value: "technical", label: "Technical Issue" },
  { value: "academic", label: "Academic Question" },
  { value: "assignment", label: "Assignment" },
  { value: "test", label: "Test / Quiz" },
  { value: "attendance", label: "Attendance" },
  { value: "certificate", label: "Certificate" },
];

export function TicketForm() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    startTransition(async () => {
      const response = await createSupportTicket({
        subject,
        category,
        message,
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      setSuccess(
        response.message ?? "Support ticket created successfully."
      );

      setSubject("");
      setCategory("general");
      setMessage("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          {success}
        </div>
      )}

      <div>
        <label
          htmlFor="subject"
          className="text-sm font-medium text-foreground"
        >
          Subject
        </label>

        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="What do you need help with?"
          disabled={isPending}
          required
          className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="text-sm font-medium text-foreground"
        >
          Category
        </label>

        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          disabled={isPending}
          className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="text-sm font-medium text-foreground"
        >
          Message
        </label>

        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Describe your question or issue..."
          disabled={isPending}
          required
          rows={6}
          className="mt-2 w-full resize-y rounded-lg border bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Ticket...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Ticket
          </>
        )}
      </button>
    </form>
  );
}