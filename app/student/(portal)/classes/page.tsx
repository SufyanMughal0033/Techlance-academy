import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock3,
  Video,
  BookOpen,
  ExternalLink,
} from "lucide-react";

export const metadata = { title: "Classes" };

export default async function Page() {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("program_id")
    .eq("student_id", user.id)
    .eq("status", "active");

  if (enrollmentError) {
    console.error("Enrollment fetch error:", enrollmentError);
  }

  const programIds = enrollments?.map((item) => item.program_id) ?? [];

  const { data: modules, error: modulesError } =
    programIds.length > 0
      ? await supabase
          .from("modules")
          .select("id, program_id, title")
          .in("program_id", programIds)
      : { data: [], error: null };

  if (modulesError) {
    console.error("Modules fetch error:", modulesError);
  }

  const moduleIds = modules?.map((module) => module.id) ?? [];

  const { data: classes, error: classesError } =
    moduleIds.length > 0
      ? await supabase
          .from("classes")
          .select(
            "id, module_id, title, description, class_date, start_time, end_time, meeting_url, recording_url, status, class_order"
          )
          .in("module_id", moduleIds)
          .order("class_date", { ascending: true })
          .order("start_time", { ascending: true })
      : { data: [], error: null };

  if (classesError) {
    console.error("Classes fetch error:", classesError);
  }

  const moduleMap = new Map(
    (modules ?? []).map((module) => [module.id, module])
  );

  const upcomingClasses =
    classes?.filter(
      (item) => item.status === "scheduled" || item.status === "live"
    ) ?? [];

  const pastClasses =
    classes?.filter(
      (item) =>
        item.status === "completed" || item.status === "cancelled"
    ) ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Classes
        </h2>

        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Upcoming and past live classes for your enrolled programs, each with
          its meeting link when it&apos;s time.
        </p>
      </div>

      {/* Upcoming */}
      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Upcoming Classes
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Your scheduled and currently live classes.
          </p>
        </div>

        {upcomingClasses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CalendarDays className="mx-auto h-9 w-9 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium text-foreground">
                No upcoming classes
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your upcoming classes will appear here when they are
                scheduled.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {upcomingClasses.map((classItem) => {
              const module = moduleMap.get(classItem.module_id);

              return (
                <ClassCard
                  key={classItem.id}
                  classItem={classItem}
                  moduleTitle={module?.title}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Past */}
      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Class History
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Previously completed or cancelled classes.
          </p>
        </div>

        {pastClasses.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No class history available yet.
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {pastClasses.map((classItem) => {
              const module = moduleMap.get(classItem.module_id);

              return (
                <Card key={classItem.id}>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <BookOpen className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {classItem.title}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {module?.title || "Course Module"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(classItem.class_date)}
                      </span>

                      <Badge
                        variant={
                          classItem.status === "completed"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {capitalize(classItem.status)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function ClassCard({
  classItem,
  moduleTitle,
}: {
  classItem: {
    id: string;
    module_id: string;
    title: string;
    description: string | null;
    class_date: string | null;
    start_time: string | null;
    end_time: string | null;
    meeting_url: string | null;
    recording_url: string | null;
    status: string;
  };
  moduleTitle?: string;
}) {
  const isLive = classItem.status === "live";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-base">{classItem.title}</CardTitle>

            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{moduleTitle || "Course Module"}</span>
            </div>
          </div>

          <Badge variant={isLive ? "default" : "secondary"}>
            {isLive ? "Live Now" : "Scheduled"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {classItem.description && (
          <p className="text-sm leading-6 text-muted-foreground">
            {classItem.description}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span className="text-xs">Date</span>
            </div>

            <p className="mt-1 text-sm font-medium text-foreground">
              {formatDate(classItem.class_date)}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs">Time</span>
            </div>

            <p className="mt-1 text-sm font-medium text-foreground">
              {formatTimeRange(
                classItem.start_time,
                classItem.end_time
              )}
            </p>
          </div>
        </div>

        {classItem.meeting_url && (
          <a
            href={classItem.meeting_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Video className="h-4 w-4" />
            {isLive ? "Join Live Class" : "Class Meeting Link"}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}

        {classItem.recording_url && (
          <a
            href={classItem.recording_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Video className="h-4 w-4" />
            Watch Recording
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function formatDate(date: string | null) {
  if (!date) return "Date not set";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(time: string | null) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTimeRange(
  startTime: string | null,
  endTime: string | null
) {
  if (!startTime && !endTime) return "Time not set";

  if (startTime && endTime) {
    return `${formatTime(startTime)} – ${formatTime(endTime)}`;
  }

  return formatTime(startTime || endTime);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}