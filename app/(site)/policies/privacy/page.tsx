import {
  AlertCircle,
  Database,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Techlance Academy collects, uses, stores, and protects your personal information.",
};

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "When you interact with Techlance Academy, we may collect information that you provide directly, such as your name, email address, phone number, educational information, and other details submitted through admission or contact forms.",
      "We may also collect information related to your enrollment, course participation, attendance, assessments, certificates, and interactions with academy services.",
      "Some technical information may be collected automatically when you use our website, such as browser type, device information, general usage activity, and pages visited.",
    ],
  },
  {
    icon: UserCheck,
    title: "How We Use Your Information",
    content: [
      "We use collected information to process admissions, manage student accounts, provide educational services, communicate with students, and operate the academy platform.",
      "Information may also be used to maintain attendance and academic records, issue certificates, respond to inquiries, improve our services, and provide important program-related announcements.",
      "We do not use your personal information for purposes that are unrelated to the services you requested without an appropriate reason or legal basis.",
    ],
  },
  {
    icon: FileText,
    title: "Admissions & Student Information",
    content: [
      "Information submitted through an admission or application form may be reviewed by authorized Techlance Academy staff for enrollment and administrative purposes.",
      "Students are responsible for providing accurate and up-to-date information. If your information changes, you should update it through the available student or academy support channels.",
      "Student information may be retained for legitimate academic, administrative, legal, and record-keeping purposes.",
    ],
  },
  {
    icon: LockKeyhole,
    title: "How We Protect Information",
    content: [
      "Techlance Academy takes reasonable administrative and technical measures to protect personal information against unauthorized access, misuse, alteration, or disclosure.",
      "Access to student and administrative information is intended to be limited to people who require it for legitimate academy responsibilities.",
      "No online system can guarantee absolute security. Students should also protect their account credentials and avoid sharing passwords with others.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Information Sharing",
    content: [
      "We do not intend to sell students' personal information as a commercial product.",
      "Information may be shared with authorized service providers or technology platforms when necessary to operate services such as hosting, authentication, communications, payments, analytics, or database functionality.",
      "Information may also be disclosed when required by applicable law, legal process, or to protect the rights, security, and legitimate interests of the academy, students, or others.",
    ],
  },
  {
    icon: Mail,
    title: "Communication",
    content: [
      "We may use the contact information you provide to communicate with you about admissions, classes, schedules, assessments, certificates, account activity, support requests, and other important academy matters.",
      "Where appropriate, you may also receive informational or promotional communications related to Techlance Academy. You can contact the academy if you no longer wish to receive non-essential communications.",
    ],
  },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Privacy Policy"
        description="How Techlance Academy collects, uses, stores, and protects your personal information."
      />

      <main className="container-academy py-14">
        {/* Introduction */}
        <section className="mb-14">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Your Privacy Matters
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                We aim to handle your information responsibly.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
                This Privacy Policy explains how Techlance Academy may
                collect, use, store, and protect information when you visit
                our website, apply for a program, create an account, or use
                academy services.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                By using Techlance Academy services, you acknowledge that
                information may be processed as described in this policy,
                subject to applicable laws and the specific services you use.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Privacy at a glance
              </h3>

              <ul className="mt-4 space-y-3">
                {[
                  "We collect information needed to operate academy services.",
                  "Access to personal information is limited to legitimate purposes.",
                  "We take reasonable measures to protect stored information.",
                  "You can contact us about your personal information.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-muted-foreground"
                  >
                    <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Policy sections */}
        <section className="mb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Privacy Details
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              How your information is handled
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

        {/* Cookies */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-background p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              Cookies & Website Technologies
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Techlance Academy may use cookies or similar technologies to
              maintain website functionality, remember preferences, understand
              general website usage, and improve the user experience.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Depending on your browser and applicable settings, you may be
              able to control or disable certain cookies. Disabling necessary
              technologies may affect some website functionality.
            </p>
          </div>
        </section>

        {/* Data retention */}
        <section className="mb-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Database className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Data Retention
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              We may retain personal information for as long as reasonably
              necessary to provide services, maintain academic and
              administrative records, resolve disputes, comply with legal
              obligations, and support legitimate business or educational
              purposes.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserCheck className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Your Privacy Choices
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Depending on applicable law, you may have rights relating to
              your personal information, including requesting access,
              correction, or clarification about how certain information is
              used.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              To make a privacy-related request, contact Techlance Academy
              through the official contact channel provided on the website.
            </p>
          </div>
        </section>

        {/* Children's privacy */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              Student & Children&apos;s Privacy
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Our programs may have specific eligibility or enrollment
              requirements. Where a student is a minor or additional consent
              is required by applicable law, the academy may request
              appropriate information or authorization before providing
              certain services.
            </p>
          </div>
        </section>

        {/* Third-party services */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              Third-Party Services & External Links
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Our website or academy services may use third-party tools or
              contain links to external websites. Those services operate
              under their own privacy policies and terms.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Techlance Academy is not responsible for the privacy practices
              of external websites that are not operated by the academy. We
              recommend reviewing the privacy information of any third-party
              service before submitting personal information.
            </p>
          </div>
        </section>

        {/* Policy changes */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <h2 className="text-lg font-semibold">
                  Changes to This Privacy Policy
                </h2>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  We may update this Privacy Policy from time to time to
                  reflect changes in our services, technology, legal
                  requirements, or operational practices. Updated versions
                  will be published on this page with an appropriate revision
                  date where applicable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="rounded-3xl bg-primary px-7 py-10 text-primary-foreground sm:px-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  Privacy Questions
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Have a question about your information?
                </h2>

                <p className="mt-3 text-sm leading-6 opacity-80">
                  Contact the Techlance Academy team if you need clarification
                  about this policy or how your information is handled.
                </p>
              </div>

              <a
                href="mailto:techlanceofficial@gmail.com"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                <Mail className="h-4 w-4" />
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