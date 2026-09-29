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
  createProgress,
  updateProgress,
  deleteProgress,
} from "./actions";

export const metadata = {
  title: "Progress",
};

export default async function ProgressPage() {
  const supabase = await createClient();

  const [
    { data: progress, error },
    { data: students },
    { data: programs },
  ] = await Promise.all([
    supabase
      .from("progress")
      .select(
        "id, student_id, program_id, completion_percentage, status, notes, created_at, updated_at"
      )
      .order("updated_at", { ascending: false }),

    supabase
      .from("profiles")
      .select("id, fullname, email, role")
      .eq("role", "student")
      .eq("is_active", true)
      .order("fullname", { ascending: true }),

    supabase
      .from("programs")
      .select("id, title, slug, status")
      .order("title", { ascending: true }),
  ]);

  const studentMap = new Map(
    (students ?? []).map((student) => [student.id, student])
  );

  const programMap = new Map(
    (programs ?? []).map((program) => [program.id, program])
  );

  const totalProgress = progress?.length ?? 0;

  const notStartedCount =
    progress?.filter(
      (item) => item.status === "not_started"
    ).length ?? 0;

  const inProgressCount =
    progress?.filter(
      (item) => item.status === "in_progress"
    ).length ?? 0;

  const completedCount =
    progress?.filter(
      (item) => item.status === "completed"
    ).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Student Progress
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Manage student course progress and completion status.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Records
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {totalProgress}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Not Started
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {notStartedCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              In Progress
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {inProgressCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Completed
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {completedCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Add Student Progress</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            action={createProgress}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Student
              </label>

              <select
                name="student_id"
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select student</option>

                {(students ?? []).map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.fullname} — {student.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Program
              </label>

              <select
                name="program_id"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select program</option>

                {(programs ?? []).map((program) => (
                  <option
                    key={program.id}
                    value={program.id}
                  >
                    {program.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Completion Percentage
              </label>

              <Input
                name="completion_percentage"
                type="number"
                min="0"
                max="100"
                defaultValue="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status
              </label>

              <select
                name="status"
                defaultValue="not_started"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="not_started">
                  Not Started
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Notes
              </label>

              <Input
                name="notes"
                placeholder="Optional progress notes"
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit">
                Add Progress
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Progress Records */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Records</CardTitle>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="py-10 text-center text-sm text-destructive">
              Failed to load progress: {error.message}
            </div>
          ) : !progress?.length ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No progress records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">
                      Student
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Program
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Progress
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Status
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Notes
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {progress.map((record) => {
                    const student = studentMap.get(
                      record.student_id
                    );

                    const program = record.program_id
                      ? programMap.get(record.program_id)
                      : null;

                    return (
                      <tr
                        key={record.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-4">
                          <div className="font-medium">
                            {student?.fullname ??
                              "Unknown Student"}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {student?.email ?? ""}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          {program?.title ?? "No Program"}
                        </td>

                        <td className="px-4 py-4">
                          <div className="min-w-[160px]">
                            <div className="mb-1 flex justify-between text-xs">
                              <span>Completion</span>

                              <span className="font-medium">
                                {record.completion_percentage}%
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                  width: `${record.completion_percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                            {record.status}
                          </span>
                        </td>

                        <td className="max-w-[220px] px-4 py-4 text-muted-foreground">
                          {record.notes || "—"}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <details>
                              <summary className="cursor-pointer list-none">
                                <span className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                  Edit
                                </span>
                              </summary>

                              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
                                  <div className="mb-5">
                                    <h3 className="text-lg font-semibold">
                                      Edit Progress
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                      Update this student's progress.
                                    </p>
                                  </div>

                                  <form
                                    action={updateProgress}
                                    className="grid gap-4"
                                  >
                                    <input
                                      type="hidden"
                                      name="id"
                                      value={record.id}
                                    />

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Student
                                      </label>

                                      <select
                                        name="student_id"
                                        defaultValue={
                                          record.student_id
                                        }
                                        required
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                      >
                                        {(students ?? []).map(
                                          (studentOption) => (
                                            <option
                                              key={
                                                studentOption.id
                                              }
                                              value={
                                                studentOption.id
                                              }
                                            >
                                              {
                                                studentOption.fullname
                                              }{" "}
                                              —{" "}
                                              {
                                                studentOption.email
                                              }
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Program
                                      </label>

                                      <select
                                        name="program_id"
                                        defaultValue={
                                          record.program_id ?? ""
                                        }
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                      >
                                        <option value="">
                                          No Program
                                        </option>

                                        {(programs ?? []).map(
                                          (program) => (
                                            <option
                                              key={program.id}
                                              value={program.id}
                                            >
                                              {program.title}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Completion Percentage
                                      </label>

                                      <Input
                                        name="completion_percentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        defaultValue={
                                          record.completion_percentage
                                        }
                                        required
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Status
                                      </label>

                                      <select
                                        name="status"
                                        defaultValue={
                                          record.status
                                        }
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                      >
                                        <option value="not_started">
                                          Not Started
                                        </option>

                                        <option value="in_progress">
                                          In Progress
                                        </option>

                                        <option value="completed">
                                          Completed
                                        </option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Notes
                                      </label>

                                      <Input
                                        name="notes"
                                        defaultValue={
                                          record.notes ?? ""
                                        }
                                        placeholder="Optional progress notes"
                                      />
                                    </div>

                                    <div className="flex gap-2">
                                      <Button type="submit">
                                        Save Changes
                                      </Button>

                                      <a
                                        href="/admin/progress"
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                                      >
                                        Cancel
                                      </a>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </details>

                            <form action={deleteProgress}>
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