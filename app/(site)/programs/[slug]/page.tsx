import { PageHero } from "@/components/marketing/page-hero";

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <PageHero
        eyebrow="Program"
        title={slug.replace(/-/g, " ")}
        description="This program's overview, curriculum, schedule, fee, and FAQs will be loaded here from the `programs` and `program_modules` tables by slug."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Route: <code className="rounded bg-muted px-1.5 py-0.5">/programs/{slug}</code>{" "}
          — full curriculum accordion, eligibility, mentorship details, and an
          Apply Now CTA land in Phase 3 once real program records exist.
        </p>
      </div>
    </>
  );
}
