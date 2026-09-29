import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  Laptop,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Student Policy",
  description:
    "General conduct, academic, and participation expectations for enrolled Techlance Academy students.",
};

const expectations = [
  {
    icon: Users,
    title: "Respect Others",
    description:
      "Students are expected to communicate respectfully with instructors, staff, classmates, and other members of the academy community.",
  },
  {
    icon: BookOpen,
    title: "Take Learning Seriously",
    description:
      "Students should actively participate in classes, complete learning activities, and make reasonable efforts to keep up with their program.",
  },
  {
    icon: FileText,
    title: "Submit Your Own Work",
    description:
      "Assignments, assessments, and projects should represent the student's own work unless collaboration is specifically permitted.",
  },
  {
    icon: Laptop,
    title: "Use Technology Responsibly",
    description:
      "Academy platforms, accounts, devices, and digital resources should be used responsibly and only for legitimate educational purposes.",
  },
];

const conductRules = [
  "Treat instructors, staff, and fellow students with professionalism and respect.",
  "Do not engage in harassment, threats, bullying, discrimination, or abusive communication.",
  "Do not intentionally disrupt live classes, discussions, workshops, or academy activities.",
  "Follow reasonable instructions provided by instructors and authorized academy staff.",
  "Use official communication channels appropriately and professionally.",
  "Do not share another student's private information without permission.",
];

const academicRules = [
  "Complete assignments and assessments honestly.",
  "Do not submit another person's work as your own.",
  "Do not impersonate another student during assessments or academy activities.",
  "Do not falsify attendance, academic records, project results, or other information.",
  "Credit external sources, references, or materials where appropriate.",
  "Ask the instructor when you are unsure whether collaboration or external assistance is permitted.",
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Student Policy"
        description="General conduct, academic, and participation expectations for enrolled students."
      />

      <main className="container-academy py-14">
        {/* Introduction */}
        <section className="mb-14">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Student Responsibilities
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Building a professional learning environment.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
                Techlance Academy aims to provide students with a structured,
                respectful, and practical learning environment. Every student
                plays a role in maintaining that environment.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                This Student Policy explains the general expectations
                regarding conduct, academic integrity, participation,
                communication, technology use, and student responsibilities.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Our expectations
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Students are expected to approach their learning with
                responsibility, honesty, respect, and professionalism.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "Be respectful",
                  "Attend and participate",
                  "Complete your own work",
                  "Communicate professionally",
                  "Protect account information",
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

        {/* Core expectations */}
        <section className="mb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Core Expectations
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              What we expect from every student
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              These principles apply across classes, projects, assessments,
              academy communication, and other student activities.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {expectations.map((item) => {
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

        {/* Conduct */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Conduct
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Professional and respectful behavior
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Students should contribute to a positive learning
                  environment. Respectful communication is expected whether
                  interacting in a live class, student group, email, dashboard,
                  or any other academy communication channel.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {conductRules.map((rule) => (
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

        {/* Academic integrity */}
        <section className="mb-14">
          <div className="rounded-3xl border border-border bg-background p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Academic Integrity
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Your work should represent your learning
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Students are expected to complete academic work honestly.
                  The purpose of assignments and assessments is to measure
                  learning and help students develop practical skills.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {academicRules.map((rule) => (
                <div
                  key={rule}
                  className="flex gap-3 rounded-xl border border-border bg-card p-4"
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

        {/* Attendance */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              Attendance & Participation
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Students are expected to attend scheduled classes and participate
              in their program according to the applicable attendance
              requirements. Regular participation helps students keep pace
              with lessons, projects, assessments, and instructor guidance.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="text-sm font-semibold">
                  Attend regularly
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Join scheduled classes and learning activities consistently.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-5">
                <p className="text-sm font-semibold">
                  Arrive on time
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Avoid missing important introductions, instructions, and
                  activities.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-5">
                <p className="text-sm font-semibold">
                  Stay engaged
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Participate appropriately throughout the learning session.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Communication */}
        <section className="mb-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Communication
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Students should use official academy communication channels for
              academic questions, attendance concerns, technical issues, and
              other student-related matters.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Messages should remain professional and respectful. Students
              should avoid sending spam, inappropriate material, or repeated
              unnecessary messages through academy channels.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Laptop className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Technology & Platform Use
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Students may be provided access to online learning platforms,
              student dashboards, communication tools, digital resources, or
              other technology services.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              These services should be used responsibly. Students must not
              attempt unauthorized access, interfere with platform operation,
              or misuse another person's account.
            </p>
          </div>
        </section>

        {/* Projects & portfolio */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-background p-7 sm:p-9">
            <h2 className="text-xl font-semibold">
              Projects, Assignments & Portfolio Work
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Students may create projects as part of their learning and
              portfolio development. Unless a specific project agreement says
              otherwise, students are responsible for ensuring that their
              submitted work does not unlawfully copy or misuse third-party
              content.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Students may be asked to demonstrate or present their projects
              for educational purposes. Any special use of student work by
              Techlance Academy should follow the applicable project,
              enrollment, or privacy terms.
            </p>
          </div>
        </section>

        {/* Account security */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <h2 className="text-xl font-semibold">
                  Student Account Security
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Students are responsible for keeping their login credentials
                  confidential. Do not share your password or give another
                  person access to your student dashboard.
                </p>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  If you believe your account has been compromised or accessed
                  without authorization, contact the academy team as soon as
                  possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Violations */}
        <section className="mb-14">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Policy Violations
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  What happens when a policy is violated?
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  If a student is believed to have violated this policy,
                  Techlance Academy may review the situation and request an
                  explanation or additional information where appropriate.
                </p>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Depending on the circumstances and severity of the issue,
                  possible actions may include a warning, additional academic
                  guidance, restriction of certain platform access, suspension,
                  or termination of enrollment or services.
                </p>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Serious matters involving safety, fraud, unauthorized
                  access, harassment, or unlawful activity may require
                  additional action under applicable policies or laws.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final note */}
        <section>
          <div className="rounded-3xl bg-primary px-7 py-10 text-primary-foreground sm:px-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  Student Success
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Learn, participate, and build professionally.
                </h2>

                <p className="mt-3 text-sm leading-6 opacity-80">
                  Following these expectations helps create a better learning
                  experience for you and the students around you.
                </p>
              </div>

              <div className="inline-flex shrink-0 items-center justify-center rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground">
                Techlance Academy
              </div>
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