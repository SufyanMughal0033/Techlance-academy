import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteStudentButton from "@/components/admin/delete-student-button";

export const metadata = { title: "Students" };

export default async function StudentsPage() {
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("profiles")
    .select(
      "id, fullname, email, phone, program, qualification, city, experience, role, is_active, created_at"
    )
    .eq("role", "student")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Students
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage registered Techlance Academy students.
          </p>
        </div>

        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">
            Failed to load students: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Students
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          View and manage registered students, their profiles, programs, and
          account status.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-semibold">
              {students?.length ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Students
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-semibold">
              {students?.filter((student) => student.is_active).length ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactive Students
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-semibold">
              {students?.filter((student) => !student.is_active).length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Student Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Accounts</CardTitle>
        </CardHeader>

        <CardContent>
          {!students?.length ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No student accounts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">
                      Student
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Email
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Phone
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Program
                    </th>

                    <th className="px-4 py-3 font-medium">
                      City
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Status
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b last:border-0"
                    >
                      {/* Student */}
                      <td className="px-4 py-4 font-medium">
                        {student.fullname}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4 text-muted-foreground">
                        {student.email}
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-4">
                        {student.phone || "—"}
                      </td>

                      {/* Program */}
                      <td className="px-4 py-4">
                        {student.program || "—"}
                      </td>

                      {/* City */}
                      <td className="px-4 py-4">
                        {student.city || "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={
                            student.is_active
                              ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                              : "rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                          }
                        >
                          {student.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Delete */}
                      <td className="px-4 py-4">
                        <DeleteStudentButton
                          studentId={student.id}
                          studentName={
                            student.fullname || "Unnamed Student"
                          }
                          studentEmail={student.email || ""}
                        />
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