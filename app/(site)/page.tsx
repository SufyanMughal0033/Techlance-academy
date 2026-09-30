import Link from "next/link";
import {
  ArrowRight,
  Wrench,
  Video,
  Users,
  FolderGit2,
  Briefcase,
  TrendingUp,
  LifeBuoy,
  Award,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site-settings";

const VALUE_PROPS = [
  {
    icon: Wrench,
    title: "Practical Learning",
    description:
      "Every module is built around doing the work, not just watching it explained.",
  },
  {
    icon: Video,
    title: "Live Online Classes",
    description:
      "Instructor-led sessions on a fixed weekly schedule, not pre-recorded playlists.",
  },
  {
    icon: Users,
    title: "1-to-1 Mentorship",
    description:
      "Direct feedback from a mentor who reviews your work and unblocks you.",
  },
  {
    icon: FolderGit2,
    title: "Real Projects",
    description:
      "You leave each program with work you actually built, not just a completion badge.",
  },
  {
    icon: Briefcase,
    title: "Industry-Oriented Curriculum",
    description:
      "Curriculum shaped around what teams currently hire and pay for.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "A dashboard that shows exactly where you stand — modules, assignments, attendance.",
  },
  {
    icon: LifeBuoy,
    title: "Student Support",
    description:
      "A support channel for questions about classes, schedules, or your account.",
  },
  {
    icon: Award,
    title: "Certificates",
    description:
      "Issued on completion of program requirements, each independently verifiable.",
  },
];

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 0%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent)",
          }}
          aria-hidden="true"
        />

        <div className="container-academy relative py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">
              Techlance Academy — the training division of Techlance
            </p>

            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Build digital skills.
              <br />
              Build your future.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Learn web development, digital marketing, design, and other
              in-demand digital skills through live classes, 1-to-1
              mentorship, and real projects — guided by people who do this
              work professionally.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/apply">
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link href="/programs">Explore Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose Techlance Academy */}
      <section className="container-academy py-20">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Why choose Techlance Academy
          </h2>

          <p className="mt-3 text-muted-foreground">
            A structured way to learn a digital skill properly, with the
            accountability that self-taught learning usually lacks.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-3 bg-card p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="font-display text-base font-semibold text-foreground">
                {title}
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-secondary/60">
        <div className="container-academy flex flex-col items-start gap-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Start your digital skills journey
            </h2>

            <p className="mt-2 max-w-md text-muted-foreground">
              Applications are reviewed on a rolling basis. It takes about
              ten minutes to apply.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/apply">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <a
                href={`https://wa.me/${settings.contact.whatsapp.replace(
                  /[^\d]/g,
                  ""
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}