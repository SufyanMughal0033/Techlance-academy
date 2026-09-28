import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import ContactContent from "@/components/marketing/contact-content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions about a program or your application? Contact Techlance Academy for admissions, programs, and course information.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Talk"
        description="Have a question about a program, admission, or your learning journey? Our team is here to help."
      />

      <ContactContent />
    </>
  );
}