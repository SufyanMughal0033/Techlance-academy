import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const root = "/home/claude/techlance-academy/app/(site)";

const pages = [
  {
    file: `${root}/programs/page.tsx`,
    title: "Programs",
    eyebrow: "Programs",
    description:
      "Practical, instructor-led programs in web development, digital marketing, design, and other in-demand digital skills.",
    body: "This page will list every active program pulled from the `programs` table — with search, category, level, and duration filters, each card linking through to its program detail page. Program content is managed entirely by academy admins; nothing here is hardcoded.",
  },
  {
    file: `${root}/admissions/page.tsx`,
    title: "Admissions",
    eyebrow: "Admissions",
    description:
      "How admission works at Techlance Academy — eligibility, the review process, and what to prepare before you apply.",
    body: "This page will cover admission requirements, who can apply, the step-by-step process, and program selection guidance, with a clear path into the full application form at /apply.",
  },
  {
    file: `${root}/apply/page.tsx`,
    title: "Apply Now",
    eyebrow: "Application",
    description: "Start your application to Techlance Academy.",
    body: "The full application form — personal information, education, skills, program preference, and learning mode — will be built here with React Hook Form and Zod validation, saving directly to the `applications` table and returning a trackable application ID.",
  },
  {
    file: `${root}/about/page.tsx`,
    title: "About Techlance Academy",
    eyebrow: "About",
    description:
      "Techlance Academy is the education and training division of Techlance, built to teach practical digital skills.",
    body: "This page will cover our mission, our approach to practical learning and mentorship, and how the academy relates to — and stays operationally distinct from — Techlance's client services business.",
  },
  {
    file: `${root}/faq/page.tsx`,
    title: "Frequently Asked Questions",
    eyebrow: "FAQ",
    description:
      "Answers to common questions about admissions, programs, fees, classes, and certificates.",
    body: "FAQs will be categorized and admin-managed, rendered here as a searchable accordion sourced from the `faqs` table.",
  },
  {
    file: `${root}/contact/page.tsx`,
    title: "Contact Us",
    eyebrow: "Contact",
    description: "Questions about a program or your application? Reach out.",
    body: "A validated contact form will live here, saving inquiries to the `contact_messages` table, alongside our email, phone, WhatsApp, and business hours.",
  },
  {
    file: `${root}/blog/page.tsx`,
    title: "Blog",
    eyebrow: "Blog",
    description:
      "Tutorials, career guidance, and industry updates from the Techlance Academy team.",
    body: "Published posts from the `blog_posts` table will be listed here with category filters, each linking to its own SEO-optimized detail page.",
  },
  {
    file: `${root}/certificate-verification/page.tsx`,
    title: "Certificate Verification",
    eyebrow: "Verification",
    description:
      "Verify the authenticity of a Techlance Academy certificate using its certificate ID.",
    body: "A verification form will let anyone enter a certificate ID and see its status — student name, program, issue date, and whether it's valid or revoked — without exposing any other student data.",
  },
  {
    file: `${root}/resources/page.tsx`,
    title: "Student Resources",
    eyebrow: "Resources",
    description:
      "Handbooks, guidelines, and downloadable materials for current and prospective students.",
    body: "Resources uploaded by admins to the `resources` table and Supabase Storage will be organized by category here.",
  },
];

const policyMeta = {
  privacy: ["Privacy Policy", "How Techlance Academy collects, uses, and protects your personal information."],
  terms: ["Terms & Conditions", "The terms that govern your use of the Techlance Academy website and platform."],
  "student-policy": ["Student Policy", "General conduct, academic, and participation expectations for enrolled students."],
  attendance: ["Attendance Policy", "How attendance is tracked and what's expected across live classes."],
  "code-of-conduct": ["Code of Conduct", "Standards of behaviour expected from every member of the academy community."],
  refund: ["Refund & Cancellation Policy", "How refunds and enrollment cancellations are handled."],
  certificate: ["Certificate Policy", "The requirements a student must meet before a certificate is issued."],
};

for (const [slug, [title, description]] of Object.entries(policyMeta)) {
  pages.push({
    file: `${root}/policies/${slug}/page.tsx`,
    title,
    eyebrow: "Policy",
    description,
    body: "This policy's full text will be managed as CMS content in the `site_content` table so academy staff can update it without a code change, falling back to the text seeded here.",
  });
}

const jsxText = (s) => s.replace(/'/g, "&apos;");

const template = ({ title, eyebrow, description, body }) => `import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "${title}",
  description: "${description.replace(/"/g, '\\"')}",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="${eyebrow}"
        title="${title}"
        description="${description.replace(/"/g, '\\"')}"
      />
      <div className="container-academy py-14">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          ${jsxText(body)}
        </p>
      </div>
    </>
  );
}
`;

for (const page of pages) {
  mkdirSync(dirname(page.file), { recursive: true });
  writeFileSync(page.file, template(page), "utf8");
  console.log("wrote", page.file);
}
