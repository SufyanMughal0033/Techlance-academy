import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Frequently Asked Questions | Techlance Academy",
  description:
    "Find answers to common questions about Techlance Academy programs, admissions, classes, certificates, payments, and learning.",
};

export const revalidate = 60;

export default async function FaqsPage() {
  const supabase = await createClient();

  const { data: faqs, error } = await supabase
    .from("faqs")
    .select("id, question, answer, category, display_order")
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load FAQs: ${error.message}`);
  }

  const categories = Array.from(
    new Set(
      (faqs ?? [])
        .map((faq) => faq.category)
        .filter((category): category is string => Boolean(category))
    )
  );

  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/[0.10] via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

        <div className="container-academy relative py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-2 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Techlance Academy Help Center
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Frequently Asked Questions
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Find quick answers about our programs, admissions, learning
              process, certificates, and everything you need to know before
              getting started.
            </p>

            {/* Search UI */}
            <div className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search frequently asked questions..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Search frequently asked questions"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container-academy">
        {/* Stats */}
        <div className="mx-auto -mt-6 grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
            <p className="text-2xl font-bold text-primary">
              {faqs?.length ?? 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Published FAQs
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
            <p className="text-2xl font-bold text-primary">
              {categories.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Categories
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
            <p className="text-2xl font-bold text-primary">
              24/7
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Online Access
            </p>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-2">
            <span className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
              All Questions
            </span>

            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* FAQ List */}
        <section className="mx-auto mt-10 max-w-4xl">
          {!faqs || faqs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <HelpCircle className="mx-auto h-10 w-10 text-muted-foreground" />

              <h2 className="mt-5 text-xl font-semibold">
                No FAQs available yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                We are currently preparing answers to the most common
                questions about Techlance Academy.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={faq.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/30"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 sm:px-6">
                    <div className="flex min-w-0 items-start gap-4">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0">
                        {faq.category && (
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            {faq.category}
                          </span>
                        )}

                        <h2 className="mt-1 text-sm font-semibold leading-6 text-foreground sm:text-base">
                          {faq.question}
                        </h2>
                      </div>
                    </div>

                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>

                  <div className="border-t border-border px-5 pb-6 pt-5 sm:px-6">
                    <div className="ml-12 max-w-3xl">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>

        {/* Contact CTA */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary px-6 py-12 text-center text-primary-foreground sm:px-10">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />

            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/10">
                <MessageCircle className="h-6 w-6" />
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] opacity-80">
                Still have questions?
              </p>

              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                We&apos;re here to help.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 opacity-85">
                If you cannot find the answer you are looking for, explore our
                programs or get in touch with the Techlance Academy team.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
                >
                  Explore Programs
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/15"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
