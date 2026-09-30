import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from "./actions";

export const metadata = {
  title: "Testimonials",
};

export const revalidate = 0;

export default async function Page() {
  const supabase = await createClient();

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select(
      "id, name, role, company, content, rating, avatar_url, display_order, status, created_at, updated_at"
    )
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Failed to load testimonials: ${error.message}`
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Testimonials
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Create and manage student and client testimonials displayed
          across the Techlance Academy website.
        </p>
      </div>

      {/* Create Testimonial */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Add New Testimonial
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            action={createTestimonial}
            className="flex flex-col gap-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Muhammad Ali"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium"
                >
                  Role / Designation
                </label>

                <input
                  id="role"
                  name="role"
                  type="text"
                  placeholder="Frontend Developer"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-medium"
                >
                  Company
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="ABC Software House"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              {/* Avatar */}
              <div>
                <label
                  htmlFor="avatar_url"
                  className="mb-2 block text-sm font-medium"
                >
                  Profile Image URL
                </label>

                <input
                  id="avatar_url"
                  name="avatar_url"
                  type="url"
                  placeholder="https://example.com/profile.jpg"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              {/* Rating */}
              <div>
                <label
                  htmlFor="rating"
                  className="mb-2 block text-sm font-medium"
                >
                  Rating
                </label>

                <select
                  id="rating"
                  name="rating"
                  defaultValue="5"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              {/* Display Order */}
              <div>
                <label
                  htmlFor="display_order"
                  className="mb-2 block text-sm font-medium"
                >
                  Display Order
                </label>

                <input
                  id="display_order"
                  name="display_order"
                  type="number"
                  min="0"
                  defaultValue="0"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue="published"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Content */}
              <div className="md:col-span-2">
                <label
                  htmlFor="content"
                  className="mb-2 block text-sm font-medium"
                >
                  Testimonial
                </label>

                <textarea
                  id="content"
                  name="content"
                  required
                  rows={6}
                  placeholder="Write what the student or client said about Techlance Academy..."
                  className="flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Add Testimonial
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            All Testimonials ({testimonials?.length ?? 0})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!testimonials || testimonials.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
              No testimonials have been created yet.
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-4">
                        {testimonial.avatar_url ? (
                          <img
                            src={testimonial.avatar_url}
                            alt={testimonial.name}
                            className="h-12 w-12 shrink-0 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {testimonial.name
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-foreground">
                              {testimonial.name}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                testimonial.status === "published"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {testimonial.status === "published"
                                ? "Published"
                                : "Draft"}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {testimonial.role || "Student"}
                            {testimonial.company
                              ? ` · ${testimonial.company}`
                              : ""}
                          </p>

                          <div className="mt-2 text-sm tracking-wide text-amber-500">
                            {"★".repeat(testimonial.rating)}
                            <span className="text-muted-foreground">
                              {"★".repeat(5 - testimonial.rating)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <blockquote className="mt-5 rounded-xl bg-muted/40 p-4 text-sm leading-7 text-muted-foreground">
                        “{testimonial.content}”
                      </blockquote>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-muted px-2.5 py-1">
                          Order #{testimonial.display_order}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2">
                      <details>
                        <summary className="inline-flex h-9 cursor-pointer list-none items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition hover:bg-muted">
                          Edit
                        </summary>

                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
                          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl">
                            <div className="mb-6">
                              <h3 className="text-lg font-semibold">
                                Edit Testimonial
                              </h3>

                              <p className="mt-1 text-sm text-muted-foreground">
                                Update this testimonial.
                              </p>
                            </div>

                            <form
                              action={updateTestimonial}
                              className="flex flex-col gap-5"
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={testimonial.id}
                              />

                              <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                  <label
                                    htmlFor={`edit-name-${testimonial.id}`}
                                    className="mb-2 block text-sm font-medium"
                                  >
                                    Name
                                  </label>

                                  <input
                                    id={`edit-name-${testimonial.id}`}
                                    name="name"
                                    type="text"
                                    required
                                    defaultValue={testimonial.name}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`edit-role-${testimonial.id}`}
                                    className="mb-2 block text-sm font-medium"
                                  >
                                    Role / Designation
                                  </label>

                                  <input
                                    id={`edit-role-${testimonial.id}`}
                                    name="role"
                                    type="text"
                                    defaultValue={
                                      testimonial.role ?? ""
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`edit-company-${testimonial.id}`}
                                    className="mb-2 block text-sm font-medium"
                                  >
                                    Company
                                  </label>

                                  <input
                                    id={`edit-company-${testimonial.id}`}
                                    name="company"
                                    type="text"
                                    defaultValue={
                                      testimonial.company ?? ""
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`edit-avatar-${testimonial.id}`}
                                    className="mb-2 block text-sm font-medium"
                                  >
                                    Profile Image URL
                                  </label>

                                  <input
                                    id={`edit-avatar-${testimonial.id}`}
                                    name="avatar_url"
                                    type="url"
                                    defaultValue={
                                      testimonial.avatar_url ?? ""
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`edit-rating-${testimonial.id}`}
                                    className="mb-2 block text-sm font-medium"
                                  >
                                    Rating
                                  </label>

                                  <select
                                    id={`edit-rating-${testimonial.id}`}
                                    name="rating"
                                    defaultValue={String(
                                      testimonial.rating
                                    )}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                  >
                                    <option value="5">
                                      5 Stars
                                    </option>
                                    <option value="4">
                                      4 Stars
                                    </option>
                                    <option value="3">
                                      3 Stars
                                    </option>
                                    <option value="2">
                                      2 Stars
                                    </option>
                                    <option value="1">
                                      1 Star
                                    </option>
                                  </select>
                                </div>

                                <div>
                                  <label
                                    htmlFor={`edit-order-${testimonial.id}`}
                                    className="mb-2 block text-sm font-medium"
                                  >
                                    Display Order
                                  </label>

                                  <input
                                    id={`edit-order-${testimonial.id}`}
                                    name="display_order"
                                    type="number"
                                    min="0"
                                    defaultValue={
                                      testimonial.display_order
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`edit-status-${testimonial.id}`}
                                    className="mb-2 block text-sm font-medium"
                                  >
                                    Status
                                  </label>

                                  <select
                                    id={`edit-status-${testimonial.id}`}
                                    name="status"
                                    defaultValue={
                                      testimonial.status
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                  >
                                    <option value="published">
                                      Published
                                    </option>
                                    <option value="draft">
                                      Draft
                                    </option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor={`edit-content-${testimonial.id}`}
                                  className="mb-2 block text-sm font-medium"
                                >
                                  Testimonial
                                </label>

                                <textarea
                                  id={`edit-content-${testimonial.id}`}
                                  name="content"
                                  required
                                  rows={6}
                                  defaultValue={
                                    testimonial.content
                                  }
                                  className="flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                />
                              </div>

                              <div className="flex justify-end">
                                <button
                                  type="submit"
                                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </details>

                      <form action={deleteTestimonial}>
                        <input
                          type="hidden"
                          name="id"
                          value={testimonial.id}
                        />

                        <button
                          type="submit"
                          className="inline-flex h-9 items-center justify-center rounded-md border border-destructive/30 bg-background px-3 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}