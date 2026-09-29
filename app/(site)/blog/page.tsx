import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Search,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";

const posts = [
  {
    slug: "how-to-start-a-career-in-web-development",
    category: "Career",
    title: "How to Start a Career in Web Development",
    excerpt:
      "A practical roadmap for beginners who want to learn modern web development and build real-world skills.",
    date: "September 24, 2026",
    readTime: "6 min read",
    featured: true,
    gradient: "from-blue-500/20 via-primary/10 to-transparent",
  },
  {
    slug: "react-js-roadmap-for-beginners",
    category: "Development",
    title: "React.js Roadmap for Beginners",
    excerpt:
      "Understand what to learn, what to build, and how to move from JavaScript fundamentals to production-ready React apps.",
    date: "September 20, 2026",
    readTime: "8 min read",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
  },
  {
    slug: "why-digital-skills-matter-in-2026",
    category: "Industry",
    title: "Why Digital Skills Matter More Than Ever in 2026",
    excerpt:
      "Explore how technology is changing careers and why practical digital skills are becoming increasingly valuable.",
    date: "September 16, 2026",
    readTime: "5 min read",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
  {
    slug: "building-your-first-professional-portfolio",
    category: "Career",
    title: "Building Your First Professional Portfolio",
    excerpt:
      "Learn how to turn your learning projects into a portfolio that clearly demonstrates your skills.",
    date: "September 11, 2026",
    readTime: "7 min read",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    slug: "frontend-development-skills-you-need",
    category: "Development",
    title: "Frontend Development Skills You Need",
    excerpt:
      "A breakdown of the core technologies and habits every aspiring frontend developer should develop.",
    date: "September 7, 2026",
    readTime: "6 min read",
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
  },
  {
    slug: "from-learning-to-getting-your-first-client",
    category: "Freelancing",
    title: "From Learning to Getting Your First Client",
    excerpt:
      "A practical look at how beginners can turn their technical skills into real freelance opportunities.",
    date: "September 2, 2026",
    readTime: "9 min read",
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
  },
];

const categories = [
  "All",
  "Development",
  "Career",
  "Industry",
  "Freelancing",
];

function PostCard({
  post,
}: {
  post: (typeof posts)[number];
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      <Link href={`/blog/${post.slug}`} className="block">
        <div
          className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${post.gradient}`}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />

          <div className="absolute left-5 top-5">
            <span className="inline-flex rounded-full border border-primary/20 bg-background/80 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur">
              {post.category}
            </span>
          </div>

          <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-background/70 backdrop-blur transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="h-5 w-5" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-md">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Techlance Academy
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h2>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function BlogPage() {
  const featuredPost = posts.find((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

  return (
    <>
      <PageHero
        eyebrow="Techlance Academy"
        title="Ideas that help you grow."
        description="Practical tutorials, career guidance, development insights, and industry knowledge to help you build skills that matter."
      />

      <main className="container-academy pb-20">
        {/* Search + Categories */}
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
                placeholder="Search articles..."
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Featured */}
        {featuredPost && (
          <section className="py-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Featured article
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Start here
                </h2>
              </div>
            </div>

            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group grid overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-[1.05fr_0.95fr]"
            >
              <div
                className={`relative min-h-[300px] overflow-hidden bg-gradient-to-br ${featuredPost.gradient}`}
              >
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />

                <div className="absolute left-7 top-7">
                  <span className="rounded-full border border-primary/20 bg-background/80 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur">
                    {featuredPost.category}
                  </span>
                </div>

                <div className="absolute bottom-7 left-7 right-7">
                  <div className="text-sm font-medium text-muted-foreground">
                    Techlance Academy
                  </div>
                  <div className="mt-2 text-5xl font-black tracking-tighter text-foreground/10 sm:text-7xl">
                    LEARN
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {featuredPost.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                  {featuredPost.title}
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read featured article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Latest */}
        <section>
          <div className="mb-7">
            <p className="text-sm font-semibold text-primary">Latest</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              From the Academy
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-primary/20 bg-primary px-6 py-12 text-primary-foreground sm:px-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-80">
              Ready to learn?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Turn knowledge into real-world skills.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 opacity-85 sm:text-base">
              Explore Techlance Academy programs and start building the skills
              you need for your next opportunity.
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