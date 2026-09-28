"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  GraduationCap,
  BookOpen,
  CreditCard,
  CalendarDays,
  Award,
  MessageCircleQuestion,
} from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
  category: string;
};

const faqs: FAQ[] = [
  {
    question: "How do I apply for admission?",
    answer:
      "You can apply online through the Techlance Academy application form. Fill in your personal information, select your preferred program, provide your educational details, and submit the application for review.",
    category: "Admissions",
  },
  {
    question: "What happens after I submit my application?",
    answer:
      "After submitting your application, the admissions team will review the information you provided. If additional information is required, the team may contact you using your provided contact details.",
    category: "Admissions",
  },
  {
    question: "Can I apply for more than one program?",
    answer:
      "This depends on the available programs and admission rules for the current intake. If you are interested in multiple programs, you can mention this during the application process or contact the admissions team.",
    category: "Admissions",
  },
  {
    question: "What programs does Techlance Academy offer?",
    answer:
      "Techlance Academy focuses on practical, career-oriented digital skills. Programs may include web development, digital marketing, graphic design, and other technology-focused training.",
    category: "Programs",
  },
  {
    question: "Are the classes suitable for beginners?",
    answer:
      "Yes. Many programs are designed to help beginners build their skills step by step. Specific prerequisites may vary depending on the selected program.",
    category: "Programs",
  },
  {
    question: "Do I need previous programming experience?",
    answer:
      "Not necessarily. Some programs are beginner-friendly, while advanced programs may require basic knowledge. The requirements depend on the specific course.",
    category: "Programs",
  },
  {
    question: "How much are the course fees?",
    answer:
      "Course fees can vary depending on the selected program, duration, and learning format. Please check the relevant program information or contact the admissions team for current fee details.",
    category: "Fees & Payments",
  },
  {
    question: "What payment methods are available?",
    answer:
      "Available payment methods depend on the academy's current payment options. The admissions team will provide the necessary payment instructions during the admission process.",
    category: "Fees & Payments",
  },
  {
    question: "Can I pay the fee in installments?",
    answer:
      "Installment availability depends on the selected program and current academy policy. Contact the admissions team to confirm whether an installment option is available for your program.",
    category: "Fees & Payments",
  },
  {
    question: "When do classes start?",
    answer:
      "Class start dates depend on the program and upcoming batch schedule. Once your admission is confirmed, you will receive the relevant class schedule and joining information.",
    category: "Classes",
  },
  {
    question: "Are classes online or physical?",
    answer:
      "The learning format depends on the specific program and batch. Please check the program details or contact the academy for the current class format.",
    category: "Classes",
  },
  {
    question: "Will I receive a certificate?",
    answer:
      "Certificate eligibility depends on the selected program and its completion requirements. Students who successfully meet the applicable requirements may receive a certificate.",
    category: "Certificates",
  },
  {
    question: "Can I mention the certificate on my CV?",
    answer:
      "Yes. A course certificate can be included in the certifications or training section of your CV. We also recommend building practical projects and a portfolio alongside your training.",
    category: "Certificates",
  },
];

const categories = [
  {
    name: "All Questions",
    icon: MessageCircleQuestion,
  },
  {
    name: "Admissions",
    icon: GraduationCap,
  },
  {
    name: "Programs",
    icon: BookOpen,
  },
  {
    name: "Fees & Payments",
    icon: CreditCard,
  },
  {
    name: "Classes",
    icon: CalendarDays,
  },
  {
    name: "Certificates",
    icon: Award,
  },
];

export default function FAQContent() {
  const [activeCategory, setActiveCategory] = useState("All Questions");
  const [search, setSearch] = useState("");

  const filteredFAQs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const categoryMatch =
        activeCategory === "All Questions" ||
        faq.category === activeCategory;

      const searchMatch =
        query.length === 0 ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All Questions");
  };

  return (
    <main className="container-academy py-14 md:py-20">
      {/* Search */}
      <section className="mx-auto max-w-3xl">
        <div className="relative">
          <Search
            size={20}
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your question..."
            aria-label="Search frequently asked questions"
            className="h-14 w-full rounded-2xl border border-border bg-background pl-14 pr-5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="mt-10">
        <div className="flex gap-3 overflow-x-auto pb-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.name;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => setActiveCategory(category.name)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-10 max-w-4xl">
        <div className="mb-6">
          <p className="text-sm font-medium text-primary">
            {filteredFAQs.length}{" "}
            {filteredFAQs.length === 1 ? "question" : "questions"}
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Find the answers you need
          </h2>
        </div>

        {filteredFAQs.length > 0 ? (
          <div className="space-y-3">
            {filteredFAQs.map((faq) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-sm font-medium text-foreground md:px-6 md:text-base">
                  <span>{faq.question}</span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted transition-transform duration-200 group-open:rotate-180">
                    <ChevronDown size={17} />
                  </span>
                </summary>

                <div className="border-t border-border px-5 pb-5 pt-4 md:px-6">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {faq.answer}
                  </p>

                  <div className="mt-4">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {faq.category}
                    </span>
                  </div>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Search size={22} className="text-muted-foreground" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-foreground">
              No questions found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              We could not find an FAQ matching your search. Try another
              keyword or select a different category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 text-sm font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mt-16 overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground md:px-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-medium opacity-90">
              <MessageCircleQuestion size={18} />
              Still have questions?
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Ready to start your learning journey?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 opacity-85">
              Submit your application and take the next step toward developing
              practical digital skills.
            </p>
          </div>

          <a
            href="/apply"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            Apply Now
          </a>
        </div>
      </section>
    </main>
  );
}