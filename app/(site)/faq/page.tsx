import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about admissions, programs, fees, classes, and certificates.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Answers to common questions about admissions, programs, fees, classes, and certificates."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          FAQs will be categorized and admin-managed, rendered here as a searchable accordion sourced from the `faqs` table.
        </p>
      </div>
    </>
  );
}
