import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Blog",
  description: "Tutorials, career guidance, and industry updates from the Techlance Academy team.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Blog"
        description="Tutorials, career guidance, and industry updates from the Techlance Academy team."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Published posts from the `blog_posts` table will be listed here with category filters, each linking to its own SEO-optimized detail page.
        </p>
      </div>
    </>
  );
}
