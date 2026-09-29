import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import {
  AlertCircle,
  Award,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Trophy,
  User,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Dashboard",
};

type UpcomingClass = {
  id: string;
  title: string;
  class_date: string | null;
  start_time: string | null;
  end_time: string | null;
  status: "scheduled" | "live" | "completed" | "cancelled";
  moduleTitle: string;
};

type Announcement = {
  id: string;
  title: string;
  announcement_type: string;
  published_at: string;
};

export default async function Page() {
  const { user, profile } = await requireRole("student");
  const supabase = await createClient();

  const studentName =
    profile.fullname?.trim() || user.email?.split("@")[0] || "Student";

  /*
   * ---------------------------------------------------------
   * 1. ENROLLMENTS + PROGRAM
   * ---------------------------------------------------------
   */

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      program_id,
      status,
      enrolled_at,
      program:programs (
        id,
        title,
        slug
      )
    `)
    .eq("student_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false });

  const activeEnrollments = enrollments ?? [];

  const programIds = activeEnrollments.map(
    (enrollment) => enrollment.program_id
  );

  const primaryEnrollment = activeEnrollments[0];

  const primaryProgramData = primaryEnrollment?.program;
  const primaryProgram = Array.isArray(primaryProgramData)
    ? primaryProgramData[0]
    : primaryProgramData;

  /*
   * ---------------------------------------------------------
   * 2. MODULES
   * ---------------------------------------------------------
   */

  const { data: modules } =
    programIds.length > 0
      ? await supabase
          .from("modules")
          .select("id, program_id, title, module_order, status")
          .in("program_id", programIds)
          .eq("status", "active")
          .order("module_order", { ascending: true })
      : { data: [] };

  const activeModules = modules ?? [];
  const moduleIds = activeModules.map((module) => module.id);

  /*
   * ---------------------------------------------------------
   * 3. LOAD LMS DATA
   * ---------------------------------------------------------
   */

  const [
    classesResult,
    assignmentsResult,
    submissionsResult,
    testsResult,
    attemptsResult,
    attendanceResult,
    certificatesResult,
    announcementsResult,
    ticketsResult,
  ] = await Promise.all([
    moduleIds.length > 0
      ? supabase
          .from("classes")
          .select(`
            id,
            module_id,
            title,
            class_date,
            start_time,
            end_time,
            status
          `)
          .in("module_id", moduleIds)
          .order("class_date", { ascending: true })
          .order("start_time", { ascending: true })
      : Promise.resolve({ data: [] }),

    moduleIds.length > 0
      ? supabase
          .from("assignments")
          .select(`
            id,
            module_id,
            title,
            due_date,
            max_marks,
            status
          `)
          .in("module_id", moduleIds)
          .eq("status", "published")
          .order("due_date", { ascending: true })
      : Promise.resolve({ data: [] }),

    supabase
      .from("student_submissions")
      .select(`
        id,
        assignment_id,
        status,
        marks,
        submitted_at
      `)
      .eq("student_id", user.id),

    moduleIds.length > 0
      ? supabase
          .from("tests")
          .select(`
            id,
            module_id,
            title,
            total_marks,
            passing_marks,
            status
          `)
          .in("module_id", moduleIds)
          .eq("status", "published")
          .order("test_order", { ascending: true })
      : Promise.resolve({ data: [] }),

    supabase
      .from("test_attempts")
      .select(`
        id,
        test_id,
        status,
        marks_obtained,
        total_marks,
        percentage,
        submitted_at
      `)
      .eq("student_id", user.id)
      .in("status", ["submitted", "passed", "failed"]),

    supabase
      .from("attendance")
      .select(`
        id,
        class_id,
        status,
        marked_at
      `)
      .eq("student_id", user.id),

    supabase
      .from("certificates")
      .select(`
        id,
        program_id,
        certificate_number,
        title,
        issue_date,
        status
      `)
      .eq("student_id", user.id)
      .eq("status", "issued")
      .order("issue_date", { ascending: false }),

    supabase
      .from("announcements")
      .select(`
        id,
        title,
        announcement_type,
        published_at,
        target_program_id
      `)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(5),

    supabase
      .from("support_tickets")
      .select(`
        id,
        subject,
        status,
        priority,
        created_at
      `)
      .eq("student_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const classes = classesResult.data ?? [];
  const assignments = assignmentsResult.data ?? [];
  const submissions = submissionsResult.data ?? [];
  const tests = testsResult.data ?? [];
  const attempts = attemptsResult.data ?? [];
  const attendance = attendanceResult.data ?? [];
  const certificates = certificatesResult.data ?? [];
  const allAnnouncements = announcementsResult.data ?? [];
  const supportTickets = ticketsResult.data ?? [];

  /*
   * ---------------------------------------------------------
   * 4. PROGRAM / MODULE STATS
   * ---------------------------------------------------------
   */

  const totalModules = activeModules.length;

  const completedClasses = classes.filter(
    (item) => item.status === "completed"
  ).length;

  const totalClasses = classes.filter(
    (item) => item.status !== "cancelled"
  ).length;

  /*
   * ---------------------------------------------------------
   * 5. ASSIGNMENT STATS
   * ---------------------------------------------------------
   */

  const submittedAssignmentIds = new Set(
    submissions
      .filter(
        (submission) =>
          submission.status === "submitted" ||
          submission.status === "late" ||
          submission.status === "graded"
      )
      .map((submission) => submission.assignment_id)
  );

  const completedAssignments = submittedAssignmentIds.size;

  const pendingAssignments = assignments.filter(
    (assignment) => !submittedAssignmentIds.has(assignment.id)
  );

  /*
   * ---------------------------------------------------------
   * 6. TEST STATS
   * ---------------------------------------------------------
   */

  const completedTestIds = new Set(attempts.map((attempt) => attempt.test_id));

  const passedTests = attempts.filter(
    (attempt) => attempt.status === "passed"
  ).length;

  const completedTests = completedTestIds.size;

  const pendingTests = tests.filter(
    (test) => !completedTestIds.has(test.id)
  );

  /*
   * ---------------------------------------------------------
   * 7. ATTENDANCE STATS
   * ---------------------------------------------------------
   */

  const presentCount = attendance.filter(
    (item) => item.status === "present"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.status === "late"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "absent"
  ).length;

  const attendanceMarked =
    presentCount + lateCount + absentCount;

  const attendancePercentage =
    attendanceMarked > 0
      ? Math.round(
          ((presentCount + lateCount) / attendanceMarked) * 100
        )
      : 0;

  /*
   * ---------------------------------------------------------
   * 8. OVERALL LEARNING PROGRESS
   *
   * Uses:
   * - Completed classes
   * - Assignments submitted
   * - Tests completed
   *
   * If no LMS activity exists yet, progress starts at 0%.
   * ---------------------------------------------------------
   */

  const classProgress =
    totalClasses > 0
      ? completedClasses / totalClasses
      : 0;

  const assignmentProgress =
    assignments.length > 0
      ? completedAssignments / assignments.length
      : 0;

  const testProgress =
    tests.length > 0
      ? completedTests / tests.length
      : 0;

  const progressParts = [
    ...(totalClasses > 0 ? [classProgress] : []),
    ...(assignments.length > 0 ? [assignmentProgress] : []),
    ...(tests.length > 0 ? [testProgress] : []),
  ];

  const overallProgress =
    progressParts.length > 0
      ? Math.round(
          (progressParts.reduce((sum, value) => sum + value, 0) /
            progressParts.length) *
            100
        )
      : 0;

  /*
   * ---------------------------------------------------------
   * 9. UPCOMING CLASSES
   * ---------------------------------------------------------
   */

  const now = new Date();

  const moduleMap = new Map(
    activeModules.map((module) => [module.id, module.title])
  );

  const upcomingClasses: UpcomingClass[] = classes
    .filter((classItem) => {
      if (!classItem.class_date) return false;
      if (classItem.status === "completed") return false;
      if (classItem.status === "cancelled") return false;

      const dateTimeString = classItem.start_time
        ? `${classItem.class_date}T${classItem.start_time}`
        : `${classItem.class_date}T00:00:00`;

      return new Date(dateTimeString) >= now;
    })
    .slice(0, 3)
    .map((classItem) => ({
      id: classItem.id,
      title: classItem.title,
      class_date: classItem.class_date,
      start_time: classItem.start_time,
      end_time: classItem.end_time,
      status: classItem.status,
      moduleTitle:
        moduleMap.get(classItem.module_id) || "Module",
    }));

  /*
   * ---------------------------------------------------------
   * 10. RECENT ANNOUNCEMENTS
   * ---------------------------------------------------------
   */

  const announcements: Announcement[] = allAnnouncements
    .filter(
      (announcement) =>
        announcement.target_program_id === null ||
        programIds.includes(announcement.target_program_id)
    )
    .slice(0, 3)
    .map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      announcement_type: announcement.announcement_type,
      published_at: announcement.published_at,
    }));

  /*
   * ---------------------------------------------------------
   * 11. SUPPORT STATS
   * ---------------------------------------------------------
   */

  const openSupportTickets = supportTickets.filter(
    (ticket) =>
      ticket.status === "open" ||
      ticket.status === "in_progress"
  ).length;

  /*
   * ---------------------------------------------------------
   * 12. HELPERS
   * ---------------------------------------------------------
   */

  function formatDate(date: string | null) {
    if (!date) return "Date not set";

    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
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

  function getAnnouncementLabel(type: string) {
    switch (type) {
      case "important":
        return "Important";
      case "class":
        return "Class";
      case "assignment":
        return "Assignment";
      case "test":
        return "Test";
      default:
        return "General";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <p className="text-sm font-medium text-primary">
          Student Portal
        </p>

        <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
          Welcome back, {studentName} 👋
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Here&apos;s your live learning overview. Your academic
          progress, classes, assignments and account activity are
          connected to Techlance Academy.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          icon={<GraduationCap className="h-5 w-5" />}
          label="Program"
          value={
            primaryProgram?.title ||
            profile.program ||
            "Not assigned"
          }
        />

        <InfoCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Modules"
          value={`${totalModules} Active`}
        />

        <InfoCard
          icon={<Trophy className="h-5 w-5" />}
          label="Progress"
          value={`${overallProgress}%`}
        />

        <InfoCard
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Account"
          value={profile.is_active ? "Active" : "Inactive"}
        />
      </div>

      {/* Learning Overview */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Overall Progress */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">
                Learning Progress
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Your current LMS activity
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-semibold text-primary">
                {overallProgress}%
              </p>

              <p className="text-xs text-muted-foreground">
                Overall
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${overallProgress}%`,
                }}
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <ProgressItem
                label="Classes"
                value={
                  totalClasses > 0
                    ? `${completedClasses}/${totalClasses}`
                    : "0"
                }
              />

              <ProgressItem
                label="Assignments"
                value={`${completedAssignments}/${assignments.length}`}
              />

              <ProgressItem
                label="Tests"
                value={`${completedTests}/${tests.length}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Attendance
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-8 border-primary/10">
                <div className="text-center">
                  <p className="text-xl font-semibold text-foreground">
                    {attendancePercentage}%
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    Attendance
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <StatLine
                  label="Present"
                  value={presentCount}
                />

                <StatLine
                  label="Late"
                  value={lateCount}
                />

                <StatLine
                  label="Absent"
                  value={absentCount}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStatCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Upcoming Classes"
          value={upcomingClasses.length}
        />

        <MiniStatCard
          icon={<ClipboardCheck className="h-5 w-5" />}
          label="Pending Assignments"
          value={pendingAssignments.length}
        />

        <MiniStatCard
          icon={<FileText className="h-5 w-5" />}
          label="Tests Passed"
          value={passedTests}
        />

        <MiniStatCard
          icon={<MessageCircle className="h-5 w-5" />}
          label="Open Support"
          value={openSupportTickets}
        />
      </div>

      {/* Upcoming Classes + Pending Assignments */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Upcoming Classes
            </CardTitle>
          </CardHeader>

          <CardContent>
            {upcomingClasses.length === 0 ? (
              <EmptyState
                icon={<CalendarDays className="h-8 w-8" />}
                title="No upcoming classes"
                description="Your scheduled classes will appear here."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {upcomingClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {classItem.title}
                        </p>

                        <p className="mt-1 text-xs text-primary">
                          {classItem.moduleTitle}
                        </p>
                      </div>

                      <Badge
                        variant={
                          classItem.status === "live"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {classItem.status === "live"
                          ? "Live"
                          : "Scheduled"}
                      </Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(classItem.class_date)}
                      </span>

                      {classItem.start_time && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatTime(classItem.start_time)}
                          {classItem.end_time
                            ? ` - ${formatTime(classItem.end_time)}`
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Pending Assignments
            </CardTitle>
          </CardHeader>

          <CardContent>
            {pendingAssignments.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 className="h-8 w-8" />}
                title="All caught up"
                description="You have no pending assignments."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {pendingAssignments
                  .slice(0, 4)
                  .map((assignment) => (
                    <div
                      key={assignment.id}
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {assignment.title}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {moduleMap.get(assignment.module_id) ||
                              "Module"}
                          </p>
                        </div>

                        <Badge variant="secondary">
                          {assignment.max_marks} marks
                        </Badge>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />

                        Due{" "}
                        {assignment.due_date
                          ? formatDate(assignment.due_date)
                          : "No due date"}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tests + Certificate */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Test Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Test Performance
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <SummaryBox
                label="Available Tests"
                value={tests.length}
              />

              <SummaryBox
                label="Completed"
                value={completedTests}
              />

              <SummaryBox
                label="Passed"
                value={passedTests}
              />

              <SummaryBox
                label="Pending"
                value={pendingTests.length}
              />
            </div>

            {attempts.length > 0 && (
              <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">
                  Latest Result
                </p>

                <p className="mt-1 text-lg font-semibold text-foreground">
                  {attempts[0].percentage ?? 0}%
                </p>

                <p className="mt-1 text-xs capitalize text-muted-foreground">
                  {attempts[0].status}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Certificate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Certificates
            </CardTitle>
          </CardHeader>

          <CardContent>
            {certificates.length === 0 ? (
              <EmptyState
                icon={<Award className="h-8 w-8" />}
                title="No certificates yet"
                description="Your issued certificates will appear here."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {certificates.slice(0, 2).map((certificate) => (
                  <div
                    key={certificate.id}
                    className="flex items-center gap-4 rounded-xl border border-border p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Award className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {certificate.title}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {certificate.certificate_number}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Issued {formatDate(certificate.issue_date)}
                      </p>
                    </div>

                    <Badge className="ml-auto">
                      Issued
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Recent Announcements
          </CardTitle>
        </CardHeader>

        <CardContent>
          {announcements.length === 0 ? (
            <EmptyState
              icon={<AlertCircle className="h-8 w-8" />}
              title="No announcements"
              description="New academy announcements will appear here."
            />
          ) : (
            <div className="divide-y">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <AlertCircle className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {announcement.title}
                      </p>

                      <Badge variant="secondary">
                        {getAnnouncementLabel(
                          announcement.announcement_type
                        )}
                      </Badge>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(announcement.published_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">
            Student Information
          </CardTitle>

          <Badge
            variant={
              profile.is_active ? "default" : "destructive"
            }
          >
            {profile.is_active ? "Active" : "Inactive"}
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              icon={<User className="h-4 w-4" />}
              label="Full Name"
              value={profile.fullname}
            />

            <DetailItem
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={profile.email || user.email}
            />

            <DetailItem
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={profile.phone}
            />

            <DetailItem
              icon={<GraduationCap className="h-4 w-4" />}
              label="Qualification"
              value={profile.qualification}
            />

            <DetailItem
              icon={<MapPin className="h-4 w-4" />}
              label="City"
              value={profile.city}
            />

            <DetailItem
              icon={<Briefcase className="h-4 w-4" />}
              label="Experience"
              value={profile.experience}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------
 * Reusable Components
 * --------------------------------------------------------- */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            {label}
          </p>

          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            {label}
          </p>

          <p className="mt-0.5 text-xl font-semibold text-foreground">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function StatLine({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex min-w-[110px] items-center justify-between gap-4">
      <span className="text-xs text-muted-foreground">
        {label}
      </span>

      <span className="text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function SummaryBox({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-5 py-8 text-center">
      <div className="text-muted-foreground">
        {icon}
      </div>

      <p className="mt-3 text-sm font-medium text-foreground">
        {title}
      </p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
      <div className="mt-0.5 text-muted-foreground">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-foreground">
          {value?.trim() || "Not provided"}
        </p>
      </div>
    </div>
  );
}