import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Student Resources",
  description: "Handbooks, guidelines, and downloadable materials for current and prospective students.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Student Resources"
        description="Handbooks, guidelines, and downloadable materials for current and prospective students."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Resources uploaded by admins to the `resources` table and Supabase Storage will be organized by category here.
        </p>
      </div>
    </>
  );
}
