import { Card, CardContent } from "@/components/ui/card";
import {
  createResource,
  updateResource,
  deleteResource,
} from "./actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Resources",
};

export default async function Page() {
  const supabase = await createClient();

  const { data: resources, error } = await supabase
    .from("resources")
    .select("*")
    .order("resource_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const total = resources?.length ?? 0;
  const published =
    resources?.filter((item) => item.status === "published").length ?? 0;
  const drafts =
    resources?.filter((item) => item.status === "draft").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Resources
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Manage useful links, websites, tools, videos, articles and other
          learning resources for Techlance Academy.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Resources</p>
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

      {/* Create Resource */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-5">
            <h3 className="font-display text-lg font-semibold">
              Add Resource
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Add a useful external resource for students.
            </p>
          </div>

          <form action={createResource} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Title
                </label>

                <input
                  name="title"
                  required
                  placeholder="e.g. React Documentation"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Resource Type
                </label>

                <select
                  name="resource_type"
                  defaultValue="link"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="link">Link</option>
                  <option value="website">Website</option>
                  <option value="tool">Tool</option>
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                  <option value="document">Document</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                URL
              </label>

              <input
                name="url"
                type="url"
                required
                placeholder="https://example.com"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Thumbnail URL
              </label>

              <input
                name="thumbnail_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                rows={3}
                placeholder="Short description of this resource..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Order
                </label>

                <input
                  name="resource_order"
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
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

            <button
              type="submit"
              className="w-fit rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
            >
              Add Resource
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Resources List */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold">
            All Resources
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Edit or remove existing resources.
          </p>
        </div>

        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="p-6">
                <form
                  action={updateResource}
                  className="grid gap-4"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={resource.id}
                  />

                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h4 className="font-semibold">
                        {resource.title}
                      </h4>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {resource.resource_type} • Order{" "}
                        {resource.resource_order}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                        resource.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {resource.status}
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
                        defaultValue={resource.title}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Resource Type
                      </label>

                      <select
                        name="resource_type"
                        defaultValue={resource.resource_type}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      >
                        <option value="link">Link</option>
                        <option value="website">Website</option>
                        <option value="tool">Tool</option>
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                        <option value="document">Document</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      URL
                    </label>

                    <input
                      name="url"
                      type="url"
                      required
                      defaultValue={resource.url}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Thumbnail URL
                    </label>

                    <input
                      name="thumbnail_url"
                      type="url"
                      defaultValue={resource.thumbnail_url ?? ""}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Description
                    </label>

                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={resource.description ?? ""}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Order
                      </label>

                      <input
                        name="resource_order"
                        type="number"
                        min="1"
                        defaultValue={resource.resource_order}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Status
                      </label>

                      <select
                        name="status"
                        defaultValue={resource.status}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      Save Changes
                    </button>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border px-4 py-2 text-sm font-medium"
                    >
                      Open Resource
                    </a>
                  </div>
                </form>

                <form
                  action={deleteResource}
                  className="mt-3"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={resource.id}
                  />

                  <button
                    type="submit"
                    className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Delete Resource
                  </button>
                </form>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No resources found. Add your first resource above.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}