import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Apply Now",
  description: "Start your application to Techlance Academy.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Application"
        title="Apply Now"
        description="Start your application to Techlance Academy."
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The full application form — personal information, education, skills, program preference, and learning mode — will be built here with React Hook Form and Zod validation, saving directly to the `applications` table and returning a trackable application ID.
        </p>
      </div>
    </>
  );
}
