
import Link from "next/link";

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
    assignments?.filter((a) => a.status === "published").length ?? 0;

  const draftAssignments =
    assignments?.filter((a) => a.status === "draft").length ?? 0;

  const closedAssignments =
    assignments?.filter((a) => a.status === "closed").length ?? 0;

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
        {[
          { label: "Total Assignments", value: totalAssignments },
          { label: "Published", value: publishedAssignments },
          { label: "Draft", value: draftAssignments },
          { label: "Closed", value: closedAssignments },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
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
                defaultValue=""
              >
                <option value="" disabled>
                  Select module
                </option>
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
              <Input name="due_date" type="datetime-local" />
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
              <p className="text-xs text-muted-foreground">
                Optional: paste an existing attachment link.
              </p>
            </div>

           
<div className="space-y-3 md:col-span-2">
  <div className="space-y-1.5">
    <label
      htmlFor="attachment_file"
      className="block text-sm font-semibold text-foreground"
    >
      Upload Assignment File
    </label>

    <p className="text-xs leading-5 text-muted-foreground">
      Attach your assignment resources for students to download.
    </p>
  </div>

  <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-5 transition-colors hover:border-primary/50 hover:bg-muted/40 sm:p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M20 16.5v2A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-2" />
        </svg>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-sm font-medium text-foreground">
          Choose a file from your computer
        </p>

        <Input
          id="attachment_file"
          name="attachment_file"
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.png,.jpg,.jpeg"
          className="h-auto cursor-pointer border-border bg-background py-2 text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground"
        />

        <p className="text-xs leading-5 text-muted-foreground">
          PDF, DOC, DOCX, PPT, PPTX, ZIP, PNG or JPG · Max 20 MB
        </p>
      </div>
    </div>
  </div>
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
                    <th className="px-4 py-3 font-medium">Attachment</th>
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
                        {moduleMap.get(assignment.module_id) ?? "Unknown Module"}
                      </td>

                      <td className="px-4 py-4">{assignment.max_marks}</td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {assignment.due_date
                          ? new Date(assignment.due_date).toLocaleString()
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
                        {assignment.attachment_url ? (
                          <a
                            href={assignment.attachment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            View file
                          </a>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
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

                            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                              <div className="my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border bg-background p-6 shadow-lg">
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
                                      defaultValue={assignment.description ?? ""}
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
                                      defaultValue={assignment.instructions ?? ""}
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
                                          ? new Date(assignment.due_date)
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
                                      defaultValue={assignment.attachment_url ?? ""}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Upload a new file below to replace the
                                      existing attachment.
                                    </p>
                                  </div>

                                  <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">
                                      Upload New PDF / Assignment File
                                    </label>
                                    <Input
                                      name="attachment_file"
                                      type="file"
                                      accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.png,.jpg,.jpeg"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Optional. Leave empty to keep the current
                                      attachment. Maximum size: 20 MB.
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Assignment Order
                                    </label>
                                    <Input
                                      name="assignment_order"
                                      type="number"
                                      min="1"
                                      defaultValue={assignment.assignment_order}
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
                                      <option value="published">Published</option>
                                      <option value="draft">Draft</option>
                                      <option value="closed">Closed</option>
                                    </select>
                                  </div>

                                  <div className="flex flex-wrap gap-2 md:col-span-2">
                                    <Button type="submit">Save Changes</Button>
                                    <Link
                                      href="/admin/assignments"
                                      className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                    >
                                      Cancel
                                    </Link>
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
