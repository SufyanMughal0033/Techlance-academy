import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Certificate Policy",
  description: "The requirements a student must meet before a certificate is issued.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Certificate Policy"
        description="The requirements a student must meet before a certificate is issued."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This policy&apos;s full text will be managed as CMS content in the `site_content` table so academy staff can update it without a code change, falling back to the text seeded here.
        </p>
      </div>
    </>
  );
}
