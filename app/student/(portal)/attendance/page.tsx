import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserX,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Attendance",
  description: "View your class attendance and attendance history.",
};

type AttendanceRecord = {
  id: string;
  status: "present" | "absent" | "late";
  marked_at: string;
  remarks: string | null;
  class_id: string;
  classes:
    | {
        id: string;
        title: string;
        class_date: string | null;
        start_time: string | null;
        end_time: string | null;
        modules:
          | {
              title: string;
            }
          | {
              title: string;
            }[]
          | null;
      }
    | {
        id: string;
        title: string;
        class_date: string | null;
        start_time: string | null;
        end_time: string | null;
        modules:
          | {
              title: string;
            }
          | {
              title: string;
            }[]
          | null;
      }[]
    | null;
};

export default async function AttendancePage() {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  const { data: records } = await supabase
    .from("attendance")
    .select(`
      id,
      status,
      marked_at,
      remarks,
      class_id,
      classes (
        id,
        title,
        class_date,
        start_time,
        end_time,
        modules (
          title
        )
      )
    `)
    .eq("student_id", user.id)
    .order("marked_at", { ascending: false });

  const attendance = (records ?? []) as unknown as AttendanceRecord[];

  const presentCount = attendance.filter(
    (record) => record.status === "present"
  ).length;

  const absentCount = attendance.filter(
    (record) => record.status === "absent"
  ).length;

  const lateCount = attendance.filter(
    (record) => record.status === "late"
  ).length;

  const totalClasses = attendance.length;

  const attendancePercentage =
    totalClasses > 0
      ? Math.round(
          ((presentCount + lateCount) / totalClasses) * 100
        )
      : 0;

  function getModuleTitle(record: AttendanceRecord) {
    if (!record.classes) return "Unknown Module";

    const classData = Array.isArray(record.classes)
      ? record.classes[0]
      : record.classes;

    if (!classData?.modules) return "Unknown Module";

    const moduleData = Array.isArray(classData.modules)
      ? classData.modules[0]
      : classData.modules;

    return moduleData?.title ?? "Unknown Module";
  }

  function getClassData(record: AttendanceRecord) {
    if (!record.classes) return null;

    return Array.isArray(record.classes)
      ? record.classes[0] ?? null
      : record.classes;
  }

  function formatDate(date: string | null) {
    if (!date) return "Date not available";

    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  }

  function formatTime(time: string | null) {
    if (!time) return "";

    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Student Portal
        </p>

        <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
          Attendance
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Track your class attendance, punctuality, and attendance history.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Attendance
                </p>

                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {attendancePercentage}%
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Present
                </p>

                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {presentCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Late
                </p>

                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {lateCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Clock3 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Absent
                </p>

                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {absentCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Overall Attendance
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Based on your recorded classes.
              </p>
            </div>

            <span className="text-lg font-semibold text-foreground">
              {attendancePercentage}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${attendancePercentage}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>{totalClasses} total classes</span>

            <span>
              {presentCount + lateCount} attended
            </span>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b p-5">
            <h3 className="text-base font-semibold text-foreground">
              Attendance History
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Your attendance records for completed classes.
            </p>
          </div>

          {attendance.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-4 text-sm font-medium text-foreground">
                No attendance records yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your attendance will appear here once it is marked.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {attendance.map((record) => {
                const classData = getClassData(record);

                return (
                  <div
                    key={record.id}
                    className="p-5 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                              record.status === "present"
                                ? "bg-green-500/10"
                                : record.status === "late"
                                  ? "bg-yellow-500/10"
                                  : "bg-red-500/10"
                            }`}
                          >
                            {record.status === "present" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            ) : record.status === "late" ? (
                              <Clock3 className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                              <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-semibold text-foreground">
                              {classData?.title ?? "Class"}
                            </h4>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {getModuleTitle(record)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>
                            {formatDate(classData?.class_date ?? null)}
                          </span>

                          {classData?.start_time && (
                            <span>
                              {formatTime(classData.start_time)}
                              {classData.end_time
                                ? ` – ${formatTime(classData.end_time)}`
                                : ""}
                            </span>
                          )}
                        </div>

                        {record.remarks && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {record.remarks}
                          </p>
                        )}
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          record.status === "present"
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : record.status === "late"
                              ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                              : "bg-red-500/10 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}