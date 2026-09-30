
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Search,
  Sparkles,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Programs | Techlance Academy",
  description:
    "Explore practical, instructor-led programs in web development, digital marketing, design, and other in-demand digital skills at Techlance Academy.",
};

type Program = {
  id: string;
  slug: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Programs fetch error:", error);
  }

  const programs = (data ?? []) as Program[];

  const params = await searchParams;

  const query = params.q?.trim().toLowerCase() || "";

  const filteredPrograms = programs.filter((program) => {
    const searchableText = [
      program.title,
      program.slug,
      program.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = query
      ? searchableText.includes(query)
      : true;

    const isActive =
      program.status === "active" ||
      program.status === "published";

    return matchesSearch && isActive;
  });

  return (
    <>
      <PageHero
        eyebrow="Techlance Academy"
        title="Programs built for practical growth."
        description="Explore structured, instructor-led programs designed to help you learn digital skills, practice what you learn, and build with confidence."
      />

      {/* Intro */}
      <section className="border-b border-border bg-muted/20">
        <div className="container-academy py-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Explore our learning paths
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Find a program that matches your goals.
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                Learn through practical lessons, guided projects, and
                instructor support. Choose a program and start building
                skills that you can apply in real digital environments.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>

              <div>
                <p className="text-xl font-bold">
                  {filteredPrograms.length}
                </p>

                <p className="text-xs text-muted-foreground">
                  Available programs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="sticky top-0 z-20 border-b border-border bg-background/95 py-5 backdrop-blur">
        <div className="container-academy">
          <form
            action="/programs"
            method="GET"
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Search programs..."
                className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <button
              type="submit"
              className="h-11 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Search
            </button>
          </form>

          {query && (
            <div className="mt-3">
              <Link
                href="/programs"
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear search
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 sm:py-20">
        <div className="container-academy">
          {filteredPrograms.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrograms.map((program) => (
                <article
                  key={program.id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Program Visual */}
                  <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-muted to-primary/5">
                    <BookOpen className="h-16 w-16 text-primary/25 transition duration-500 group-hover:scale-110" />

                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Techlance Academy
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold capitalize text-primary">
                        {program.status}
                      </span>

                      <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
                        Professional Program
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold tracking-tight">
                      {program.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      Build practical skills through structured learning,
                      hands-on practice, instructor guidance, and
                      project-based learning.
                    </p>

                    <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4" />
                        Practical Learning
                      </div>

                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        Structured Course
                      </div>
                    </div>

                    <div className="mt-auto border-t border-border pt-5">
                      <Link
                        href={`/programs/${program.slug}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                      >
                        View Program
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No programs found
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We couldn't find any active programs matching your search.
                Try another search or clear the search.
              </p>

              <Link
                href="/programs"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                View all programs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="container-academy">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-muted/30 px-7 py-12 text-center sm:px-12">
            <div className="mx-auto max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Start Learning
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to start learning?
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                Explore our programs or submit your admission application
                and take the next step toward developing practical digital
                skills.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/apply"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Apply for Admission
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold transition hover:bg-muted"
                >
                  Contact Academy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
