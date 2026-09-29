import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "./actions";

export const metadata = {
  title: "Attendance",
};

export default async function AttendancePage() {
  const supabase = await createClient();

  const [
    { data: attendance, error },
    { data: classes },
    { data: students },
  ] = await Promise.all([
    supabase
      .from("attendance")
      .select(
        "id, class_id, student_id, status, marked_at, remarks, created_at, updated_at"
      )
      .order("marked_at", { ascending: false }),

    supabase
      .from("classes")
      .select("id, title, class_date, start_time, module_id")
      .order("class_date", { ascending: false }),

    supabase
      .from("profiles")
      .select("id, fullname, email, role")
      .eq("role", "student")
      .eq("is_active", true)
      .order("fullname", { ascending: true }),
  ]);

  const classMap = new Map(
    (classes ?? []).map((item) => [item.id, item])
  );

  const studentMap = new Map(
    (students ?? []).map((student) => [student.id, student])
  );

  const totalAttendance = attendance?.length ?? 0;

  const presentCount =
    attendance?.filter((item) => item.status === "present").length ?? 0;

  const absentCount =
    attendance?.filter((item) => item.status === "absent").length ?? 0;

  const lateCount =
    attendance?.filter((item) => item.status === "late").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Attendance
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Mark and manage student attendance for Academy classes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="mt-2 text-2xl font-semibold">
              {totalAttendance}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Present</p>
            <p className="mt-2 text-2xl font-semibold">
              {presentCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Absent</p>
            <p className="mt-2 text-2xl font-semibold">
              {absentCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Late</p>
            <p className="mt-2 text-2xl font-semibold">
              {lateCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            action={createAttendance}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>

              <select
                name="class_id"
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select class</option>

                {(classes ?? []).map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.title}
                    {classItem.class_date
                      ? ` — ${classItem.class_date}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Student</label>

              <select
                name="student_id"
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select student</option>

                {(students ?? []).map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.fullname} — {student.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>

              <select
                name="status"
                defaultValue="present"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Remarks</label>

              <Input
                name="remarks"
                placeholder="Optional remarks"
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit">Mark Attendance</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="py-10 text-center text-sm text-destructive">
              Failed to load attendance: {error.message}
            </div>
          ) : !attendance?.length ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No attendance records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Class</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Marked At</th>
                    <th className="px-4 py-3 font-medium">Remarks</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map((record) => {
                    const student = studentMap.get(record.student_id);
                    const classItem = classMap.get(record.class_id);

                    return (
                      <tr
                        key={record.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-4">
                          <div className="font-medium">
                            {student?.fullname ?? "Unknown Student"}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {student?.email ?? ""}
                          </div>
                        </td>

                        <td className="px-4 py-4 font-medium">
                          {classItem?.title ?? "Unknown Class"}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                            {record.status}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {new Date(record.marked_at).toLocaleString()}
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {record.remarks || "—"}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <details>
                              <summary className="cursor-pointer list-none">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                >
                                  Edit
                                </Button>
                              </summary>

                              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
                                  <div className="mb-5">
                                    <h3 className="text-lg font-semibold">
                                      Edit Attendance
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                      Update this attendance record.
                                    </p>
                                  </div>

                                  <form
                                    action={updateAttendance}
                                    className="grid gap-4"
                                  >
                                    <input
                                      type="hidden"
                                      name="id"
                                      value={record.id}
                                    />

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Class
                                      </label>

                                      <select
                                        name="class_id"
                                        defaultValue={record.class_id}
                                        required
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                      >
                                        {(classes ?? []).map(
                                          (classOption) => (
                                            <option
                                              key={classOption.id}
                                              value={classOption.id}
                                            >
                                              {classOption.title}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Student
                                      </label>

                                      <select
                                        name="student_id"
                                        defaultValue={record.student_id}
                                        required
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                      >
                                        {(students ?? []).map(
                                          (studentOption) => (
                                            <option
                                              key={studentOption.id}
                                              value={studentOption.id}
                                            >
                                              {studentOption.fullname} —{" "}
                                              {studentOption.email}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Status
                                      </label>

                                      <select
                                        name="status"
                                        defaultValue={record.status}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                      >
                                        <option value="present">
                                          Present
                                        </option>
                                        <option value="absent">
                                          Absent
                                        </option>
                                        <option value="late">
                                          Late
                                        </option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Remarks
                                      </label>

                                      <Input
                                        name="remarks"
                                        defaultValue={record.remarks ?? ""}
                                        placeholder="Optional remarks"
                                      />
                                    </div>

                                    <div className="flex gap-2">
                                      <Button type="submit">
                                        Save Changes
                                      </Button>

                                      <a
                                        href="/admin/attendance"
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                      >
                                        Cancel
                                      </a>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </details>

                            <form action={deleteAttendance}>
                              <input
                                type="hidden"
                                name="id"
                                value={record.id}
                              />

                              <Button
                                type="submit"
                                variant="destructive"
                                size="sm"
                              >
                                Delete
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}