import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Search,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
};

const categories = [
  "All",
  "Development",
  "Career",
  "Industry",
  "Freelancing",
];

function getReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min read`;
}

function formatDate(date: string | null) {
  if (!date) return "Recently";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getGradient(index: number) {
  const gradients = [
    "from-blue-500/20 via-primary/10 to-transparent",
    "from-cyan-500/20 via-blue-500/10 to-transparent",
    "from-violet-500/20 via-purple-500/10 to-transparent",
    "from-emerald-500/20 via-teal-500/10 to-transparent",
    "from-orange-500/20 via-amber-500/10 to-transparent",
    "from-pink-500/20 via-rose-500/10 to-transparent",
  ];

  return gradients[index % gradients.length];
}

function PostCard({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) {
  const gradient = getGradient(index);

  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      <Link href={`/blog/${post.slug}`} className="block">
        <div
          className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${gradient}`}
        >
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />

              <div className="absolute left-5 top-5">
                <span className="inline-flex rounded-full border border-primary/20 bg-background/80 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur">
                  {post.category ?? "Academy"}
                </span>
              </div>

              <div className="absolute bottom-5 left-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Techlance Academy
                </div>
              </div>
            </>
          )}

          <div className="absolute left-5 top-5">
            <span className="inline-flex rounded-full border border-primary/20 bg-background/80 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur">
              {post.category ?? "Academy"}
            </span>
          </div>

          <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-background/70 backdrop-blur transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(post.published_at)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {getReadTime(post.content)}
            </span>
          </div>

          <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h2>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {post.excerpt ||
              "Explore this article from Techlance Academy."}
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

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, content, featured_image, category, tags, published_at, created_at"
    )
    .eq("status", "published")
    .order("published_at", {
      ascending: false,
      nullsFirst: false,
    });

  const blogPosts = (posts ?? []) as BlogPost[];

  const featuredPost = blogPosts[0] ?? null;
  const regularPosts = blogPosts.slice(1);

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

        {/* Error */}
        {error ? (
          <section className="py-20 text-center">
            <h2 className="text-xl font-semibold">
              Unable to load articles
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Please try again later.
            </p>
          </section>
        ) : !blogPosts.length ? (
          <section className="py-20 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-primary" />

            <h2 className="mt-4 text-2xl font-bold">
              No articles published yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              New Techlance Academy articles will appear here once they are
              published from the admin dashboard.
            </p>
          </section>
        ) : (
          <>
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
                    className={`relative min-h-[300px] overflow-hidden bg-gradient-to-br ${getGradient(
                      0
                    )}`}
                  >
                    {featuredPost.featured_image ? (
                      <img
                        src={featuredPost.featured_image}
                        alt={featuredPost.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />

                        <div className="absolute bottom-7 left-7 right-7">
                          <div className="text-sm font-medium text-muted-foreground">
                            Techlance Academy
                          </div>

                          <div className="mt-2 text-5xl font-black tracking-tighter text-foreground/10 sm:text-7xl">
                            LEARN
                          </div>
                        </div>
                      </>
                    )}

                    <div className="absolute left-7 top-7">
                      <span className="rounded-full border border-primary/20 bg-background/80 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur">
                        {featuredPost.category ?? "Academy"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center p-7 sm:p-10">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(featuredPost.published_at)}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {getReadTime(featuredPost.content)}
                      </span>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                      {featuredPost.title}
                    </h2>

                    <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                      {featuredPost.excerpt ||
                        "Explore this article from Techlance Academy."}
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
            {regularPosts.length > 0 && (
              <section>
                <div className="mb-7">
                  <p className="text-sm font-semibold text-primary">
                    Latest
                  </p>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    From the Academy
                  </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {regularPosts.map((post, index) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      index={index + 1}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

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
              Explore Techlance Academy programs and start building the
              skills you need for your next opportunity.
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