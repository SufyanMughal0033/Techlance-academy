import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  FileText,
  HeartHandshake,
  Laptop,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Code of Conduct",
  description:
    "Standards of behaviour, professionalism, respect, and academic integrity expected from every member of the Techlance Academy community.",
};

const conductStandards = [
  {
    icon: HeartHandshake,
    title: "Respect Others",
    description:
      "Treat students, instructors, staff, and other members of the academy community with respect, professionalism, and courtesy.",
  },
  {
    icon: MessageSquare,
    title: "Professional Communication",
    description:
      "Use appropriate and respectful language in classrooms, group chats, emails, online sessions, and all academy-related communication.",
  },
  {
    icon: BookOpen,
    title: "Academic Integrity",
    description:
      "Complete learning activities honestly and do not submit another person's work as your own or use unauthorized assistance.",
  },
  {
    icon: Users,
    title: "Positive Community",
    description:
      "Contribute to a learning environment where students can ask questions, share ideas, and learn without unnecessary disruption.",
  },
  {
    icon: Laptop,
    title: "Responsible Technology Use",
    description:
      "Use academy systems, learning materials, accounts, and digital resources responsibly and only for appropriate educational purposes.",
  },
  {
    icon: ShieldCheck,
    title: "Professional Conduct",
    description:
      "Students are expected to maintain professional behaviour during classes, projects, events, assessments, and academy activities.",
  },
];

const expectedBehaviours = [
  "Arrive on time and be prepared for scheduled classes or sessions.",
  "Listen to instructors and allow other students to participate without unnecessary interruption.",
  "Communicate respectfully with instructors, staff, classmates, and academy representatives.",
  "Use academy-provided learning resources and accounts responsibly.",
  "Submit your own work and properly acknowledge external sources when required.",
  "Respect the privacy, personal information, and work of other students.",
  "Follow reasonable instructions provided by instructors or academy staff.",
  "Raise concerns through the appropriate academy communication channels.",
];

const prohibitedBehaviours = [
  "Harassment, bullying, threats, intimidation, or abusive behaviour.",
  "Discrimination or inappropriate treatment of another member of the academy community.",
  "Sharing another student's personal information without permission.",
  "Cheating, plagiarism, impersonation, or deliberate academic misconduct.",
  "Unauthorized access to academy accounts, systems, files, or restricted resources.",
  "Attempting to damage, disrupt, manipulate, or misuse academy systems or services.",
  "Using academy communication channels for spam, scams, or inappropriate content.",
  "Repeated behaviour that significantly disrupts classes or the learning environment.",
];

