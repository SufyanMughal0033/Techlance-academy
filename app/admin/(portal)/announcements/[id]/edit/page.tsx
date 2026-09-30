import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateAnnouncement } from "../../actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata = {
  title: "Edit Announcement",
};

export default async function EditAnnouncementPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const [{ data: announcement }, { data: programs }] =
    await Promise.all([
      supabase
        .from("announcements")
        .select("*")
        .eq("id", id)
        .single(),

      supabase
        .from("programs")
        .select("id, title")
        .order("title", { ascending: true }),
    ]);

  if (!announcement) {
    notFound();
  }

  const publishedAt = announcement.published_at
    ? new Date(announcement.published_at)
        .toISOString()
        .slice(0, 16)
    : "";

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/announcements"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Announcements
        </Link>

        <h1 className="mt-3 font-display text-2xl font-semibold">
          Edit Announcement
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Update the announcement details and target audience.
        </p>
      </div>

      {/* Form */}
      <section className="max-w-3xl rounded-2xl border bg-card p-6 shadow-sm">
        <form
          action={updateAnnouncement}
          className="grid gap-5"
        >
          <input
            type="hidden"
            name="id"
            value={announcement.id}
          />

          {/* Title */}
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
              defaultValue={announcement.title ?? ""}
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2"
            />
          </div>

          {/* Message */}
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
              rows={6}
              defaultValue={announcement.message ?? ""}
              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          {/* Type + Status */}
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
                defaultValue={
                  announcement.announcement_type ?? "general"
                }
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
                defaultValue={announcement.status ?? "published"}
                className="h-10 rounded-lg border bg-background px-3 text-sm"
              >
                <option value="published">
                  Published
                </option>

                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Target + Program */}
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
                defaultValue={
                  announcement.target_type ?? "all"
                }
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
                defaultValue={
                  announcement.program_id ?? ""
                }
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

          {/* Publish Date */}
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
              defaultValue={publishedAt}
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Save Changes
            </button>

            <Link
              href="/admin/announcements"
              className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}