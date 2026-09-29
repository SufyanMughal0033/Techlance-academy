import {
  createClass,
  deleteClass,
  updateClass,
} from "./actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Classes",
};

export default async function ClassesPage() {
  const supabase = await createClient();

  const [{ data: classes, error: classesError }, { data: modules }] =
    await Promise.all([
      supabase
        .from("classes")
        .select(
          "id, module_id, title, description, class_date, start_time, end_time, meeting_url, recording_url, class_order, status, created_at, updated_at"
        )
        .order("class_order", { ascending: true }),

      supabase
        .from("modules")
        .select("id, title")
        .order("module_order", { ascending: true }),
    ]);

  const moduleMap = new Map(
    (modules ?? []).map((module) => [module.id, module.title])
  );

  const totalClasses = classes?.length ?? 0;

  const scheduledClasses =
    classes?.filter((item) => item.status === "scheduled").length ?? 0;

  const liveClasses =
    classes?.filter((item) => item.status === "live").length ?? 0;

  const completedClasses =
    classes?.filter((item) => item.status === "completed").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Academy Management
          </p>

          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Classes
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Schedule and manage live classes for your academy modules.
          </p>
        </div>

        <a
          href="#create-class"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Create Class
        </a>
      </div>

      {/* Error */}
      {classesError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
          Failed to load classes: {classesError.message}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Classes
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {totalClasses}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Scheduled
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {scheduledClasses}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Live
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {liveClasses}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Completed
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {completedClasses}
          </p>
        </div>
      </div>

      {/* Create Class */}
      <section
        id="create-class"
        className="rounded-xl border bg-card p-6"
      >
        <div className="mb-5">
          <h2 className="font-display text-lg font-semibold">
            Create Class
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a scheduled class to an existing module.
          </p>
        </div>

        <form action={createClass} className="grid gap-5">
          {/* Module + Title */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="module_id"
                className="text-sm font-medium"
              >
                Module
              </label>

              <select
                id="module_id"
                name="module_id"
                required
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">
                  Select module
                </option>

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

            <div className="grid gap-2">
              <label
                htmlFor="title"
                className="text-sm font-medium"
              >
                Class Title
              </label>

              <input
                id="title"
                name="title"
                required
                placeholder="e.g. Introduction to HTML"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label
              htmlFor="description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Write a short description..."
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Date + Times */}
          <div className="grid gap-5 md:grid-cols-3">
            <div className="grid gap-2">
              <label
                htmlFor="class_date"
                className="text-sm font-medium"
              >
                Class Date
              </label>

              <input
                id="class_date"
                name="class_date"
                type="date"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="start_time"
                className="text-sm font-medium"
              >
                Start Time
              </label>

              <input
                id="start_time"
                name="start_time"
                type="time"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="end_time"
                className="text-sm font-medium"
              >
                End Time
              </label>

              <input
                id="end_time"
                name="end_time"
                type="time"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Meeting + Recording */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="meeting_url"
                className="text-sm font-medium"
              >
                Meeting URL
              </label>

              <input
                id="meeting_url"
                name="meeting_url"
                type="url"
                placeholder="https://meet.google.com/..."
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="recording_url"
                className="text-sm font-medium"
              >
                Recording URL
              </label>

              <input
                id="recording_url"
                name="recording_url"
                type="url"
                placeholder="https://..."
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Order + Status */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="class_order"
                className="text-sm font-medium"
              >
                Class Order
              </label>

              <input
                id="class_order"
                name="class_order"
                type="number"
                min="1"
                defaultValue="1"
                required
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="status"
                className="text-sm font-medium"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue="scheduled"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="scheduled">
                  Scheduled
                </option>

                <option value="live">
                  Live
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Class
            </button>
          </div>
        </form>
      </section>

      {/* Classes List */}
      <section className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="font-display text-lg font-semibold">
            All Classes
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage scheduled, live and completed classes.
          </p>
        </div>

        {classes && classes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="px-6 py-4 font-medium">
                    #
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Class
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Module
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Date
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Time
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {classes.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-0"
                  >
                    <td className="px-6 py-4 font-medium">
                      {item.class_order}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {item.title}
                        </p>

                        {item.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {moduleMap.get(item.module_id) ??
                        "Unknown module"}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {item.class_date
                        ? new Date(
                            `${item.class_date}T00:00:00`
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {item.start_time
                        ? `${item.start_time}${
                            item.end_time
                              ? ` - ${item.end_time}`
                              : ""
                          }`
                        : "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {/* Edit */}
                        <details className="relative">
                          <summary className="cursor-pointer list-none rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                            Edit
                          </summary>

                          <div className="absolute right-0 z-20 mt-2 w-96 rounded-lg border bg-background p-4 shadow-lg">
                            <form
                              action={updateClass}
                              className="grid gap-4"
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={item.id}
                              />

                              {/* Module */}
                              <div className="grid gap-2">
                                <label className="text-xs font-medium">
                                  Module
                                </label>

                                <select
                                  name="module_id"
                                  defaultValue={item.module_id}
                                  required
                                  className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                >
                                  {(modules ?? []).map(
                                    (module) => (
                                      <option
                                        key={module.id}
                                        value={module.id}
                                      >
                                        {module.title}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>

                              {/* Title */}
                              <div className="grid gap-2">
                                <label className="text-xs font-medium">
                                  Class Title
                                </label>

                                <input
                                  name="title"
                                  defaultValue={item.title}
                                  required
                                  className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>

                              {/* Description */}
                              <div className="grid gap-2">
                                <label className="text-xs font-medium">
                                  Description
                                </label>

                                <textarea
                                  name="description"
                                  defaultValue={
                                    item.description ?? ""
                                  }
                                  rows={3}
                                  className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>

                              {/* Date */}
                              <div className="grid gap-2">
                                <label className="text-xs font-medium">
                                  Class Date
                                </label>

                                <input
                                  name="class_date"
                                  type="date"
                                  defaultValue={
                                    item.class_date ?? ""
                                  }
                                  className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>

                              {/* Times */}
                              <div className="grid gap-3 grid-cols-2">
                                <div className="grid gap-2">
                                  <label className="text-xs font-medium">
                                    Start Time
                                  </label>

                                  <input
                                    name="start_time"
                                    type="time"
                                    defaultValue={
                                      item.start_time ?? ""
                                    }
                                    className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                  />
                                </div>

                                <div className="grid gap-2">
                                  <label className="text-xs font-medium">
                                    End Time
                                  </label>

                                  <input
                                    name="end_time"
                                    type="time"
                                    defaultValue={
                                      item.end_time ?? ""
                                    }
                                    className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                  />
                                </div>
                              </div>

                              {/* Meeting */}
                              <div className="grid gap-2">
                                <label className="text-xs font-medium">
                                  Meeting URL
                                </label>

                                <input
                                  name="meeting_url"
                                  type="url"
                                  defaultValue={
                                    item.meeting_url ?? ""
                                  }
                                  className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>

                              {/* Recording */}
                              <div className="grid gap-2">
                                <label className="text-xs font-medium">
                                  Recording URL
                                </label>

                                <input
                                  name="recording_url"
                                  type="url"
                                  defaultValue={
                                    item.recording_url ?? ""
                                  }
                                  className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>

                              {/* Order */}
                              <div className="grid gap-2">
                                <label className="text-xs font-medium">
                                  Class Order
                                </label>

                                <input
                                  name="class_order"
                                  type="number"
                                  min="1"
                                  defaultValue={
                                    item.class_order
                                  }
                                  required
                                  className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>

                              {/* Status */}
                              <div className="grid gap-2">
                                <label className="text-xs font-medium">
                                  Status
                                </label>

                                <select
                                  name="status"
                                  defaultValue={item.status}
                                  className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                >
                                  <option value="scheduled">
                                    Scheduled
                                  </option>

                                  <option value="live">
                                    Live
                                  </option>

                                  <option value="completed">
                                    Completed
                                  </option>
                                </select>
                              </div>

                              <button
                                type="submit"
                                className="h-9 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                              >
                                Save Changes
                              </button>
                            </form>
                          </div>
                        </details>

                        {/* Delete */}
                        <form action={deleteClass}>
                          <input
                            type="hidden"
                            name="id"
                            value={item.id}
                          />

                          <button
                            type="submit"
                            className="rounded-md border px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <p className="font-medium">
              No classes yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Create your first class using the form above.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}