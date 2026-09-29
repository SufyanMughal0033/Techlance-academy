import {
  AlertCircle,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  HelpCircle,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Attendance Policy",
  description:
    "Techlance Academy's attendance requirements, absence guidelines, late arrival rules, and attendance standards for students.",
};

const attendanceStandards = [
  {
    icon: CalendarCheck2,
    title: "Regular Attendance",
    description:
      "Students are expected to attend scheduled classes regularly and participate consistently throughout their enrolled program.",
  },
  {
    icon: Clock3,
    title: "Be On Time",
    description:
      "Students should join live classes before the scheduled start time so they are ready when the session begins.",
  },
  {
    icon: UserCheck,
    title: "Active Participation",
    description:
      "Attendance means more than joining a session. Students are expected to remain engaged and participate appropriately during classes.",
  },
  {
    icon: GraduationCap,
    title: "Academic Progress",
    description:
      "Consistent attendance supports learning, project completion, assessments, and overall progress through the program.",
  },
];

const attendanceRules = [
  "Students should attend all scheduled classes unless they have a valid reason for absence.",
  "Students should join live sessions on time and remain available for the duration of the class.",
  "Repeated late arrivals may be treated as an attendance concern.",
  "Students who cannot attend should inform the relevant instructor or academy team as soon as reasonably possible.",
  "Students are responsible for catching up on material missed during an approved or unavoidable absence.",
  "Attendance records may be maintained by the academy for academic and administrative purposes.",
];

const absenceGuidelines = [
  "Inform the instructor or academy team before the class whenever possible.",
  "Provide a brief reason for the absence if requested.",
  "Review the material, notes, recordings, or assignments missed during the session.",
  "Complete any required work within the timeframe communicated by the instructor.",
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Attendance Policy"
        description="How attendance is tracked and what's expected across live classes, learning sessions, and academy activities."
      />

      <main className="container-academy py-14">
        {/* Main Notice */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CalendarCheck2 className="h-7 w-7" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Important Notice
              </p>

              <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Consistent attendance is an important part of your learning
                journey.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                Techlance Academy expects students to attend their scheduled
                classes regularly, arrive on time, and actively participate in
                learning activities. Regular attendance helps students stay
                aligned with the course material and complete their program
                successfully.
              </p>
            </div>
          </div>
        </section>

        {/* Attendance Standards */}
        <section className="mb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Attendance Standards
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              What we expect from students
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Attendance expectations apply to scheduled live classes,
              workshops, practical sessions, assessments, and other required
              learning activities.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {attendanceStandards.map((item) => {
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

        {/* How Attendance Is Tracked */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-background p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Attendance Tracking
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  How attendance may be recorded
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Attendance may be recorded by the academy using class
                  attendance records, instructor confirmation, online session
                  participation, or other reasonable methods appropriate to the
                  program.
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: "Class Attendance",
                      text: "Attendance can be marked for each scheduled class or learning session.",
                    },
                    {
                      title: "Online Participation",
                      text: "For online sessions, participation and presence may be considered when recording attendance.",
                    },
                    {
                      title: "Instructor Records",
                      text: "Instructors may maintain attendance information for their assigned classes.",
                    },
                    {
                      title: "Program Records",
                      text: "Attendance information may be used as part of the student's academic record.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border bg-card p-5"
                    >
                      <h3 className="text-sm font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Attendance Rules */}
        <section className="mb-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Student Responsibilities
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Attendance requirements
              </h2>

              <div className="mt-6 space-y-3">
                {attendanceRules.map((rule) => (
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

            {/* Late Arrival */}
            <div className="rounded-2xl border border-border bg-background p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock3 className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Punctuality
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Late arrival
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Students should make reasonable efforts to join classes before
                the scheduled start time. Occasional unavoidable delays may
                happen, but repeated late arrival can affect participation and
                learning progress.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Join the class before the scheduled start time.",
                  "Avoid repeatedly entering sessions late.",
                  "Minimize disruption when joining an ongoing class.",
                  "Contact the instructor if a recurring scheduling issue affects attendance.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                  >
                    <Clock3 className="h-4 w-4 shrink-0 text-primary" />

                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Absence & Leave */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Absence & Leave
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  What to do if you cannot attend
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                  If a student is unable to attend a scheduled class because of
                  an unavoidable circumstance, they should notify the relevant
                  instructor or academy team as early as possible.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {absenceGuidelines.map((item) => (
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

                <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                  <p className="text-sm font-medium">
                    Important
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Approval of an absence or leave request does not
                    automatically guarantee a change to the program schedule,
                    assessment deadlines, or completion requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Missed Classes */}
        <section className="mb-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Missed Classes
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Students are responsible for reviewing missed material and
                keeping up with the program. Depending on the course,
                instructors may provide notes, recordings, resources, or
                alternative guidance.
              </p>

              <div className="mt-5 rounded-xl border border-border bg-card p-4">
                <p className="text-xs leading-5 text-muted-foreground">
                  Students should not assume that every missed class will be
                  repeated individually.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Attendance & Certification
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Attendance may be considered alongside academic progress,
                participation, project completion, assessments, and other
                program requirements when determining whether a student has
                completed the applicable requirements.
              </p>

              <div className="mt-5 rounded-xl border border-border bg-background p-4">
                <p className="text-xs leading-5 text-muted-foreground">
                  Specific attendance or completion requirements may vary by
                  program and will be communicated where applicable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Attendance Concerns */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Attendance Concerns
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  What happens with repeated absences?
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Repeated absences, persistent late arrival, or prolonged
                  disengagement may affect a student's academic progress. The
                  academy may contact the student to discuss attendance and
                  determine appropriate next steps.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    "Attendance review",
                    "Student communication",
                    "Academic guidance",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-border bg-background p-4 text-center"
                    >
                      <p className="text-sm font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Common Questions
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Attendance FAQs
            </h2>
          </div>

          <div className="grid gap-4">
            {[
              {
                question: "What if I cannot attend one class?",
                answer:
                  "Inform your instructor or the academy team as soon as possible and make arrangements to review the missed material.",
              },
              {
                question: "Does joining late count as attendance?",
                answer:
                  "Attendance may still be recorded, but repeated late arrival can be considered an attendance concern and may affect participation.",
              },
              {
                question: "Can I make up a missed class?",
                answer:
                  "Make-up arrangements depend on the specific program and available learning resources. Students should contact their instructor for guidance.",
              },
              {
                question: "Can attendance affect my certificate?",
                answer:
                  "Attendance may be considered alongside other academic and completion requirements. Specific requirements may vary by program.",
              },
            ].map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HelpCircle className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="font-semibold">{item.question}</h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <div className="rounded-3xl bg-primary px-7 py-10 text-primary-foreground sm:px-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  Stay Consistent
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Show up, stay engaged, and keep learning.
                </h2>

                <p className="mt-3 text-sm leading-6 opacity-80">
                  Regular attendance helps you stay connected with your
                  instructors, classmates, projects, and learning goals.
                </p>
              </div>

              <div className="inline-flex shrink-0 items-center justify-center rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground">
                Attendance Standards
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