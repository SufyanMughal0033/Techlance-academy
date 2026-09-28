import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Certificate Verification",
  description: "Verify the authenticity of a Techlance Academy certificate using its certificate ID.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Verification"
        title="Certificate Verification"
        description="Verify the authenticity of a Techlance Academy certificate using its certificate ID."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A verification form will let anyone enter a certificate ID and see its status — student name, program, issue date, and whether it&apos;s valid or revoked — without exposing any other student data.
        </p>
      </div>
    </>
  );
}
