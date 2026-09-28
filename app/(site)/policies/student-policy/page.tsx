import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Student Policy",
  description: "General conduct, academic, and participation expectations for enrolled students.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Student Policy"
        description="General conduct, academic, and participation expectations for enrolled students."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This policy&apos;s full text will be managed as CMS content in the `site_content` table so academy staff can update it without a code change, falling back to the text seeded here.
        </p>
      </div>
    </>
  );
}
