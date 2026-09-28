import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  HelpCircle,
  MessageCircle,
  Search,
  UserCheck,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Admissions | Techlance Academy",
  description:
    "Learn how admission works at Techlance Academy, including eligibility, the application process, program selection, and what to prepare before applying.",
};

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Submit Your Application",
    description:
      "Complete the online admission application with your personal details, educational background, and preferred program.",
  },
  {
    number: "02",
    icon: Search,
    title: "Application Review",
    description:
      "Our academy team reviews the information you provide and checks your application for the selected program.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Confirmation & Guidance",
    description:
      "If additional information or guidance is required, our team can contact you regarding the next steps.",
  },
  {
    number: "04",
    icon: GraduationCap,
    title: "Start Your Learning Journey",
    description:
      "After confirmation, you receive the relevant program information and can begin your learning journey with Techlance Academy.",
  },
];

const requirements = [
  "Basic interest in the selected field",
  "Willingness to learn and practice",
  "Access to a computer or suitable learning device where required",
  "Commitment to attending sessions and completing practical work",
  "Accurate information in the admission application",
];

const preparation = [
  {
    icon: GraduationCap,
    title: "Choose Your Program",
    description:
      "Review available programs and select the one that matches your interests and learning goals.",
  },
  {
    icon: ClipboardCheck,
    title: "Prepare Your Information",
    description:
      "Keep your basic personal and educational information ready before starting the application.",
  },
  {
    icon: UserCheck,
    title: "Know Your Goals",
    description:
      "Think about what you want to achieve from the program so you can choose a suitable learning path.",
  },
];

const faqs = [
  {
    question: "Who can apply to Techlance Academy?",
    answer:
      "Anyone interested in developing practical digital skills can explore the available programs. Specific requirements may vary depending on the program.",
  },
  {
    question: "Do I need previous experience?",
    answer:
      "Previous experience depends on the selected program. Some programs can be suitable for beginners, while others may benefit from existing knowledge.",
  },
  {
    question: "How do I apply?",
    answer:
      "Start by selecting your preferred program and then complete the online application form through the Apply Now button.",
  },
  {
    question: "Can I apply if I am still studying?",
    answer:
      "Yes. Students can explore programs that fit their schedule and current learning level. Program-specific requirements may vary.",
  },
];

export default function Page() {
  return (
    <>
      {/* Hero */}
      <PageHero
        eyebrow="Admissions"
        title="Your next skill starts with one application."
        description="Explore our programs, understand the admission process, and take the first step toward building practical digital skills at Techlance Academy."
      />

      {/* Quick intro */}
      <section className="border-b border-border bg-muted/20">
        <div className="container-academy py-12">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Start Here
              </span>

              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                A simple path from application to learning.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                We keep the admission journey straightforward so you can focus
                on choosing the right program and preparing yourself for
                practical learning.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <ClipboardCheck className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <p className="font-bold">Ready to apply?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Complete the online application.
                  </p>
                </div>
              </div>

              <Link
                href="/apply"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-20 sm:py-24">
        <div className="container-academy">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Admission Process
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How admission works.
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              Follow these simple steps to begin your journey with Techlance
              Academy.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative rounded-3xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <span className="text-4xl font-black tracking-tight text-primary/10">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-lg font-bold">{step.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="border-y border-border bg-muted/20 py-20 sm:py-24">
        <div className="container-academy">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Who Can Apply
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Come ready to learn.
              </h2>

              <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                Our programs are designed for learners at different stages.
                Requirements can vary by program, but a genuine interest in
                learning and willingness to practice are important starting
                points.
              </p>

              <Link
                href="/programs"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Explore Programs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-border bg-background p-7 sm:p-9">
              <h3 className="text-xl font-bold">General expectations</h3>

              <div className="mt-6 space-y-4">
                {requirements.map((requirement) => (
                  <div
                    key={requirement}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <span className="text-sm leading-6 text-muted-foreground">
                      {requirement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before Applying */}
      <section className="py-20 sm:py-24">
        <div className="container-academy">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Before You Apply
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Prepare for a better start.
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              Taking a few minutes to understand your goals and preferred
              program can make the application process easier.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {preparation.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-border bg-card p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="mt-6 text-lg font-bold">{item.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-border bg-muted/20 py-20 sm:py-24">
        <div className="container-academy">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Admissions FAQ
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Common questions.
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Here are some common questions learners may have before
              applying.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-border bg-background px-6 py-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <HelpCircle className="h-4 w-4 text-muted-foreground transition group-open:rotate-12" />
                  </span>
                </summary>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24">
        <div className="container-academy">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-7 py-14 text-center text-primary-foreground sm:px-12 sm:py-16">
            <div className="relative mx-auto max-w-3xl">
              <GraduationCap className="mx-auto h-10 w-10 opacity-80" />

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to take the first step?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 opacity-80 sm:text-base">
                Choose your program and submit your application to begin your
                Techlance Academy journey.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/apply"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
                >
                  Start Application
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/programs"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3 text-sm font-semibold transition hover:bg-primary-foreground/10"
                >
                  Browse Programs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}