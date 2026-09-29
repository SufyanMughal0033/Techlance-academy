import {
  createModule,
  deleteModule,
  updateModule,
} from "./actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Modules",
};

export default async function ModulesPage() {
  const supabase = await createClient();

  const [{ data: modules, error: modulesError }, { data: programs }] =
    await Promise.all([
      supabase
        .from("modules")
        .select(
          "id, program_id, title, description, module_order, status, created_at, updated_at"
        )
        .order("module_order", { ascending: true }),

      supabase
        .from("programs")
        .select("id, title")
        .order("title", { ascending: true }),
    ]);

  const programMap = new Map(
    (programs ?? []).map((program) => [program.id, program.title])
  );

  const totalModules = modules?.length ?? 0;

  const activeModules =
    modules?.filter((module) => module.status === "active").length ?? 0;

  const inactiveModules =
    modules?.filter((module) => module.status === "inactive").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Academy Management
          </p>

          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Modules
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Organize learning modules inside your academy programs.
          </p>
        </div>

        <a
          href="#create-module"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Create Module
        </a>
      </div>

      {/* Error */}
      {modulesError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
          Failed to load modules: {modulesError.message}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Modules
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {totalModules}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Active
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {activeModules}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Inactive
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {inactiveModules}
          </p>
        </div>
      </div>

      {/* Create Module */}
      <section
        id="create-module"
        className="rounded-xl border bg-card p-6"
      >
        <div className="mb-5">
          <h2 className="font-display text-lg font-semibold">
            Create Module
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a module to an existing program.
          </p>
        </div>

        <form action={createModule} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Program */}
            <div className="grid gap-2">
              <label
                htmlFor="program_id"
                className="text-sm font-medium"
              >
                Program
              </label>

              <select
                id="program_id"
                name="program_id"
                required
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">
                  Select program
                </option>

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

            {/* Title */}
            <div className="grid gap-2">
              <label
                htmlFor="title"
                className="text-sm font-medium"
              >
                Module Title
              </label>

              <input
                id="title"
                name="title"
                required
                placeholder="e.g. HTML & CSS Fundamentals"
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
              rows={4}
              placeholder="Write a short description..."
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Order + Status */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="module_order"
                className="text-sm font-medium"
              >
                Module Order
              </label>

              <input
                id="module_order"
                name="module_order"
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
                defaultValue="active"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Module
            </button>
          </div>
        </form>
      </section>

      {/* Modules List */}
      <section className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="font-display text-lg font-semibold">
            All Modules
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage modules and their order inside programs.
          </p>
        </div>

        {modules && modules.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="px-6 py-4 font-medium">
                    #
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Module
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Program
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Created
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {modules.map((module) => (
                  <tr
                    key={module.id}
                    className="border-b last:border-0"
                  >
                    <td className="px-6 py-4 font-medium">
                      {module.module_order}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {module.title}
                        </p>

                        {module.description && (
                          <p className="mt-1 max-w-md truncate text-xs text-muted-foreground">
                            {module.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {programMap.get(module.program_id) ??
                        "Unknown program"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                        {module.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(
                        module.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {/* Edit */}
                        <details className="relative">
                          <summary className="cursor-pointer list-none rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                            Edit
                          </summary>

                          <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border bg-background p-4 shadow-lg">
                            <form
                              action={updateModule}
                              className="grid gap-4"
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={module.id}
                              />

                              {/* Program */}
                              <div className="grid gap-2">
                                <label className="text-xs font-medium">
                                  Program
                                </label>

                                <select
                                  name="program_id"
                                  defaultValue={
                                    module.program_id
                                  }
                                  required
                                  className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                >
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

                              {/* Title */}
                              <div className="grid gap-2">
                                <label className="text-xs font-medium">
                                  Module Title
                                </label>

                                <input
                                  name="title"
                                  defaultValue={
                                    module.title
                                  }
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
                                    module.description ?? ""
                                  }
                                  rows={3}
                                  className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>

                              {/* Order */}
                              <div className="grid gap-2">
                                <label className="text-xs font-medium">
                                  Module Order
                                </label>

                                <input
                                  name="module_order"
                                  type="number"
                                  min="1"
                                  defaultValue={
                                    module.module_order
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
                                  defaultValue={
                                    module.status
                                  }
                                  className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                >
                                  <option value="active">
                                    Active
                                  </option>

                                  <option value="inactive">
                                    Inactive
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
                        <form action={deleteModule}>
                          <input
                            type="hidden"
                            name="id"
                            value={module.id}
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
              No modules yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Create your first module using the form above.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}