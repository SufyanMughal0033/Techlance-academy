import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  GraduationCap,
  Laptop,
  PlayCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";

const categories = [
  "All Resources",
  "Study Guides",
  "Handbooks",
  "Career",
  "Templates",
  "Learning",
];

const resources = [
  {
    title: "Student Handbook",
    description:
      "Everything students need to know about learning at Techlance Academy, including expectations, communication, and academic guidelines.",
    category: "Handbooks",
    type: "PDF",
    size: "2.4 MB",
    icon: BookOpen,
    featured: true,
  },
  {
    title: "Web Development Roadmap",
    description:
      "A structured learning roadmap covering the essential skills you need to progress from beginner to job-ready web developer.",
    category: "Study Guides",
    type: "PDF",
    size: "1.8 MB",
    icon: Laptop,
  },
  {
    title: "Career Preparation Guide",
    description:
      "Practical guidance for building your portfolio, preparing for interviews, improving your CV, and approaching opportunities.",
    category: "Career",
    type: "PDF",
    size: "1.6 MB",
    icon: BriefcaseBusiness,
  },
  {
    title: "Project Planning Template",
    description:
      "Plan your next project with a simple framework for defining goals, features, milestones, and deliverables.",
    category: "Templates",
    type: "DOC",
    size: "420 KB",
    icon: FileText,
  },
  {
    title: "Learning Strategy Guide",
    description:
      "Learn how to create a consistent study routine, break down difficult topics, and make better progress.",
    category: "Learning",
    type: "PDF",
    size: "980 KB",
    icon: GraduationCap,
  },
  {
    title: "Student Success Checklist",
    description:
      "A practical checklist to help you stay organized throughout your learning journey at Techlance Academy.",
    category: "Study Guides",
    type: "PDF",
    size: "640 KB",
    icon: CheckCircle2,
  },
];

function ResourceCard({
  resource,
}: {
  resource: (typeof resources)[number];
}) {
  const Icon = resource.icon;

  return (
    <article className="group rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>

        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          {resource.type}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold text-primary">
          {resource.category}
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
          {resource.title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {resource.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        <span className="text-xs text-muted-foreground">
          {resource.size}
        </span>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </article>
  );
}

export default function ResourcesPage() {
  const featuredResource = resources.find((resource) => resource.featured);
  const regularResources = resources.filter(
    (resource) => !resource.featured
  );

  return (
    <>
      <PageHero
        eyebrow="Student Resources"
        title="Everything you need to keep moving forward."
        description="Access practical guides, handbooks, templates, and learning materials designed to support your journey at Techlance Academy."
      />

      <main className="container-academy pb-20">
        {/* Search + Filters */}
        <section className="border-b border-border py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    index === 0
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                placeholder="Search resources..."
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Featured Resource */}
        {featuredResource && (
          <section className="py-12">
            <div className="mb-6">
              <p className="text-sm font-semibold text-primary">
                Start here
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Featured resource
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/[0.04]">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <BookOpen className="h-9 w-9" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {featuredResource.category}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {featuredResource.type} · {featuredResource.size}
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    {featuredResource.title}
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    {featuredResource.description}
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Resource Grid */}
        <section>
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">
                Resource library
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Explore resources
              </h2>
            </div>

            <span className="hidden text-sm text-muted-foreground sm:block">
              {resources.length} resources
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularResources.map((resource) => (
              <ResourceCard
                key={resource.title}
                resource={resource}
              />
            ))}
          </div>
        </section>

        {/* Quick Access */}
        <section className="mt-20">
          <div className="mb-7">
            <p className="text-sm font-semibold text-primary">
              Quick access
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Need something specific?
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/programs"
              className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30"
            >
              <GraduationCap className="h-5 w-5 text-primary" />

              <h3 className="mt-4 font-semibold">
                Explore programs
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Find a program that matches your learning goals.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                View programs
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/admissions"
              className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30"
            >
              <FileText className="h-5 w-5 text-primary" />

              <h3 className="mt-4 font-semibold">
                Admissions guide
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Learn how the Techlance Academy admission process works.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                View admissions
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/blog"
              className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30"
            >
              <PlayCircle className="h-5 w-5 text-primary" />

              <h3 className="mt-4 font-semibold">
                Learn from the blog
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Read tutorials, career advice, and industry insights.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Visit blog
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-primary/20 bg-primary px-6 py-12 text-primary-foreground sm:px-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-background/15">
              <Sparkles className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Your next skill starts with the right resources.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 opacity-85 sm:text-base">
              Explore our programs and take the next step toward building
              practical, career-focused digital skills.
            </p>

            <Link
              href="/programs"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
            >
              Explore programs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
