import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  createCourse,
  deleteCourse,
  updateCourse,
} from "./actions";

export const metadata = {
  title: "Courses",
};

export default async function CoursesPage() {
  const supabase = await createClient();

  const [{ data: courses, error: coursesError }, { data: programs }] =
    await Promise.all([
      supabase
        .from("courses")
        .select(
          "id, title, slug, description, status, program_id, created_at, updated_at"
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("programs")
        .select("id, title")
        .order("title", { ascending: true }),
    ]);

  const programMap = new Map(
    (programs ?? []).map((program) => [program.id, program.title])
  );

  const totalCourses = courses?.length ?? 0;
  const publishedCourses =
    courses?.filter((course) => course.status === "published").length ?? 0;
  const draftCourses =
    courses?.filter((course) => course.status === "draft").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Academy Management
          </p>

          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Courses
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage courses offered through Techlance Academy.
          </p>
        </div>

        <a
          href="#create-course"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Create Course
        </a>
      </div>

      {/* Error */}
      {coursesError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
          Failed to load courses: {coursesError.message}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Courses</p>
          <p className="mt-2 text-2xl font-semibold">{totalCourses}</p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="mt-2 text-2xl font-semibold">{publishedCourses}</p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Drafts</p>
          <p className="mt-2 text-2xl font-semibold">{draftCourses}</p>
        </div>
      </div>

      {/* Create Course */}
      <section
        id="create-course"
        className="rounded-xl border bg-card p-6"
      >
        <div className="mb-5">
          <h2 className="font-display text-lg font-semibold">
            Create Course
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a new course to the academy.
          </p>
        </div>

        <form action={createCourse} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="title"
                className="text-sm font-medium"
              >
                Course Title
              </label>

              <input
                id="title"
                name="title"
                required
                placeholder="e.g. Frontend Web Development"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="slug"
                className="text-sm font-medium"
              >
                Slug
              </label>

              <input
                id="slug"
                name="slug"
                required
                placeholder="frontend-web-development"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

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

          <div className="grid gap-5 md:grid-cols-2">
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
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">No program</option>

                {(programs ?? []).map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </select>
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
                defaultValue="draft"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Course
            </button>
          </div>
        </form>
      </section>

      {/* Courses List */}
      <section className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="font-display text-lg font-semibold">
            All Courses
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your academy courses.
          </p>
        </div>

        {courses && courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="px-6 py-4 font-medium">Course</th>
                  <th className="px-6 py-4 font-medium">Program</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {course.title}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          /{course.slug}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {course.program_id
                        ? programMap.get(course.program_id) ??
                          "Unknown program"
                        : "No program"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                        {course.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(course.created_at).toLocaleDateString()}
                    </td>

                   <td className="px-6 py-4">
  <div className="flex justify-end gap-2">
    <details className="relative">
      <summary className="cursor-pointer list-none rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">
        Edit
      </summary>

      <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border bg-background p-4 shadow-lg">
        <form action={updateCourse} className="grid gap-4">
          <input
            type="hidden"
            name="id"
            value={course.id}
          />

          <div className="grid gap-2">
            <label className="text-xs font-medium">
              Course Title
            </label>

            <input
              name="title"
              defaultValue={course.title}
              required
              className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-medium">
              Slug
            </label>

            <input
              name="slug"
              defaultValue={course.slug}
              required
              className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-medium">
              Description
            </label>

            <textarea
              name="description"
              defaultValue={course.description ?? ""}
              rows={3}
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-medium">
              Program
            </label>

            <select
              name="program_id"
              defaultValue={course.program_id ?? ""}
              className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">No program</option>

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

          <div className="grid gap-2">
            <label className="text-xs font-medium">
              Status
            </label>

            <select
              name="status"
              defaultValue={course.status}
              className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
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

    <form action={deleteCourse}>
      <input
        type="hidden"
        name="id"
        value={course.id}
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
            <p className="font-medium">No courses yet</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Create your first course using the form above.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}