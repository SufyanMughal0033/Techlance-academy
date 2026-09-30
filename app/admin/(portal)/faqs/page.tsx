import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  createFaq,
  deleteFaq,
  updateFaq,
} from "./actions";

export const metadata = {
  title: "FAQs",
};

export const revalidate = 0;

export default async function Page() {
  const supabase = await createClient();

  const { data: faqs, error } = await supabase
    .from("faqs")
    .select(
      "id, question, answer, category, display_order, status, created_at, updated_at"
    )
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load FAQs: ${error.message}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          FAQs
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Create and manage frequently asked questions displayed on the
          Techlance Academy public website.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Add New FAQ
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form action={createFaq} className="flex flex-col gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="question"
                  className="mb-2 block text-sm font-medium"
                >
                  Question
                </label>

                <input
                  id="question"
                  name="question"
                  type="text"
                  required
                  placeholder="What courses does Techlance Academy offer?"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="answer"
                  className="mb-2 block text-sm font-medium"
                >
                  Answer
                </label>

                <textarea
                  id="answer"
                  name="answer"
                  required
                  rows={5}
                  placeholder="Write the complete answer here..."
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="Admissions"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

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
            </div>

            <div>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Add FAQ
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            All FAQs ({faqs?.length ?? 0})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!faqs || faqs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
              No FAQs have been created yet.
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          #{faq.display_order}
                        </span>

                        {faq.category && (
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            {faq.category}
                          </span>
                        )}

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            faq.status === "published"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {faq.status === "published"
                            ? "Published"
                            : "Draft"}
                        </span>
                      </div>

                      <h3 className="mt-3 text-base font-semibold text-foreground">
                        {faq.question}
                      </h3>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <details>
                        <summary className="inline-flex h-9 cursor-pointer list-none items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition hover:bg-muted">
                          Edit
                        </summary>

                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
                          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl">
                            <div className="mb-6">
                              <h3 className="text-lg font-semibold">
                                Edit FAQ
                              </h3>

                              <p className="mt-1 text-sm text-muted-foreground">
                                Update this frequently asked question.
                              </p>
                            </div>

                            <form
                              action={updateFaq}
                              className="flex flex-col gap-5"
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={faq.id}
                              />

                              <div>
                                <label
                                  htmlFor={`edit-question-${faq.id}`}
                                  className="mb-2 block text-sm font-medium"
                                >
                                  Question
                                </label>

                                <input
                                  id={`edit-question-${faq.id}`}
                                  name="question"
                                  type="text"
                                  required
                                  defaultValue={faq.question}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor={`edit-answer-${faq.id}`}
                                  className="mb-2 block text-sm font-medium"
                                >
                                  Answer
                                </label>

                                <textarea
                                  id={`edit-answer-${faq.id}`}
                                  name="answer"
                                  required
                                  rows={6}
                                  defaultValue={faq.answer}
                                  className="flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                />
                              </div>

                              <div className="grid gap-5 sm:grid-cols-3">
                                <div>
                                  <label
                                    htmlFor={`edit-category-${faq.id}`}
                                    className="mb-2 block text-sm font-medium"
                                  >
                                    Category
                                  </label>

                                  <input
                                    id={`edit-category-${faq.id}`}
                                    name="category"
                                    type="text"
                                    defaultValue={faq.category ?? ""}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`edit-order-${faq.id}`}
                                    className="mb-2 block text-sm font-medium"
                                  >
                                    Display Order
                                  </label>

                                  <input
                                    id={`edit-order-${faq.id}`}
                                    name="display_order"
                                    type="number"
                                    min="0"
                                    defaultValue={faq.display_order}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`edit-status-${faq.id}`}
                                    className="mb-2 block text-sm font-medium"
                                  >
                                    Status
                                  </label>

                                  <select
                                    id={`edit-status-${faq.id}`}
                                    name="status"
                                    defaultValue={faq.status}
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

                              <div className="flex justify-end gap-2">
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

                      <form action={deleteFaq}>
                        <input
                          type="hidden"
                          name="id"
                          value={faq.id}
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
