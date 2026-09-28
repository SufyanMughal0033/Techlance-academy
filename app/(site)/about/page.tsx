import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "About Techlance Academy",
  description: "Techlance Academy is the education and training division of Techlance, built to teach practical digital skills.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="About Techlance Academy"
        description="Techlance Academy is the education and training division of Techlance, built to teach practical digital skills."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This page will cover our mission, our approach to practical learning and mentorship, and how the academy relates to — and stays operationally distinct from — Techlance&apos;s client services business.
        </p>
      </div>
    </>
  );
}
