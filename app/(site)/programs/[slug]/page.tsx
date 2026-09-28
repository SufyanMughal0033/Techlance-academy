import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  IndianRupee,
  Sparkles,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

type Program = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  short_description?: string | null;
  category?: string | null;
  level?: string | null;
  duration?: string | null;
  price?: number | null;
  image_url?: string | null;
  featured?: boolean | null;
  status?: string | null;
};

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: program, error } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error || !program) {
    return (
      <>
        <PageHero
          eyebrow="Program"
          title="Program not found"
          description="The program you're looking for may no longer be available or the link may be incorrect."
        />

        <section className="py-16 sm:py-20">
          <div className="container-academy">
            <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Program not available
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                We couldn't find an active program with this URL.
              </p>

              <Link
                href="/programs"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Programs
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const typedProgram = program as Program;

  const description =
    typedProgram.description ||
    typedProgram.short_description ||
    "Build practical digital skills through structured learning, hands-on practice, and instructor guidance.";

  return (
    <>
      <PageHero
        eyebrow={typedProgram.category || "Techlance Academy"}
        title={typedProgram.title}
        description={description}
      />

      <section className="py-14 sm:py-20">
        <div className="container-academy">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            {/* Main Content */}
            <div>
              {typedProgram.image_url ? (
                <div className="overflow-hidden rounded-3xl border border-border bg-muted">
                  <img
                    src={typedProgram.image_url}
                    alt={typedProgram.title}
                    className="aspect-[16/8] w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/8] items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-muted to-primary/5">
                  <BookOpen className="h-20 w-20 text-primary/25" />
                </div>
              )}

              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  {typedProgram.featured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      Featured Program
                    </span>
                  )}

                  {typedProgram.category && (
                    <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                      {typedProgram.category}
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                  Program Overview
                </h2>

                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>

              {/* What You'll Learn */}
              <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">What You'll Learn</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Practical skills you can apply beyond the classroom.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Practical digital skills",
                    "Real-world project experience",
                    "Structured learning guidance",
                    "Instructor support",
                    "Hands-on practice",
                    "Career-focused learning",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Experience */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold tracking-tight">
                  Learning Experience
                </h3>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  At Techlance Academy, programs are designed around practical
                  learning. You'll work through structured lessons, practice
                  important concepts, and build confidence by applying what you
                  learn.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: BookOpen,
                      title: "Structured Lessons",
                      text: "Follow a clear learning path from fundamentals to practical implementation.",
                    },
                    {
                      icon: GraduationCap,
                      title: "Instructor Guidance",
                      text: "Get support while learning concepts and working through practical tasks.",
                    },
                    {
                      icon: Sparkles,
                      title: "Practical Projects",
                      text: "Apply your knowledge through project-based learning and practice.",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-border bg-card p-5"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>

                        <h4 className="mt-4 font-semibold">{item.title}</h4>

                        <p className="mt-2 text-xs leading-6 text-muted-foreground">
                          {item.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              <div className="sticky top-24 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/30 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Program Details
                  </p>

                  <h3 className="mt-3 text-2xl font-bold">
                    {typedProgram.title}
                  </h3>
                </div>

                <div className="space-y-5 p-6">
                  {typedProgram.duration && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Clock3 className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Duration
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {typedProgram.duration}
                        </p>
                      </div>
                    </div>
                  )}

                  {typedProgram.level && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Level
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {typedProgram.level}
                        </p>
                      </div>
                    </div>
                  )}

                  {typedProgram.category && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Category
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {typedProgram.category}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border pt-5">
                    <p className="text-xs text-muted-foreground">
                      Program Fee
                    </p>

                    <p className="mt-1 text-3xl font-bold tracking-tight">
                      {typeof typedProgram.price === "number"
                        ? `PKR ${typedProgram.price.toLocaleString()}`
                        : "Contact for fee"}
                    </p>
                  </div>

                  <Link
                    href={`/apply?program=${encodeURIComponent(
                      typedProgram.slug,
                    )}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/programs"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:bg-muted"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    All Programs
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="container-academy">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-muted/30 px-7 py-12 text-center sm:px-12">
            <div className="mx-auto max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Ready to Begin?
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Start your learning journey with Techlance Academy.
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                Apply for this program and take the next step toward developing
                practical digital skills.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href={`/apply?program=${encodeURIComponent(
                    typedProgram.slug,
                  )}`}
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