import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Programs",
  description: "Practical, instructor-led programs in web development, digital marketing, design, and other in-demand digital skills.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Programs"
        description="Practical, instructor-led programs in web development, digital marketing, design, and other in-demand digital skills."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This page will list every active program pulled from the `programs` table — with search, category, level, and duration filters, each card linking through to its program detail page. Program content is managed entirely by academy admins; nothing here is hardcoded.
        </p>
      </div>
    </>
  );
}
