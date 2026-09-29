import {
  AlertCircle,
  Award,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  FileCheck2,
  FileText,
  GraduationCap,
  HelpCircle,
  QrCode,
  ShieldCheck,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Certificate Policy",
  description:
    "Techlance Academy's certificate requirements, eligibility criteria, issuance process, verification, and certificate policies.",
};

const certificateRequirements = [
  {
    icon: CalendarCheck2,
    title: "Attendance",
    description:
      "Students must meet the applicable attendance requirements of their enrolled program.",
  },
  {
    icon: BookOpen,
    title: "Course Completion",
    description:
      "Students are expected to complete the required lessons, learning activities, and coursework for their program.",
  },
  {
    icon: FileCheck2,
    title: "Projects & Assessments",
    description:
      "Required projects, practical work, assessments, or other completion activities must be completed where applicable.",
  },
  {
    icon: GraduationCap,
    title: "Program Requirements",
    description:
      "Students must satisfy the completion requirements communicated for their specific program before a certificate is issued.",
  },
];

const completionChecklist = [
  "Required classes or learning sessions have been completed.",
  "Applicable attendance requirements have been met.",
  "Required assignments, projects, or practical work have been completed.",
  "Required assessments or evaluations have been completed where applicable.",
  "Any other program-specific completion requirements have been satisfied.",
];

const certificateFeatures = [
  {
    icon: ShieldCheck,
    title: "Unique Certificate ID",
    description:
      "Each issued certificate can have a unique identification number that can be used for verification.",
  },
  {
    icon: QrCode,
    title: "Online Verification",
    description:
      "Where enabled, a certificate may include a QR code or verification reference that links to the academy's verification system.",
  },
  {
    icon: Award,
    title: "Official Certificate",
    description:
      "Certificates are issued by Techlance Academy after the applicable program completion requirements have been reviewed.",
  },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Certificate Policy"
        description="The requirements a student must meet before a certificate is issued and how Techlance Academy certificates are verified."
      />

      <main className="container-academy py-14">
        {/* Main Notice */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Award className="h-7 w-7" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Certificate Eligibility
              </p>

              <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Certificates are issued after program requirements are
                completed.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                Completing an enrollment or attending individual classes does
                not automatically guarantee a certificate. Students must
                satisfy the applicable academic, attendance, project,
                assessment, and completion requirements of their enrolled
                program.
              </p>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Requirements
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              What students need to complete
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Certificate requirements can vary depending on the program.
              Students should follow the completion criteria communicated by
              their instructor or academy team.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {certificateRequirements.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Completion Checklist */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-background p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Completion Checklist
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Before a certificate can be issued
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  The academy may review the student's overall completion
                  status before approving certificate issuance.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {completionChecklist.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-border bg-card p-4"
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

        {/* Attendance & Certificate */}
        <section className="mb-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarCheck2 className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Attendance
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Attendance can be part of certification requirements.
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Students are expected to meet the attendance requirements
                applicable to their program. Consistently missing required
                classes may affect a student's ability to complete the program
                and qualify for a certificate.
              </p>

              <div className="mt-5 rounded-xl border border-border bg-background p-4">
                <p className="text-xs leading-5 text-muted-foreground">
                  Specific attendance thresholds, where applicable, may vary
                  between programs and will be communicated separately.
                </p>
              </div>
            </div>

            {/* Academic Completion */}
            <div className="rounded-2xl border border-border bg-background p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Academic Completion
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Learning progress matters.
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Students may need to complete required assignments, practical
                projects, assessments, or other learning activities before
                being considered eligible for certification.
              </p>

              <div className="mt-5 rounded-xl border border-border bg-card p-4">
                <p className="text-xs leading-5 text-muted-foreground">
                  Simply enrolling in a program or attending some classes does
                  not by itself establish certificate eligibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Issuance Process */}
        <section className="mb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Issuance Process
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              How certificates are issued
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Certificate issuance follows a completion review process rather
              than being generated automatically at enrollment.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {[
              {
                number: "01",
                title: "Complete",
                text: "Student completes the required program activities.",
              },
              {
                number: "02",
                title: "Review",
                text: "Academy reviews the student's completion status.",
              },
              {
                number: "03",
                title: "Issue",
                text: "Certificate is issued to an eligible student.",
              },
              {
                number: "04",
                title: "Verify",
                text: "Certificate can be verified using its unique reference.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                  {item.number}
                </div>

                <h3 className="mt-5 font-semibold">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Certificate Information */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Certificate Information
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  What an issued certificate may contain
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  An official certificate may contain information such as the
                  student's name, completed program, issue date, certificate
                  identification number, and other relevant academy details.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    "Student name",
                    "Program name",
                    "Issue date",
                    "Certificate ID",
                    "Academy information",
                    "Verification reference",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background p-4"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />

                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verification */}
        <section className="mb-14">
          <div className="grid gap-5 md:grid-cols-3">
            {certificateFeatures.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-background p-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Certificate ID */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Certificate Identification
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Every certificate should have a unique reference.
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                  When certificate management is enabled, Techlance Academy
                  can assign a unique certificate ID to each issued
                  certificate. This reference can be used to identify the
                  certificate in the academy's verification system.
                </p>

                <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Example Format
                  </p>

                  <p className="mt-2 font-mono text-lg font-semibold">
                    TLA-2026-000123
                  </p>

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    The example above is for illustration only. Actual
                    certificate IDs are generated and assigned by the academy
                    system when a certificate is issued.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verification Status */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-background p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Verification Status
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Certificate records may have different statuses.
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                  A certificate verification system may identify whether a
                  certificate record is valid, not found, or has been revoked.
                  Verification information should be checked through the
                  official Techlance Academy verification system.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      title: "Valid",
                      text: "The certificate record is recognized as active.",
                    },
                    {
                      title: "Not Found",
                      text: "No matching certificate record was found.",
                    },
                    {
                      title: "Revoked",
                      text: "The certificate record has been marked as revoked.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <h3 className="text-sm font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Replacement / Corrections */}
        <section className="mb-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Corrections & Reissued Certificates
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                If an issued certificate contains an administrative or
                typographical error, the student may contact the academy team
                for review. Where appropriate, the academy may correct the
                record and issue an updated certificate.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HelpCircle className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Lost Certificate
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Students who lose access to an issued certificate should
                contact the academy team. If the certificate record is
                available, the academy may provide appropriate guidance for
                accessing or obtaining a replacement copy.
              </p>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <h2 className="text-xl font-semibold">
                  Important Certificate Notice
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  A certificate represents completion of the applicable
                  Techlance Academy program requirements. It should not be
                  interpreted as a guarantee of employment, income, admission
                  to another institution, or any particular professional
                  outcome.
                </p>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Certificate eligibility and issuance remain subject to the
                  requirements applicable to the student's specific program.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <div className="rounded-3xl bg-primary px-7 py-10 text-primary-foreground sm:px-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  Complete Your Journey
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Learn, complete, and earn your certificate.
                </h2>

                <p className="mt-3 text-sm leading-6 opacity-80">
                  Stay consistent with your attendance, coursework, projects,
                  and program requirements throughout your learning journey.
                </p>
              </div>

              <div className="inline-flex shrink-0 items-center justify-center rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground">
                Certificate Standards
              </div>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Last updated: September 2026
        </p>
      </main>
    </>
  );
}