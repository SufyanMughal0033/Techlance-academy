import Link from "next/link";
import {
  ArrowRight,
  Quote,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Testimonials | Techlance Academy",
  description:
    "Read what students and learners say about their experience at Techlance Academy.",
};

export const revalidate = 60;

export default async function TestimonialsPage() {
  const supabase = await createClient();

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select(
      "id, name, role, company, content, rating, avatar_url, display_order"
    )
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Failed to load testimonials: ${error.message}`
    );
  }

  const items = testimonials ?? [];

  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_35%),radial-gradient(circle_at_85%_20%,hsl(var(--primary)/0.08),transparent_30%)]" />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Student Experiences
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              What Our Students{" "}
              <span className="text-primary">Say</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Discover how Techlance Academy helps students build
              practical digital skills, gain confidence, and prepare
              for real-world opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <Users className="mx-auto h-10 w-10 text-muted-foreground" />

            <h2 className="mt-4 text-xl font-semibold text-foreground">
              No testimonials available yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Student testimonials will appear here once they are
              published by the Techlance Academy team.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((testimonial) => (
              <article
                key={testimonial.id}
                className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="absolute right-6 top-6">
                  <Quote className="h-8 w-8 text-primary/15 transition-colors group-hover:text-primary/25" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${
                        index < testimonial.rating
                          ? "fill-current text-amber-500"
                          : "text-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="mt-5 flex-1 text-sm leading-7 text-muted-foreground">
                  “{testimonial.content}”
                </blockquote>

                {/* Author */}
                <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {testimonial.name
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </h3>

                    <p className="truncate text-xs text-muted-foreground">
                      {testimonial.role || "Student"}
                      {testimonial.company
                        ? ` · ${testimonial.company}`
                        : ""}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 px-6 py-12 sm:px-10 lg:px-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Start Your Journey
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Ready to build your digital skills?
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                Explore our practical programs and take the next step
                toward your learning and career goals.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/programs"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Explore Programs
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}