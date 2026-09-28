import type { Metadata } from "next";
import FAQContent from "@/components/marketing/faq-content";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about admissions, programs, fees, classes, and certificates at Techlance Academy.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Answers to common questions about admissions, programs, fees, classes, and certificates."
      />

      <FAQContent />
    </>
  );
}