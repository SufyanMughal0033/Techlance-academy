import { PageHero } from "@/components/marketing/page-hero";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={slug.replace(/-/g, " ")}
        description="This post's content, author, category, and Open Graph metadata will be loaded from the `blog_posts` table by slug."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Route: <code className="rounded bg-muted px-1.5 py-0.5">/blog/{slug}</code> —
          rendered with the Tiptap-authored rich content, ISR revalidation, and
          full SEO metadata in Phase 8.
        </p>
      </div>
    </>
  );
}
