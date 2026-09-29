import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LifeBuoy,
  MessageCircle,
  Plus,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { TicketForm } from "./ticket-form";

export const metadata = {
  title: "Support",
  description: "Get help from Techlance Academy support.",
};

type Ticket = {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  created_at: string;
};

function getStatusLabel(status: Ticket["status"]) {
  switch (status) {
    case "in_progress":
      return "In Progress";

    case "resolved":
      return "Resolved";

    case "closed":
      return "Closed";

    default:
      return "Open";
  }
}

function getStatusClasses(status: Ticket["status"]) {
  switch (status) {
    case "resolved":
      return "bg-green-500/10 text-green-700 dark:text-green-400";

    case "closed":
      return "bg-muted text-muted-foreground";

    case "in_progress":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400";

    default:
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
  }
}

function getPriorityClasses(priority: Ticket["priority"]) {
  switch (priority) {
    case "urgent":
      return "bg-red-500/10 text-red-700 dark:text-red-400";

    case "high":
      return "bg-orange-500/10 text-orange-700 dark:text-orange-400";

    case "low":
      return "bg-muted text-muted-foreground";

    default:
      return "bg-primary/10 text-primary";
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function SupportPage() {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select(`
      id,
      subject,
      category,
      message,
      status,
      priority,
      created_at
    `)
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  const supportTickets = (tickets ?? []) as Ticket[];

  const openCount = supportTickets.filter(
    (ticket) =>
      ticket.status === "open" ||
      ticket.status === "in_progress"
  ).length;

  const resolvedCount = supportTickets.filter(
    (ticket) =>
      ticket.status === "resolved" ||
      ticket.status === "closed"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Student Portal
        </p>

        <div className="mt-1 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <LifeBuoy className="h-5 w-5 text-primary" />
          </div>

          <h2 className="font-display text-2xl font-semibold text-foreground">
            Student Support
          </h2>
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Need help? Create a support ticket and our team will
          assist you.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Tickets
                </p>

                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {supportTickets.length}
                </p>
              </div>

              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Open Tickets
                </p>

                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {openCount}
                </p>
              </div>

              <Clock3 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Resolved
                </p>

                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {resolvedCount}
                </p>
              </div>

              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Ticket */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="h-4 w-4 text-primary" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground">
                Create Support Ticket
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Tell us what you need help with and our support team
                will review your request.
              </p>
            </div>
          </div>

          <TicketForm />
        </CardContent>
      </Card>

      {/* Ticket History */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b p-5">
            <h3 className="text-base font-semibold text-foreground">
              My Support Tickets
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              View the status of your previous support requests.
            </p>
          </div>

          {supportTickets.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-14 text-center">
              <MessageCircle className="h-9 w-9 text-muted-foreground" />

              <p className="mt-4 text-sm font-medium text-foreground">
                No support tickets yet
              </p>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Your submitted support requests will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-5 transition-colors hover:bg-muted/20"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">
                          {ticket.subject}
                        </h4>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                            ticket.status
                          )}`}
                        >
                          {getStatusLabel(ticket.status)}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${getPriorityClasses(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </div>

                      <p className="mt-1 text-xs capitalize text-muted-foreground">
                        {ticket.category.replace("_", " ")}
                      </p>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {ticket.message}
                      </p>

                      <p className="mt-3 text-xs text-muted-foreground">
                        Created {formatDate(ticket.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {ticket.status === "resolved" ||
                      ticket.status === "closed" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : ticket.status === "in_progress" ? (
                        <Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      )}

                      {getStatusLabel(ticket.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}