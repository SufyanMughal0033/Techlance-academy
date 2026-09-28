import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Contact Us",
  description: "Questions about a program or your application? Reach out.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Us"
        description="Questions about a program or your application? Reach out."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A validated contact form will live here, saving inquiries to the `contact_messages` table, alongside our email, phone, WhatsApp, and business hours.
        </p>
      </div>
    </>
  );
}
