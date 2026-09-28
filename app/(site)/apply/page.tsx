import type { Metadata } from "next";

import { PageHero } from "@/components/marketing/page-hero";
import { ApplyForm } from "@/components/marketing/apply-form";

export const metadata: Metadata = {
  title: "Apply | Techlance Academy",
  description:
    "Apply for admission to Techlance Academy and start building practical digital skills.",
};

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Apply to Techlance Academy"
        description="Complete the application form below. Our admissions team will review your application and contact you with the next steps."
      />

      <ApplyForm />
    </>
  );
}