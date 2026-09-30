import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  createAnnouncement,
  deleteAnnouncement,
} from "./actions";

export const metadata = {
  title: "Announcements",
};

export default async function AnnouncementsPage() {
  const supabase = await createClient();

  const { data: announcements, error: announcementsError } =
    await supabase
      .from("announcements")
      .select(`
        id,
        title,
        message,
        announcement_type,
        target_type,
        program_id,
        published_at,
        status,
        created_at
      `)
      .order("created_at", { ascending: false });

  const { data: programs, error: programsError } =
    await supabase
      .from("programs")
      .select("id, title")
      .order("title", { ascending: true });

  if (announcementsError) {
    console.error(
      "Announcements fetch failed:",
      announcementsError.message
    );
  }

  if (programsError) {
    console.error(
      "Programs fetch failed:",
      programsError.message
    );
  }

  const programMap = new Map(
    (programs ?? []).map((program) => [
      program.id,
      program.title,
    ])
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Announcements
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create and manage announcements for students.
        </p>
      </div>

      {/* Create Announcement */}
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Create Announcement
          </h2>

          <p className="text-sm text-muted-foreground">
            Publish an announcement for all students or a
            specific program.
          </p>
        </div>

        <form
          action={createAnnouncement}
          className="grid gap-5"
        >
          <div className="grid gap-2">
            <label
              htmlFor="title"
              className="text-sm font-medium"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              required
              placeholder="e.g. New Class Schedule"
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="message"
              className="text-sm font-medium"
            >
              Message
            </label>

            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Write your announcement..."
              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="announcement_type"
                className="text-sm font-medium"
              >
                Announcement Type
              </label>

              <select
                id="announcement_type"
                name="announcement_type"
                defaultValue="general"
                className="h-10 rounded-lg border bg-background px-3 text-sm"
              >
                <option value="general">General</option>
                <option value="class">Class</option>
                <option value="assignment">
                  Assignment
                </option>
                <option value="test">Test</option>
                <option value="exam">Exam</option>
                <option value="important">
                  Important
                </option>
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
                defaultValue="published"
                className="h-10 rounded-lg border bg-background px-3 text-sm"
              >
                <option value="published">
                  Published
                </option>

                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="target_type"
                className="text-sm font-medium"
              >
                Target Audience
              </label>

              <select
                id="target_type"
                name="target_type"
                defaultValue="all"
                className="h-10 rounded-lg border bg-background px-3 text-sm"
              >
                <option value="all">
                  All Students
                </option>

                <option value="program">
                  Specific Program
                </option>
              </select>
            </div>

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
                defaultValue=""
                className="h-10 rounded-lg border bg-background px-3 text-sm"
              >
                <option value="">
                  Select Program
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
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="published_at"
              className="text-sm font-medium"
            >
              Publish Date & Time
            </label>

            <input
              id="published_at"
              name="published_at"
              type="datetime-local"
              className="h-10 rounded-lg border bg-background px-3 text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Create Announcement
            </button>
          </div>
        </form>
      </section>

      {/* Announcement List */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">
            All Announcements
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage existing announcements.
          </p>
        </div>

        <div className="divide-y">
          {!announcements ||
          announcements.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {announcementsError
                ? "Unable to load announcements."
                : "No announcements found."}
            </div>
          ) : (
            announcements.map((announcement) => {
              const programTitle = announcement.program_id
                ? programMap.get(
                    announcement.program_id
                  )
                : null;

              return (
                <div
                  key={announcement.id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {announcement.title}
                        </h3>

                        <span className="rounded-full border px-2.5 py-1 text-xs">
                          {announcement.announcement_type}
                        </span>

                        <span className="rounded-full border px-2.5 py-1 text-xs">
                          {announcement.status}
                        </span>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                        {announcement.message}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>
                          Target:{" "}
                          {announcement.target_type ===
                          "all"
                            ? "All Students"
                            : programTitle ??
                              "Specific Program"}
                        </span>

                        {announcement.published_at && (
                          <span>
                            Published:{" "}
                            {new Date(
                              announcement.published_at
                            ).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/admin/announcements/${announcement.id}/edit`}
                        className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        Edit
                      </Link>

                      <form action={deleteAnnouncement}>
                        <input
                          type="hidden"
                          name="id"
                          value={announcement.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}