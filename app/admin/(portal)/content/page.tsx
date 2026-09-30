import { Card, CardContent } from "@/components/ui/card";
import {
  createContent,
  updateContent,
  deleteContent,
} from "./actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Content",
};

export default async function Page() {
  const supabase = await createClient();

  const { data: contents, error } = await supabase
    .from("content")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const total = contents?.length ?? 0;
  const published =
    contents?.filter((item) => item.status === "published").length ?? 0;
  const drafts =
    contents?.filter((item) => item.status === "draft").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Content
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Manage website pages, sections, announcements, course content and
          other reusable Academy content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Content</p>
            <p className="mt-2 text-2xl font-semibold">{total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Published</p>
            <p className="mt-2 text-2xl font-semibold">{published}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Drafts</p>
            <p className="mt-2 text-2xl font-semibold">{drafts}</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Content */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-5">
            <h3 className="font-display text-lg font-semibold">
              Add Content
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Create a new reusable content item.
            </p>
          </div>

          <form action={createContent} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Title
                </label>

                <input
                  name="title"
                  required
                  placeholder="e.g. About Techlance Academy"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Slug
                </label>

                <input
                  name="slug"
                  required
                  placeholder="about-techlance-academy"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Content Type
                </label>

                <select
                  name="content_type"
                  defaultValue="page"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="page">Page</option>
                  <option value="section">Section</option>
                  <option value="announcement">Announcement</option>
                  <option value="course">Course</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  name="status"
                  defaultValue="published"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Excerpt
              </label>

              <textarea
                name="excerpt"
                rows={2}
                placeholder="Short summary..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Content
              </label>

              <textarea
                name="content"
                rows={7}
                placeholder="Write your content here..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Image URL
              </label>

              <input
                name="image_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-fit rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
            >
              Add Content
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Content */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold">
            All Content
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Edit or delete existing content items.
          </p>
        </div>

        {contents && contents.length > 0 ? (
          contents.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <form action={updateContent} className="grid gap-4">
                  <input
                    type="hidden"
                    name="id"
                    value={item.id}
                  />

                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.content_type} • /{item.slug}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Title
                      </label>

                      <input
                        name="title"
                        required
                        defaultValue={item.title}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Slug
                      </label>

                      <input
                        name="slug"
                        required
                        defaultValue={item.slug}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Content Type
                      </label>

                      <select
                        name="content_type"
                        defaultValue={item.content_type}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      >
                        <option value="page">Page</option>
                        <option value="section">Section</option>
                        <option value="announcement">
                          Announcement
                        </option>
                        <option value="course">Course</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Status
                      </label>

                      <select
                        name="status"
                        defaultValue={item.status}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Excerpt
                    </label>

                    <textarea
                      name="excerpt"
                      rows={2}
                      defaultValue={item.excerpt ?? ""}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Content
                    </label>

                    <textarea
                      name="content"
                      rows={7}
                      defaultValue={item.content ?? ""}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Image URL
                    </label>

                    <input
                      name="image_url"
                      type="url"
                      defaultValue={item.image_url ?? ""}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-fit rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Save Changes
                  </button>
                </form>

                <form action={deleteContent} className="mt-3">
                  <input
                    type="hidden"
                    name="id"
                    value={item.id}
                  />

                  <button
                    type="submit"
                    className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Delete Content
                  </button>
                </form>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No content found. Add your first content item above.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}