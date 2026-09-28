import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  GraduationCap,
  Lightbulb,
  Target,
  Users,
  Zap,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "About Techlance Academy",
  description:
    "Learn about Techlance Academy, our practical approach to digital education, mentorship, and career-focused training.",
};

const values = [
  {
    icon: Target,
    title: "Practical Learning",
    description:
      "We focus on skills students can actually use to build projects, solve problems, and work in real digital environments.",
  },
  {
    icon: Users,
    title: "Mentorship",
    description:
      "Students learn with guidance, feedback, and a structured approach instead of being left to figure everything out alone.",
  },
  {
    icon: Code2,
    title: "Industry-Relevant Skills",
    description:
      "Our learning paths are designed around modern digital skills, tools, workflows, and technologies used in the industry.",
  },
  {
    icon: Zap,
    title: "Growth Mindset",
    description:
      "We encourage students to keep learning, experiment with new ideas, and continuously improve their technical and professional abilities.",
  },
];

const learningPoints = [
  "Project-based learning",
  "Hands-on practical sessions",
  "Real-world examples and workflows",
  "Mentorship and instructor guidance",
  "Portfolio-focused development",
  "Career and professional growth",
];

const journey = [
  {
    number: "01",
    title: "Learn",
    description:
      "Build a strong foundation through structured lessons and practical guidance.",
  },
  {
    number: "02",
    title: "Practice",
    description:
      "Turn concepts into practical skills through exercises, projects, and real scenarios.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Create meaningful projects that demonstrate your skills and help build confidence.",
  },
  {
    number: "04",
    title: "Grow",
    description:
      "Develop the professional mindset and skills needed for your next step.",
  },
];

export default function Page() {
  return (
    <>
      {/* Hero */}
      <PageHero
        eyebrow="About Techlance Academy"
        title="Learn skills. Build confidence. Create your future."
        description="Techlance Academy is the education and training division of Techlance, created to help students and aspiring professionals develop practical digital skills through structured learning, hands-on projects, and mentorship."
      />

      {/* Introduction */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="container-academy">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                Who We Are
              </span>

              <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Education designed around{" "}
                <span className="text-primary">real skills.</span>
              </h2>

              <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                <p>
                  Techlance Academy is built for people who want to learn
                  modern digital skills in a practical and structured
                  environment.
                </p>

                <p>
                  Instead of focusing only on theory, we believe students
                  should understand how skills are actually applied. That means
                  learning concepts, practicing them, building projects, and
                  receiving guidance throughout the process.
                </p>

                <p>
                  Our goal is simple: help learners move from{" "}
                  <span className="font-semibold text-foreground">
                    "I want to learn"
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-foreground">
                    "I can build."
                  </span>
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-muted/30 p-5">
                    <BookOpen className="mb-4 h-7 w-7 text-primary" />
                    <p className="text-2xl font-bold">Learn</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Structured knowledge
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/30 p-5">
                    <Code2 className="mb-4 h-7 w-7 text-primary" />
                    <p className="text-2xl font-bold">Practice</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Hands-on experience
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/30 p-5">
                    <BriefcaseBusiness className="mb-4 h-7 w-7 text-primary" />
                    <p className="text-2xl font-bold">Build</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Real projects
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/30 p-5">
                    <Lightbulb className="mb-4 h-7 w-7 text-primary" />
                    <p className="text-2xl font-bold">Grow</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Professional mindset
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="border-y border-border bg-muted/20 py-20 sm:py-24">
        <div className="container-academy">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Our Purpose
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Why Techlance Academy exists
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              We want to make practical digital education more accessible to
              people who are ready to learn, practice, and build.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-background p-7 sm:p-9">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>

              <h3 className="text-2xl font-bold">Our Mission</h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                To provide practical, structured, and career-focused digital
                education that helps learners develop skills they can apply
                beyond the classroom.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-background p-7 sm:p-9">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>

              <h3 className="text-2xl font-bold">Our Vision</h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                To build a learning environment where aspiring digital
                professionals can turn knowledge into practical ability,
                meaningful projects, and long-term growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Approach */}
      <section className="py-20 sm:py-24">
        <div className="container-academy">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Our Approach
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                More than watching lessons.
              </h2>

              <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                Learning becomes valuable when you can apply it. That is why
                our approach combines knowledge, practice, projects, feedback,
                and mentorship.
              </p>

              <div className="mt-8">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Explore Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {learningPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-muted/20 py-20 sm:py-24">
        <div className="container-academy">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              What We Value
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Principles behind the academy.
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              Everything we build at Techlance Academy is guided by a simple
              belief: learning should lead to meaningful ability.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group rounded-3xl border border-border bg-background p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>

                  <h3 className="text-lg font-bold">{value.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 sm:py-24">
        <div className="container-academy">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              The Learning Journey
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              From learning to doing.
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              A simple journey designed to help learners progress with
              purpose.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {journey.map((item) => (
              <div
                key={item.number}
                className="relative rounded-3xl border border-border bg-card p-6"
              >
                <span className="text-4xl font-black tracking-tight text-primary/20">
                  {item.number}
                </span>

                <h3 className="mt-5 text-xl font-bold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Techlance Relationship */}
      <section className="border-y border-border bg-muted/20 py-20 sm:py-24">
        <div className="container-academy">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-background p-7 shadow-sm sm:p-10 lg:p-12">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <BriefcaseBusiness className="h-7 w-7 text-primary" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Part of Techlance
                </span>

                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Connected to the industry. Focused on education.
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  <p>
                    Techlance Academy is the education and training division of
                    Techlance.
                  </p>

                  <p>
                    While Techlance focuses on delivering digital products,
                    websites, marketing, and technology services to clients,
                    Techlance Academy focuses on education, training,
                    mentorship, and learner development.
                  </p>

                  <p>
                    This connection allows the academy to keep its learning
                    approach close to modern digital industry practices while
                    maintaining its own educational focus and operations.
                  </p>
                </div>

                <Link
                  href="/"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Explore Techlance
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <div className="container-academy">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-primary px-7 py-14 text-center text-primary-foreground sm:px-12 sm:py-16">
            <div className="relative mx-auto max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
                Start Your Journey
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to build your digital future?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 opacity-80 sm:text-base">
                Explore our courses and find a learning path that matches
                your goals.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
                >
                  View Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/admissions"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3 text-sm font-semibold transition hover:bg-primary-foreground/10"
                >
                  Apply for Admission
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}