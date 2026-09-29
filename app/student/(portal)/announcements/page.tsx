import {
  AlertCircle,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileQuestion,
  Megaphone,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Announcements",
  description: "View the latest announcements and updates from Techlance Academy.",
};

type Announcement = {
  id: string;
  title: string;
  content: string;
  announcement_type:
    | "general"
    | "class"
    | "assignment"
    | "test"
    | "important";
  published_at: string;
  target_program_id: string | null;
};

function getAnnouncementIcon(type: Announcement["announcement_type"]) {
  switch (type) {
    case "class":
      return CalendarDays;

    case "assignment":
      return ClipboardCheck;

    case "test":
      return FileQuestion;

    case "important":
      return AlertCircle;

    default:
      return Megaphone;
  }
}

function getTypeLabel(type: Announcement["announcement_type"]) {
  switch (type) {
    case "class":
      return "Class Update";

    case "assignment":
      return "Assignment";

    case "test":
      return "Test";

    case "important":
      return "Important";

    default:
      return "General";
  }
}

function getTypeClasses(type: Announcement["announcement_type"]) {
  switch (type) {
    case "important":
      return "bg-red-500/10 text-red-700 dark:text-red-400";

    case "test":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400";

    case "assignment":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400";

    case "class":
      return "bg-green-500/10 text-green-700 dark:text-green-400";

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

export default async function AnnouncementsPage() {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select(`
      id,
      title,
      content,
      announcement_type,
      published_at,
      target_program_id
    `)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Student Portal
          </p>

          <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
            Announcements
          </h2>
        </div>

        <Card>
          <CardContent className="py-14 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-destructive" />

            <p className="mt-4 text-sm font-medium text-foreground">
              Unable to load announcements
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Please refresh the page and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const announcements = (data ?? []) as Announcement[];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Student Portal
        </p>

        <div className="mt-1 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>

          <h2 className="font-display text-2xl font-semibold text-foreground">
            Announcements
          </h2>
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Stay updated with the latest news, class updates, tests,
          assignments, and important academy notices.
        </p>
      </div>

      {/* Announcement list */}
      {announcements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-14 text-center">
            <Bell className="h-9 w-9 text-muted-foreground" />

            <p className="mt-4 text-sm font-medium text-foreground">
              No announcements yet
            </p>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              New academy announcements and updates will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {announcements.map((announcement) => {
            const Icon = getAnnouncementIcon(
              announcement.announcement_type
            );

            return (
              <Card
                key={announcement.id}
                className="overflow-hidden transition-colors hover:bg-muted/20"
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-foreground">
                              {announcement.title}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getTypeClasses(
                                announcement.announcement_type
                              )}`}
                            >
                              {getTypeLabel(
                                announcement.announcement_type
                              )}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(announcement.published_at)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                        {announcement.content}
                      </div>

                      {announcement.target_program_id && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <BookOpen className="h-3.5 w-3.5" />
                          Program-specific announcement
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}