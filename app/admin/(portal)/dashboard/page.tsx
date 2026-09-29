import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function Page() {
  const supabase = await createClient();

  const [
    studentsResult,
    applicationsResult,
    programsResult,
    coursesResult,
    modulesResult,
    classesResult,
    assignmentsResult,
    testsResult,
    certificatesResult,
    recentStudentsResult,
    recentCertificatesResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "student"),

    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("programs")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("courses")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("modules")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("classes")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("assignments")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("tests")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("certificates")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("profiles")
      .select("id, fullname, email, student_id, created_at")
      .eq("role", "student")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("certificates")
      .select(
        "id, certificate_number, title, issue_date, status, student_id"
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const studentsCount = studentsResult.count ?? 0;
  const pendingApplicationsCount = applicationsResult.count ?? 0;
  const programsCount = programsResult.count ?? 0;
  const coursesCount = coursesResult.count ?? 0;
  const modulesCount = modulesResult.count ?? 0;
  const classesCount = classesResult.count ?? 0;
  const assignmentsCount = assignmentsResult.count ?? 0;
  const testsCount = testsResult.count ?? 0;
  const certificatesCount = certificatesResult.count ?? 0;

  const recentStudents = recentStudentsResult.data ?? [];
  const recentCertificates = recentCertificatesResult.data ?? [];

  const certificateStudentIds = [
    ...new Set(
      recentCertificates
        .map((certificate) => certificate.student_id)
        .filter(Boolean)
    ),
  ];

  let certificateStudents: {
    id: string;
    fullname: string;
    student_id: string | null;
  }[] = [];

  if (certificateStudentIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, fullname, student_id")
      .in("id", certificateStudentIds);

    certificateStudents = data ?? [];
  }

  const certificateStudentMap = new Map(
    certificateStudents.map((student) => [
      student.id,
      student,
    ])
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Admin Dashboard
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Overview of students, applications, programs, academic content,
          classes and certificates.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Students"
          value={studentsCount}
          href="/admin/students"
        />

        <StatCard
          title="Pending Applications"
          value={pendingApplicationsCount}
          href="/admin/applications"
        />

        <StatCard
          title="Programs"
          value={programsCount}
          href="/admin/programs"
        />

        <StatCard
          title="Certificates"
          value={certificatesCount}
          href="/admin/certificates"
        />
      </div>

      {/* Academic Stats */}
      <div>
        <h3 className="mb-3 text-base font-semibold">
          Academic Overview
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Courses"
            value={coursesCount}
            href="/admin/courses"
          />

          <StatCard
            title="Modules"
            value={modulesCount}
            href="/admin/modules"
          />

          <StatCard
            title="Classes"
            value={classesCount}
            href="/admin/classes"
          />

          <StatCard
            title="Assignments"
            value={assignmentsCount}
            href="/admin/assignments"
          />
        </div>
      </div>

      {/* Tests */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Tests"
          value={testsCount}
          href="/admin/tests"
        />

        <StatCard
          title="Academic Content"
          value={modulesCount + classesCount + assignmentsCount + testsCount}
          href="/admin/content"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">
              Quick Actions
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Quickly access common admin tasks.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              title="Manage Students"
              href="/admin/students"
            />

            <QuickAction
              title="Review Applications"
              href="/admin/applications"
            />

            <QuickAction
              title="Add Program"
              href="/admin/programs"
            />

            <QuickAction
              title="Issue Certificate"
              href="/admin/certificates"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Students */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Recent Students
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Latest registered students.
                </p>
              </div>

              <Link
                href="/admin/students"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            {recentStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No students found.
              </p>
            ) : (
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {student.fullname}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {student.email}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-muted-foreground">
                      {student.student_id || "No ID"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Certificates */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Recent Certificates
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Recently issued certificates.
                </p>
              </div>

              <Link
                href="/admin/certificates"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            {recentCertificates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No certificates found.
              </p>
            ) : (
              <div className="space-y-4">
                {recentCertificates.map((certificate) => {
                  const student = certificateStudentMap.get(
                    certificate.student_id
                  );

                  return (
                    <div
                      key={certificate.id}
                      className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {certificate.certificate_number}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {student?.fullname || "Unknown student"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                          certificate.status === "issued"
                            ? "bg-emerald-100 text-emerald-700"
                            : certificate.status === "revoked"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {certificate.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  href,
}: {
  title: string;
  value: number;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="transition-colors hover:bg-muted/40">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {value}
          </p>

          <p className="mt-2 text-xs text-primary">
            Open →
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function QuickAction({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50"
    >
      {title}
    </Link>
  );
}