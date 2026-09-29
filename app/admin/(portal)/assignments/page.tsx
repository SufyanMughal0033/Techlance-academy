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
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "./actions";

export const metadata = {
  title: "Assignments",
};

export default async function AssignmentsPage() {
  const supabase = await createClient();

  const [{ data: assignments, error }, { data: modules }] =
    await Promise.all([
      supabase
        .from("assignments")
        .select(
          "id, module_id, title, description, instructions, due_date, max_marks, attachment_url, assignment_order, status, created_at, updated_at"
        )
        .order("assignment_order", { ascending: true })
        .order("created_at", { ascending: false }),

      supabase
        .from("modules")
        .select("id, title")
        .order("module_order", { ascending: true }),
    ]);

  const moduleMap = new Map(
    (modules ?? []).map((module) => [module.id, module.title])
  );

  const totalAssignments = assignments?.length ?? 0;

  const publishedAssignments =
    assignments?.filter((assignment) => assignment.status === "published")
      .length ?? 0;

  const draftAssignments =
    assignments?.filter((assignment) => assignment.status === "draft").length ??
    0;

  const closedAssignments =
    assignments?.filter((assignment) => assignment.status === "closed").length ??
    0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Assignments
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Create and manage assignments for Techlance Academy modules.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Assignments
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {totalAssignments}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Published</p>
            <p className="mt-2 text-2xl font-semibold">
              {publishedAssignments}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Draft</p>
            <p className="mt-2 text-2xl font-semibold">{draftAssignments}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Closed</p>
            <p className="mt-2 text-2xl font-semibold">{closedAssignments}</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Create Assignment</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            action={createAssignment}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Module</label>

              <select
                name="module_id"
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select module</option>

                {(modules ?? []).map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assignment Title</label>

              <Input
                name="title"
                placeholder="e.g. Build a Responsive Landing Page"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>

              <textarea
                name="description"
                placeholder="Short description of the assignment..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Instructions</label>

              <textarea
                name="instructions"
                placeholder="Detailed instructions for students..."
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>

              <Input
                name="due_date"
                type="datetime-local"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Marks</label>

              <Input
                name="max_marks"
                type="number"
                min="1"
                defaultValue="100"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Attachment URL</label>

              <Input
                name="attachment_url"
                type="url"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assignment Order</label>

              <Input
                name="assignment_order"
                type="number"
                min="1"
                defaultValue="1"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>

              <select
                name="status"
                defaultValue="published"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Button type="submit">Create Assignment</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="py-10 text-center text-sm text-destructive">
              Failed to load assignments: {error.message}
            </div>
          ) : !assignments?.length ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No assignments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Module</th>
                    <th className="px-4 py-3 font-medium">Marks</th>
                    <th className="px-4 py-3 font-medium">Due Date</th>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {assignments.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-4 py-4 font-medium">
                        {assignment.title}
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {moduleMap.get(assignment.module_id) ??
                          "Unknown Module"}
                      </td>

                      <td className="px-4 py-4">
                        {assignment.max_marks}
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {assignment.due_date
                          ? new Date(
                              assignment.due_date
                            ).toLocaleString()
                          : "No deadline"}
                      </td>

                      <td className="px-4 py-4">
                        {assignment.assignment_order}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                          {assignment.status}
                        </span>
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
                              <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border bg-background p-6 shadow-lg">
                                <div className="mb-5">
                                  <h3 className="text-lg font-semibold">
                                    Edit Assignment
                                  </h3>

                                  <p className="mt-1 text-sm text-muted-foreground">
                                    Update assignment information.
                                  </p>
                                </div>

                                <form
                                  action={updateAssignment}
                                  className="grid gap-4 md:grid-cols-2"
                                >
                                  <input
                                    type="hidden"
                                    name="id"
                                    value={assignment.id}
                                  />

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Module
                                    </label>

                                    <select
                                      name="module_id"
                                      defaultValue={assignment.module_id}
                                      required
                                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                      {(modules ?? []).map((module) => (
                                        <option
                                          key={module.id}
                                          value={module.id}
                                        >
                                          {module.title}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Assignment Title
                                    </label>

                                    <Input
                                      name="title"
                                      defaultValue={assignment.title}
                                      required
                                    />
                                  </div>

                                  <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">
                                      Description
                                    </label>

                                    <textarea
                                      name="description"
                                      defaultValue={
                                        assignment.description ?? ""
                                      }
                                      rows={3}
                                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                  </div>

                                  <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">
                                      Instructions
                                    </label>

                                    <textarea
                                      name="instructions"
                                      defaultValue={
                                        assignment.instructions ?? ""
                                      }
                                      rows={5}
                                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Due Date
                                    </label>

                                    <Input
                                      name="due_date"
                                      type="datetime-local"
                                      defaultValue={
                                        assignment.due_date
                                          ? new Date(
                                              assignment.due_date
                                            )
                                              .toISOString()
                                              .slice(0, 16)
                                          : ""
                                      }
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Max Marks
                                    </label>

                                    <Input
                                      name="max_marks"
                                      type="number"
                                      min="1"
                                      defaultValue={assignment.max_marks}
                                      required
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Attachment URL
                                    </label>

                                    <Input
                                      name="attachment_url"
                                      type="url"
                                      defaultValue={
                                        assignment.attachment_url ?? ""
                                      }
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Assignment Order
                                    </label>

                                    <Input
                                      name="assignment_order"
                                      type="number"
                                      min="1"
                                      defaultValue={
                                        assignment.assignment_order
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
                                      defaultValue={assignment.status}
                                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                      <option value="published">
                                        Published
                                      </option>
                                      <option value="draft">Draft</option>
                                      <option value="closed">Closed</option>
                                    </select>
                                  </div>

                                  <div className="flex gap-2 md:col-span-2">
                                    <Button type="submit">
                                      Save Changes
                                    </Button>

                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() =>
                                        window.history.back()
                                      }
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </details>

                          <form action={deleteAssignment}>
                            <input
                              type="hidden"
                              name="id"
                              value={assignment.id}
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