import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Admissions",
  description: "How admission works at Techlance Academy — eligibility, the review process, and what to prepare before you apply.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Admissions"
        description="How admission works at Techlance Academy — eligibility, the review process, and what to prepare before you apply."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This page will cover admission requirements, who can apply, the step-by-step process, and program selection guidance, with a clear path into the full application form at /apply.
        </p>
      </div>
    </>
  );
}
