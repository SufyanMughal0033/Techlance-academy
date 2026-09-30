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
  seo_title: string | null;
  seo_description: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
};

function getReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min read`;
}

function formatDate(date: string | null) {
  if (!date) {
    return "Recently";
  }

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getGradient(category: string | null) {
  const value = category?.toLowerCase() ?? "";

  if (value.includes("career")) {
    return "from-blue-500/20 via-primary/10 to-transparent";
  }

  if (value.includes("development")) {
    return "from-cyan-500/20 via-blue-500/10 to-transparent";
  }

  if (value.includes("industry")) {
    return "from-violet-500/20 via-purple-500/10 to-transparent";
  }

  if (value.includes("freelanc")) {
    return "from-pink-500/20 via-rose-500/10 to-transparent";
  }

  return "from-blue-500/20 via-primary/10 to-transparent";
}

function getContentParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select(
      "title, excerpt, seo_title, seo_description, status"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    return {
      title: "Article Not Found | Techlance Academy",
    };
  }

  return {
    title:
      post.seo_title ||
      `${post.title} | Techlance Academy`,
    description:
      post.seo_description ||
      post.excerpt ||
      "Read the latest article from Techlance Academy.",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, content, featured_image, category, tags, seo_title, seo_description, status, published_at, created_at"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    notFound();
  }

  const blogPost = post as BlogPost;

  const paragraphs = getContentParagraphs(blogPost.content);

  const gradient = getGradient(blogPost.category);

  /*
   * Related posts
   *
   * Category is nullable in the database, so we only query
   * related posts when the current post actually has a category.
   */
  let relatedPosts: BlogPost[] = [];

  if (blogPost.category) {
    const { data: relatedData } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, content, featured_image, category, tags, published_at, created_at"
      )
      .eq("status", "published")
      .neq("id", blogPost.id)
      .eq("category", blogPost.category)
      .order("published_at", {
        ascending: false,
        nullsFirst: false,
      })
      .limit(3);

    relatedPosts = (relatedData ?? []) as BlogPost[];
  }

  return (
    <main className="pb-20">
      {/* Article Hero */}
      <section
        className={`relative overflow-hidden border-b border-border bg-gradient-to-br ${gradient}`}
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

              {blogPost.category ?? "Techlance Academy"}
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {blogPost.title}
            </h1>

            {blogPost.excerpt && (
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {blogPost.excerpt}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />

                {formatDate(blogPost.published_at)}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />

                {getReadTime(blogPost.content)}
              </span>

              <span>By Techlance Academy</span>
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
              className={`relative mb-12 aspect-[16/8] overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${gradient}`}
            >
              {blogPost.featured_image ? (
                <img
                  src={blogPost.featured_image}
                  alt={blogPost.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-black tracking-tighter text-foreground/10 sm:text-8xl">
                        TECHLANCE
                      </div>

                      <p className="mt-2 text-sm font-medium text-muted-foreground">
                        Academy Insights
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`${blogPost.id}-${index}`}
                  className={
                    index === 0
                      ? "text-lg leading-8 text-muted-foreground"
                      : "mt-6 text-base leading-8 text-muted-foreground"
                  }
                >
                  {paragraph}
                </p>
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
                      Keep learning, practice through real projects,
                      and focus on applying your knowledge to practical
                      problems.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="mt-10">
                  <p className="text-sm font-semibold">
                    Tags
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {blogPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Share */}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <div>
                <p className="text-sm font-semibold">
                  Enjoyed this article?
                </p>

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
                Article
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {blogPost.category ?? "Academy"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Published
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {formatDate(blogPost.published_at)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Reading time
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {getReadTime(blogPost.content)}
                  </p>
                </div>
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
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/30"
              >
                <span className="text-xs font-semibold text-primary">
                  {related.category ?? "Academy"}
                </span>

                <h3 className="mt-3 font-semibold leading-6 transition-colors group-hover:text-primary">
                  {related.title}
                </h3>

                <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />

                  {getReadTime(related.content)}
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