const reportingSteps = [
  "Document the relevant details of the incident where possible.",
  "Contact the academy team or appropriate instructor through an official communication channel.",
  "Provide enough information for the academy to understand and review the concern.",
  "Cooperate with any reasonable follow-up questions or review process.",
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Code of Conduct"
        description="Standards of behaviour, respect, professionalism, and academic integrity expected from every member of the Techlance Academy community."
      />

      <main className="container-academy py-14">
        {/* Introduction */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HeartHandshake className="h-7 w-7" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Our Community Standard
              </p>

              <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Learn in an environment built on respect and professionalism.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                Techlance Academy is committed to creating a safe, respectful,
                inclusive, and productive learning environment. Every student,
                instructor, staff member, and other member of the academy
                community is expected to contribute positively to that
                environment.
              </p>
            </div>
          </div>
        </section>

        {/* Core Standards */}
        <section className="mb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Core Standards
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              What we expect from our community
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              These standards apply across physical classes, online sessions,
              projects, assessments, academy events, and official
              communication channels.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {conductStandards.map((item) => {
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

        {/* Expected Behaviour */}
        <section className="mb-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Expected Behaviour
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                How students should participate
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Students are expected to actively contribute to a respectful
                and productive learning environment.
              </p>

              <div className="mt-6 space-y-3">
                {expectedBehaviours.map((item) => (
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

            {/* Prohibited Behaviour */}
            <div className="rounded-2xl border border-border bg-background p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <AlertCircle className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Prohibited Behaviour
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Behaviour that is not acceptable
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                The following types of behaviour may result in review or
                disciplinary action depending on their nature and severity.
              </p>

              <div className="mt-6 space-y-3">
                {prohibitedBehaviours.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-xl border border-border bg-card p-4"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                    <p className="text-sm leading-6 text-muted-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Academic Integrity */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Academic Integrity
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Learn and submit work honestly.
                </h2>

                <div className="mt-5 space-y-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    Students are expected to complete assignments, projects,
                    assessments, and other academic work honestly. Using
                    another person's work and presenting it as your own may be
                    treated as academic misconduct.
                  </p>

                  <p className="text-sm leading-7 text-muted-foreground">
                    When external resources, code, references, or other
                    materials are used, students should follow the instructions
                    provided by their instructor regarding attribution and
                    acceptable use.
                  </p>

                  <p className="text-sm leading-7 text-muted-foreground">
                    Instructors may review submitted work where there is a
                    reasonable concern about plagiarism, cheating,
                    impersonation, or other forms of academic misconduct.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Digital Conduct */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-background p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Laptop className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Digital Conduct
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Responsible use of academy technology
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Academy accounts, learning platforms, communication channels,
                  digital resources, and other technology should be used for
                  legitimate educational and academy-related purposes. Students
                  should not attempt to access restricted information,
                  interfere with academy systems, or misuse another person's
                  account.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Protect your account credentials.",
                    "Do not access another student's account.",
                    "Do not intentionally disrupt academy systems.",
                    "Use digital resources for legitimate purposes.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
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

        {/* Harassment & Safety */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Respect & Safety
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  A learning environment where everyone can participate.
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Harassment, bullying, threats, intimidation, discriminatory
                  behaviour, or abusive conduct is not consistent with the
                  standards of Techlance Academy. Concerns involving safety or
                  serious misconduct should be reported to the academy team as
                  soon as reasonably possible.
                </p>

                <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                  <p className="text-sm font-medium">
                    Our expectation is simple:
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Treat people with dignity, respect personal boundaries, and
                    help maintain a learning environment where students and
                    staff can participate without unnecessary fear,
                    intimidation, or disruption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reporting */}
        <section className="mb-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Reporting a Concern
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Students or community members who experience or witness
                behaviour that may violate this Code of Conduct should contact
                the academy team through an official communication channel.
              </p>

              <div className="mt-6 space-y-3">
                {reportingSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Review */}
            <div className="rounded-2xl border border-border bg-background p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Review & Disciplinary Action
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                When a potential conduct violation is reported, Techlance
                Academy may review the available information and communicate
                with the relevant individuals where appropriate.
              </p>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Depending on the circumstances, actions may include a reminder
                of expectations, warning, restriction of participation,
                suspension, removal from a specific activity, or termination
                of enrollment.
              </p>

              <div className="mt-6 rounded-xl border border-border bg-card p-4">
                <p className="text-xs leading-5 text-muted-foreground">
                  The response to a conduct concern may depend on the nature,
                  severity, frequency, and circumstances of the reported
                  behaviour.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scope */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <h2 className="text-xl font-semibold">
                  Where This Policy Applies
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  This Code of Conduct applies to behaviour connected with
                  Techlance Academy, including in-person classes, online
                  classes, workshops, projects, assessments, academy events,
                  official student groups, digital platforms, and other
                  academy-related activities.
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
                  Our Community
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Learn. Build. Respect. Grow.
                </h2>

                <p className="mt-3 text-sm leading-6 opacity-80">
                  Every member of Techlance Academy plays a role in creating a
                  professional and productive learning environment.
                </p>
              </div>

              <div className="inline-flex shrink-0 items-center justify-center rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground">
                Academy Standards
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