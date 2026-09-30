import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "./actions";

export const metadata = {
  title: "Blog",
};

export default async function BlogAdminPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, content, featured_image, category, tags, seo_title, seo_description, status, published_at, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  const totalPosts = posts?.length ?? 0;

  const publishedPosts =
    posts?.filter((post) => post.status === "published").length ?? 0;

  const draftPosts =
    posts?.filter((post) => post.status === "draft").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Blog
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Create and manage Techlance Academy blog posts.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Posts
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {totalPosts}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Published
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {publishedPosts}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Drafts
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {draftPosts}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Post */}
      <Card>
        <CardHeader>
          <CardTitle>Create Blog Post</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            action={createBlogPost}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Title
              </label>

              <Input
                name="title"
                placeholder="e.g. How AI Is Changing Web Development"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Slug
              </label>

              <Input
                name="slug"
                placeholder="how-ai-is-changing-web-development"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category
              </label>

              <Input
                name="category"
                placeholder="Web Development"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Excerpt
              </label>

              <textarea
                name="excerpt"
                rows={3}
                placeholder="Short summary of the blog post..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Content
              </label>

              <textarea
                name="content"
                rows={12}
                placeholder="Write the complete blog content here..."
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Featured Image URL
              </label>

              <Input
                name="featured_image"
                type="url"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tags
              </label>

              <Input
                name="tags"
                placeholder="AI, React, Web Development"
              />

              <p className="text-xs text-muted-foreground">
                Separate tags with commas.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                SEO Title
              </label>

              <Input
                name="seo_title"
                placeholder="SEO optimized title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                SEO Description
              </label>

              <Input
                name="seo_description"
                placeholder="SEO meta description"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Publish Date
              </label>

              <Input
                name="published_at"
                type="datetime-local"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status
              </label>

              <select
                name="status"
                defaultValue="draft"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Button type="submit">
                Create Blog Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="py-10 text-center text-sm text-destructive">
              Failed to load blog posts: {error.message}
            </div>
          ) : !posts?.length ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No blog posts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">
                      Title
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Category
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Status
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Published
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Created
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b last:border-0"
                    >
                      {/* Title */}
                      <td className="px-4 py-4">
                        <div className="font-medium">
                          {post.title}
                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">
                          /blog/{post.slug}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 text-muted-foreground">
                        {post.category ?? "Uncategorized"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                          {post.status}
                        </span>
                      </td>

                      {/* Published */}
                      <td className="px-4 py-4 text-muted-foreground">
                        {post.published_at
                          ? new Date(
                              post.published_at
                            ).toLocaleString()
                          : "Not published"}
                      </td>

                      {/* Created */}
                      <td className="px-4 py-4 text-muted-foreground">
                        {new Date(
                          post.created_at
                        ).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {/* Edit */}
                          <details>
                            <summary className="inline-flex h-9 cursor-pointer list-none items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-muted">
                              Edit
                            </summary>

                            {/* Edit Modal */}
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                              <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border bg-background p-6 shadow-lg">
                                <div className="mb-5">
                                  <h3 className="text-lg font-semibold">
                                    Edit Blog Post
                                  </h3>

                                  <p className="mt-1 text-sm text-muted-foreground">
                                    Update this blog post.
                                  </p>
                                </div>

                                <form
                                  action={updateBlogPost}
                                  className="grid gap-4 md:grid-cols-2"
                                >
                                  <input
                                    type="hidden"
                                    name="id"
                                    value={post.id}
                                  />

                                  {/* Title */}
                                  <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">
                                      Title
                                    </label>

                                    <Input
                                      name="title"
                                      defaultValue={post.title}
                                      required
                                    />
                                  </div>

                                  {/* Slug */}
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Slug
                                    </label>

                                    <Input
                                      name="slug"
                                      defaultValue={post.slug}
                                      required
                                    />
                                  </div>

                                  {/* Category */}
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Category
                                    </label>

                                    <Input
                                      name="category"
                                      defaultValue={
                                        post.category ?? ""
                                      }
                                    />
                                  </div>

                                  {/* Excerpt */}
                                  <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">
                                      Excerpt
                                    </label>

                                    <textarea
                                      name="excerpt"
                                      defaultValue={
                                        post.excerpt ?? ""
                                      }
                                      rows={3}
                                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                  </div>

                                  {/* Content */}
                                  <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">
                                      Content
                                    </label>

                                    <textarea
                                      name="content"
                                      defaultValue={post.content}
                                      rows={12}
                                      required
                                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                  </div>

                                  {/* Featured Image */}
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Featured Image URL
                                    </label>

                                    <Input
                                      name="featured_image"
                                      type="url"
                                      defaultValue={
                                        post.featured_image ?? ""
                                      }
                                    />
                                  </div>

                                  {/* Tags */}
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Tags
                                    </label>

                                    <Input
                                      name="tags"
                                      defaultValue={
                                        post.tags?.join(", ") ?? ""
                                      }
                                    />
                                  </div>

                                  {/* SEO Title */}
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      SEO Title
                                    </label>

                                    <Input
                                      name="seo_title"
                                      defaultValue={
                                        post.seo_title ?? ""
                                      }
                                    />
                                  </div>

                                  {/* SEO Description */}
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      SEO Description
                                    </label>

                                    <Input
                                      name="seo_description"
                                      defaultValue={
                                        post.seo_description ?? ""
                                      }
                                    />
                                  </div>

                                  {/* Publish Date */}
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Publish Date
                                    </label>

                                    <Input
                                      name="published_at"
                                      type="datetime-local"
                                      defaultValue={
                                        post.published_at
                                          ? new Date(
                                              post.published_at
                                            )
                                              .toISOString()
                                              .slice(0, 16)
                                          : ""
                                      }
                                    />
                                  </div>

                                  {/* Status */}
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Status
                                    </label>

                                    <select
                                      name="status"
                                      defaultValue={post.status}
                                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                      <option value="draft">
                                        Draft
                                      </option>

                                      <option value="published">
                                        Published
                                      </option>
                                    </select>
                                  </div>

                                  {/* Buttons */}
                                  <div className="flex gap-2 md:col-span-2">
                                    <Button type="submit">
                                      Save Changes
                                    </Button>

                                    <a
                                      href="/admin/blog"
                                      className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                    >
                                      Cancel
                                    </a>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </details>

                          {/* Delete */}
                          <form action={deleteBlogPost}>
                            <input
                              type="hidden"
                              name="id"
                              value={post.id}
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