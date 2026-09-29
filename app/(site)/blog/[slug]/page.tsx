import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Share2,
  Sparkles,
} from "lucide-react";
import { notFound } from "next/navigation";

const posts = [
  {
    slug: "how-to-start-a-career-in-web-development",
    category: "Career",
    title: "How to Start a Career in Web Development",
    excerpt:
      "A practical roadmap for beginners who want to learn modern web development and build real-world skills.",
    date: "September 24, 2026",
    readTime: "6 min read",
    author: "Techlance Academy",
    gradient: "from-blue-500/20 via-primary/10 to-transparent",
    sections: [
      {
        heading: "Start with the fundamentals",
        paragraphs: [
          "A strong web development journey starts with understanding the fundamentals rather than jumping between frameworks.",
          "Begin with HTML, CSS, and JavaScript. These technologies form the foundation of almost every modern website and web application.",
        ],
      },
      {
        heading: "Move into modern development",
        paragraphs: [
          "Once your JavaScript fundamentals are comfortable, you can start learning a modern frontend framework such as React.",
          "The goal should not simply be to memorize syntax. Focus on understanding components, state, events, routing, reusable UI, and how applications are structured.",
        ],
      },
      {
        heading: "Build real projects",
        paragraphs: [
          "Projects are where your learning becomes practical. Build websites that solve realistic problems instead of following tutorials forever.",
          "A portfolio containing several polished projects can demonstrate your ability much more effectively than a long list of technologies.",
        ],
      },
    ],
  },
  {
    slug: "react-js-roadmap-for-beginners",
    category: "Development",
    title: "React.js Roadmap for Beginners",
    excerpt:
      "Understand what to learn, what to build, and how to move from JavaScript fundamentals to production-ready React apps.",
    date: "September 20, 2026",
    readTime: "8 min read",
    author: "Techlance Academy",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    sections: [
      {
        heading: "JavaScript comes first",
        paragraphs: [
          "Before learning React, make sure you understand variables, arrays, objects, functions, loops, modules, promises, and modern JavaScript syntax.",
        ],
      },
      {
        heading: "Learn the React mental model",
        paragraphs: [
          "React is easier to understand when you think in reusable components and data flowing through your interface.",
          "Focus on props, state, events, conditional rendering, lists, hooks, and component composition.",
        ],
      },
      {
        heading: "Build complete applications",
        paragraphs: [
          "After learning the fundamentals, build complete projects with routing, APIs, forms, responsive layouts, and proper deployment.",
        ],
      },
    ],
  },
  {
    slug: "why-digital-skills-matter-in-2026",
    category: "Industry",
    title: "Why Digital Skills Matter More Than Ever in 2026",
    excerpt:
      "Explore how technology is changing careers and why practical digital skills are becoming increasingly valuable.",
    date: "September 16, 2026",
    readTime: "5 min read",
    author: "Techlance Academy",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    sections: [
      {
        heading: "Technology is changing the workplace",
        paragraphs: [
          "Businesses across industries increasingly rely on websites, software, digital marketing, automation, and data-driven tools.",
          "This creates demand for people who can understand and work with modern digital technologies.",
        ],
      },
      {
        heading: "Practical skills matter",
        paragraphs: [
          "Learning becomes valuable when it can be applied. Building projects, solving problems, and working with real tools helps turn theoretical knowledge into practical capability.",
        ],
      },
    ],
  },
  {
    slug: "building-your-first-professional-portfolio",
    category: "Career",
    title: "Building Your First Professional Portfolio",
    excerpt:
      "Learn how to turn your learning projects into a portfolio that clearly demonstrates your skills.",
    date: "September 11, 2026",
    readTime: "7 min read",
    author: "Techlance Academy",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    sections: [
      {
        heading: "Quality over quantity",
        paragraphs: [
          "Your portfolio does not need dozens of projects. A few well-finished projects can communicate your skills more clearly.",
        ],
      },
      {
        heading: "Explain what you built",
        paragraphs: [
          "For every project, explain the problem, technologies used, important features, and what you learned while building it.",
        ],
      },
    ],
  },
  {
    slug: "frontend-development-skills-you-need",
    category: "Development",
    title: "Frontend Development Skills You Need",
    excerpt:
      "A breakdown of the core technologies and habits every aspiring frontend developer should develop.",
    date: "September 7, 2026",
    readTime: "6 min read",
    author: "Techlance Academy",
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    sections: [
      {
        heading: "Master the foundation",
        paragraphs: [
          "HTML, CSS, and JavaScript remain essential frontend development skills even as frameworks continue to evolve.",
        ],
      },
      {
        heading: "Think beyond code",
        paragraphs: [
          "Responsive design, accessibility, performance, Git, debugging, and communication are also important parts of professional frontend development.",
        ],
      },
    ],
  },
  {
    slug: "from-learning-to-getting-your-first-client",
    category: "Freelancing",
    title: "From Learning to Getting Your First Client",
    excerpt:
      "A practical look at how beginners can turn their technical skills into real freelance opportunities.",
    date: "September 2, 2026",
    readTime: "9 min read",
    author: "Techlance Academy",
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
    sections: [
      {
        heading: "Build something you can show",
        paragraphs: [
          "Before approaching clients, make sure you have examples that demonstrate what you can actually deliver.",
        ],
      },
      {
        heading: "Focus on solving problems",
        paragraphs: [
          "Clients generally care about business outcomes rather than technology names. Learn to communicate how your service can solve a specific problem.",
        ],
      },
    ],
  },
];

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found | Techlance Academy",
    };
  }

  return {
    title: `${post.title} | Techlance Academy`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts
    .filter((item) => item.slug !== post.slug)
    .filter((item) => item.category === post.category)
    .slice(0, 3);

  return (
    <main className="pb-20">
      {/* Article Hero */}
      <section
        className={`relative overflow-hidden border-b border-border bg-gradient-to-br ${post.gradient}`}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.06]" />

        <div className="container-academy relative py-16 sm:py-20 lg:py-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>

          <div className="mx-auto mt-12 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-4 py-2 text-xs font-semibold text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {post.category}
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {post.date}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {post.readTime}
              </span>

              <span>By {post.author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <div className="container-academy">
        <div className="mx-auto grid max-w-6xl gap-12 py-14 lg:grid-cols-[1fr_280px]">
          <article className="min-w-0">
            {/* Cover */}
            <div
              className={`relative mb-12 aspect-[16/8] overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${post.gradient}`}
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-black tracking-tighter text-foreground/10 sm:text-8xl">
                    TECHLANCE
                  </div>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    Academy Insights
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <p className="text-lg leading-8 text-muted-foreground">
                Building a successful career in technology requires more than
                simply watching tutorials. The most valuable progress comes
                from understanding fundamentals, practicing consistently, and
                applying your knowledge to real problems.
              </p>

              {post.sections.map((section) => (
                <section key={section.heading} className="mt-12">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {section.heading}
                  </h2>

                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-5 text-base leading-8 text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}

              {/* Key takeaway */}
              <div className="my-12 rounded-2xl border border-primary/20 bg-primary/[0.06] p-6 sm:p-8">
                <div className="flex gap-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div>
                    <h3 className="text-lg font-semibold">
                      Key takeaway
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Focus on building a strong foundation, practice through
                      real projects, and continuously improve your ability to
                      solve practical problems.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="mt-12 text-2xl font-bold tracking-tight sm:text-3xl">
                Keep learning. Keep building.
              </h2>

              <p className="mt-5 text-base leading-8 text-muted-foreground">
                Technology changes quickly, but the ability to learn, adapt,
                and build remains valuable. Treat every project as an
                opportunity to improve your skills and create something useful.
              </p>
            </div>

            {/* Share */}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <div>
                <p className="text-sm font-semibold">Enjoyed this article?</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Share it with someone who might find it useful.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:border-primary/40 hover:text-primary"
              >
                <Share2 className="h-4 w-4" />
                Share article
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                In this article
              </p>

              <div className="mt-5 space-y-3">
                {post.sections.map((section, index) => (
                  <div
                    key={section.heading}
                    className="flex gap-3 text-sm text-muted-foreground"
                  >
                    <span className="font-semibold text-primary">
                      0{index + 1}
                    </span>
                    <span>{section.heading}</span>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-border" />

              <Link
                href="/programs"
                className="flex items-center justify-between rounded-xl bg-primary p-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Explore programs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Related */}
      {relatedPosts.length > 0 && (
        <section className="container-academy border-t border-border pt-14">
          <div className="mb-7">
            <p className="text-sm font-semibold text-primary">
              Keep reading
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Related articles
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/30"
              >
                <span className="text-xs font-semibold text-primary">
                  {related.category}
                </span>

                <h3 className="mt-3 font-semibold leading-6 transition-colors group-hover:text-primary">
                  {related.title}
                </h3>

                <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  {related.readTime}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="container-academy mt-16">
        <div className="overflow-hidden rounded-3xl border border-primary/20 bg-primary px-6 py-12 text-center text-primary-foreground sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-80">
            Techlance Academy
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to turn learning into a real skill?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 opacity-85">
            Explore our programs and find the right path for your learning
            journey.
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
  );
}