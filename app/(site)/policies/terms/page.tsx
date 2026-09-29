import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  FileText,
  Gavel,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that govern your use of the Techlance Academy website, programs, student accounts, and platform.",
};

const sections = [
  {
    icon: UserCheck,
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using the Techlance Academy website, submitting an application, creating a student account, enrolling in a program, or using academy services, you agree to follow these Terms & Conditions.",
      "If you do not agree with these terms, you should not use the relevant academy services or platform features.",
      "Additional rules may apply to specific programs, courses, assessments, events, or services. Where applicable, those requirements will be communicated separately.",
    ],
  },
  {
    icon: GraduationCap,
    title: "2. Admissions & Enrollment",
    content: [
      "Submitting an application does not automatically guarantee admission. Applications may be reviewed according to the requirements and availability of the relevant program.",
      "Students are responsible for providing accurate, complete, and current information during the admission and enrollment process.",
      "Techlance Academy may request additional information when necessary to process an application or confirm enrollment.",
    ],
  },
  {
    icon: BookOpen,
    title: "3. Programs & Learning Services",
    content: [
      "Techlance Academy provides educational and training services through its programs, classes, learning materials, projects, assessments, and related activities.",
      "Course content, schedules, instructors, learning resources, and delivery methods may be updated when necessary to maintain or improve the learning experience.",
      "Program-specific requirements, schedules, attendance rules, assessments, and completion criteria may vary between programs.",
    ],
  },
  {
    icon: FileText,
    title: "4. Student Accounts",
    content: [
      "Where student accounts are provided, students are responsible for keeping their login credentials secure and should not share their passwords or account access with others.",
      "Students are responsible for activity performed through their account unless unauthorized access is reported to the academy within a reasonable period.",
      "Techlance Academy may restrict or suspend access where there is a reasonable concern regarding misuse, security, fraud, or violation of these terms.",
    ],
  },
  {
    icon: CheckCircle2,
    title: "5. Attendance & Participation",
    content: [
      "Students are expected to attend scheduled classes and participate in their enrolled program according to the applicable attendance requirements.",
      "Repeated absence, late arrival, or failure to participate may affect academic progress and, where applicable, eligibility for course completion or certification.",
      "Students should communicate significant attendance issues with the academy team as early as reasonably possible.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "6. Certificates & Verification",
    content: [
      "Certificates are issued only when the applicable program completion requirements have been satisfied.",
      "Certificate information may be recorded in the academy's certificate verification system so that the authenticity and status of a certificate can be verified.",
      "Students must not alter, reproduce, forge, misrepresent, or use a certificate in a way that falsely represents their academic achievement.",
      "Where serious discrepancies or fraudulent activity are identified, Techlance Academy may review and, where appropriate, revoke a certificate.",
    ],
  },
  {
    icon: LockKeyhole,
    title: "7. Intellectual Property",
    content: [
      "Unless otherwise stated, Techlance Academy's website design, branding, logos, original course materials, written content, graphics, videos, and other academy-owned materials are protected by applicable intellectual property laws.",
      "Students may use provided learning materials for their personal educational use within the scope of their enrollment.",
      "Students must not commercially reproduce, redistribute, resell, publish, or otherwise exploit academy-owned course materials without appropriate authorization.",
    ],
  },
  {
    icon: Gavel,
    title: "8. Acceptable Use",
    content: [
      "Students and website visitors must use the platform lawfully and responsibly.",
      "You must not attempt to gain unauthorized access to accounts, administrative systems, databases, or restricted areas of the platform.",
      "You must not intentionally interfere with website operation, introduce malicious software, abuse platform functionality, or use academy services for fraudulent or unlawful activities.",
    ],
  },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Terms & Conditions"
        description="The terms that govern your use of the Techlance Academy website, programs, student accounts, and platform."
      />

      <main className="container-academy py-14">
        {/* Introduction */}
        <section className="mb-14">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Please Read Carefully
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Terms for using Techlance Academy
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
                These Terms & Conditions establish the basic rules for using
                the Techlance Academy website, applying for programs,
                enrolling as a student, and accessing academy services.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                Our goal is to maintain a professional, respectful, secure,
                and productive learning environment for students, instructors,
                staff, and other users.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Key responsibilities
              </h3>

              <div className="mt-5 space-y-3">
                {[
                  "Provide accurate information.",
                  "Protect your student account.",
                  "Follow program and attendance requirements.",
                  "Respect academy staff and other students.",
                  "Use academy resources responsibly.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Terms */}
        <section className="mb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Terms
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Platform & student terms
            </h2>
          </div>

          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.title}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold tracking-tight">
                        {section.title}
                      </h3>

                      <div className="mt-4 space-y-4">
                        {section.content.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="text-sm leading-7 text-muted-foreground"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Payments */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-background p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              9. Fees, Payments & Refunds
            </h2>

            <div className="mt-4 space-y-4">
              <p className="text-sm leading-7 text-muted-foreground">
                Where a program requires payment, applicable fees and payment
                instructions will be communicated before enrollment or through
                the relevant official academy channel.
              </p>

              <p className="text-sm leading-7 text-muted-foreground">
                Students should review the applicable payment and refund terms
                before making a payment. Refund eligibility, deadlines, and
                applicable deductions may vary according to the program and
                payment arrangement.
              </p>

              <p className="text-sm leading-7 text-muted-foreground">
                Techlance Academy may update program pricing or available
                payment options for future enrollments. Changes will not
                retroactively alter an already confirmed arrangement unless
                otherwise communicated and agreed where required.
              </p>
            </div>
          </div>
        </section>

        {/* Student Conduct */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              10. Student Conduct
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Students are expected to maintain respectful and professional
              behavior when communicating with instructors, academy staff,
              classmates, and other members of the learning community.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Respect instructors and fellow students.",
                "Do not engage in harassment or abusive behavior.",
                "Do not submit another person's work as your own.",
                "Do not misuse academy communication channels.",
                "Do not attempt to disrupt classes or platform services.",
                "Follow reasonable instructions from academy staff.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-border bg-background p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                  <p className="text-sm leading-6 text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Academic Integrity */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              11. Academic Integrity
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Students are expected to complete assessments and academic work
              honestly. Plagiarism, impersonation, submitting another
              student's work, falsifying academic records, or other forms of
              academic misconduct may result in academic or administrative
              action.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The specific consequences of academic misconduct may depend on
              the circumstances, the program requirements, and the severity of
              the issue.
            </p>
          </div>
        </section>

        {/* Suspension */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <h2 className="text-xl font-semibold">
                  12. Suspension or Termination
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Techlance Academy may restrict, suspend, or terminate access
                  to certain services where there is a reasonable basis to
                  believe that a user has violated these terms, misused the
                  platform, engaged in fraudulent activity, created a security
                  risk, or seriously disrupted the learning environment.
                </p>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Where appropriate, the academy may provide an opportunity
                  for clarification or review before taking further
                  administrative action.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Website availability */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              13. Website Availability
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              We aim to keep the Techlance Academy website and platform
              available and reliable, but temporary interruptions may occur
              because of maintenance, updates, technical issues, hosting
              problems, network failures, or circumstances outside our
              reasonable control.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Academy schedules and digital services may occasionally be
              adjusted when necessary. Important changes will be communicated
              through appropriate official channels where possible.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-background p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              14. Educational Disclaimer
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Techlance Academy provides education and skills training.
              Completion of a course or receipt of a certificate does not
              guarantee employment, freelance income, business results, or any
              specific professional outcome.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Individual outcomes may depend on factors including a student's
              effort, skills, experience, portfolio, market conditions, and
              opportunities available to them.
            </p>
          </div>
        </section>

        {/* External links */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              15. Third-Party Services & Links
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The Techlance Academy website may contain links to third-party
              websites, tools, or services. These services may have their own
              terms, privacy policies, and rules.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Techlance Academy is not responsible for the policies or
              practices of external websites that it does not operate.
            </p>
          </div>
        </section>

        {/* Changes */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              16. Changes to These Terms
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Techlance Academy may update these Terms & Conditions from time
              to time to reflect changes in its services, platform, programs,
              operational practices, or applicable requirements.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Updated terms will be published on this page. Continued use of
              the relevant academy services after an update may be subject to
              the revised terms.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="rounded-3xl bg-primary px-7 py-10 text-primary-foreground sm:px-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  Need Clarification?
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Questions about these terms?
                </h2>

                <p className="mt-3 text-sm leading-6 opacity-80">
                  Contact the Techlance Academy team if you need clarification
                  about a program requirement, account, enrollment, or these
                  terms.
                </p>
              </div>

              <a
                href="mailto:techlanceofficial@gmail.com"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                Contact Academy
              </a>
            </div>
          </div>
        </section>

        {/* Last updated */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Last updated: September 2026
        </p>
      </main>
    </>
  );
}