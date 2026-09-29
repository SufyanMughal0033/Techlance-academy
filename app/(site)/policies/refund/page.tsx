import {
  AlertCircle,
  Ban,
  CheckCircle2,
  CreditCard,
  FileText,
  HelpCircle,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Techlance Academy's refund and cancellation policy for program enrollment and payments.",
};

const policyPoints = [
  {
    icon: Ban,
    title: "No Refunds",
    description:
      "All payments made for Techlance Academy programs are non-refundable once enrollment or admission has been confirmed.",
  },
  {
    icon: CreditCard,
    title: "Payments Are Final",
    description:
      "Once a payment has been successfully received and the student's enrollment has been confirmed, the payment is considered final.",
  },
  {
    icon: UserCheck,
    title: "Student Responsibility",
    description:
      "Students are encouraged to review the program details, schedule, requirements, and applicable fees before making a payment.",
  },
  {
    icon: ShieldCheck,
    title: "Clear Enrollment Terms",
    description:
      "The applicable program fee and payment conditions will be communicated before or during the enrollment process.",
  },
];

const cancellationRules = [
  "A student may request to cancel their enrollment by contacting the academy team.",
  "Cancellation of enrollment does not create an automatic right to a refund.",
  "Payments already made toward a confirmed enrollment remain non-refundable.",
  "Students should carefully review program details before completing payment.",
  "If a student chooses not to continue after enrollment, the remaining learning access or program status will be handled according to the applicable program rules.",
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Refund & Cancellation Policy"
        description="How refunds and enrollment cancellations are handled at Techlance Academy."
      />

      <main className="container-academy py-14">
        {/* Main Notice */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Ban className="h-7 w-7" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Important Notice
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                All confirmed enrollment payments are non-refundable.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                Techlance Academy operates a no-refund policy for confirmed
                program enrollments. Students should review the program,
                schedule, requirements, duration, and applicable fees before
                completing their payment.
              </p>
            </div>
          </div>
        </section>

        {/* Policy Overview */}
        <section className="mb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Policy Overview
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Our refund policy
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Please read the following points carefully before completing your
              enrollment payment.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {policyPoints.map((item) => {
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

        {/* No Refund Details */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-background p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  No-Refund Policy
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Payments cannot be refunded after confirmation.
                </h2>

                <div className="mt-5 space-y-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    Once Techlance Academy has received a payment and the
                    student's enrollment has been confirmed, the payment is
                    considered final and is not eligible for a refund.
                  </p>

                  <p className="text-sm leading-7 text-muted-foreground">
                    This applies even if a student later decides not to attend,
                    stops participating, changes their plans, or chooses not to
                    continue with the program.
                  </p>

                  <p className="text-sm leading-7 text-muted-foreground">
                    Students are therefore strongly encouraged to ask any
                    questions and review the relevant program information
                    before making a payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cancellation */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <AlertCircle className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Cancellation
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Enrollment cancellation
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Students who decide not to continue with their program should
                  inform the Techlance Academy team as soon as possible.
                  However, cancellation after payment does not make the
                  payment refundable.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-3">
              {cancellationRules.map((rule) => (
                <div
                  key={rule}
                  className="flex gap-3 rounded-xl border border-border bg-background p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                  <p className="text-sm leading-6 text-muted-foreground">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before Payment */}
        <section className="mb-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Before You Pay
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Students should make sure they understand the program before
                completing payment.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "Program name and content",
                  "Program duration and schedule",
                  "Applicable enrollment fee",
                  "Attendance requirements",
                  "Learning and completion requirements",
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

            <div className="rounded-2xl border border-border bg-background p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HelpCircle className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Need More Information?
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                If you have questions about a program or its fee before
                enrolling, contact the academy team and get clarification
                before making your payment.
              </p>

              <div className="mt-5 rounded-xl border border-border bg-card p-4">
                <p className="text-xs leading-5 text-muted-foreground">
                  Once payment has been confirmed, the no-refund policy
                  applies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exceptions */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <h2 className="text-xl font-semibold">
                  Exceptional Circumstances
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Techlance Academy generally follows the no-refund policy
                  described above. If an exceptional situation requires
                  administrative review, the academy may review the matter on
                  a case-by-case basis. Any exception is at the academy's
                  discretion and does not create a general right to a refund.
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
                  Before Enrollment
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Have questions before making a payment?
                </h2>

                <p className="mt-3 text-sm leading-6 opacity-80">
                  Make sure you understand your selected program and its
                  requirements before confirming your enrollment.
                </p>
              </div>

              <div className="inline-flex shrink-0 items-center justify-center rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground">
                Review Before You Enroll
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