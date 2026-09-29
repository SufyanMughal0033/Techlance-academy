import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Applications",
};

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  program: string;
  qualification: string;
  city: string;
  experience: string;
  status: "pending" | "approved" | "rejected";
  reviewed_at: string | null;
  student_id: string | null;
};

function StatusBadge({
  status,
}: {
  status: Application["status"];
}) {
  const styles = {
    pending:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    approved:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    rejected:
      "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default async function Page() {
  const supabase = await createClient();

  const { data: applications, error } = await supabase
    .from("applications")
    .select(
      "id, full_name, email, phone, program, qualification, city, experience, status, reviewed_at, student_id"
    )
    .order("status", { ascending: true });

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Applications
          </h2>

          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Review and manage student admission applications.
          </p>
        </div>

        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm font-medium text-red-600">
              Unable to load applications.
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rows = (applications ?? []) as Application[];

  const pendingCount = rows.filter(
    (application) => application.status === "pending"
  ).length;

  const approvedCount = rows.filter(
    (application) => application.status === "approved"
  ).length;

  const rejectedCount = rows.filter(
    (application) => application.status === "rejected"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Applications
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Review admission applications and manage the student admission
          process.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Pending Applications
            </p>

            <p className="mt-2 text-3xl font-semibold text-foreground">
              {pendingCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Approved Students
            </p>

            <p className="mt-2 text-3xl font-semibold text-foreground">
              {approvedCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Rejected Applications
            </p>

            <p className="mt-2 text-3xl font-semibold text-foreground">
              {rejectedCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications */}
      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-sm font-medium text-foreground">
                No applications yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                New admission applications will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-5 py-4 text-left font-medium">
                      Applicant
                    </th>

                    <th className="px-5 py-4 text-left font-medium">
                      Program
                    </th>

                    <th className="px-5 py-4 text-left font-medium">
                      Qualification
                    </th>

                    <th className="px-5 py-4 text-left font-medium">
                      City
                    </th>

                    <th className="px-5 py-4 text-left font-medium">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((application) => (
                    <tr
                      key={application.id}
                      className="border-b last:border-0 hover:bg-muted/20"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {application.full_name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {application.email}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {application.phone}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-medium text-foreground">
                          {application.program}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {application.qualification || "—"}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {application.city || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={application.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        {application.status === "pending" ? (
                          <span className="text-xs font-medium text-primary">
                            Review Required
                          </span>
                        ) : application.status === "approved" ? (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            Admission Approved
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Application Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}