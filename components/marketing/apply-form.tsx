"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Program = {
  id: string;
  slug: string;
  title: string;
};

const supabase = createClient();

export function ApplyForm() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    program: "",
    qualification: "",
    city: "",
    experience: "",
    message: "",
  });

  useEffect(() => {
    async function loadPrograms() {
      try {
        const { data, error } = await supabase
          .from("programs")
          .select("id, slug, title");

        if (error) {
          console.error("Programs loading error:", error);
          setPrograms([]);
          return;
        }

       setPrograms((data || []) as unknown as Program[]);
      } catch (error) {
        console.error("Programs loading error:", error);
        setPrograms([]);
      } finally {
        setLoadingPrograms(false);
      }
    }

    loadPrograms();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const programSlug = params.get("program");

    if (!programSlug || programs.length === 0) {
      return;
    }

    const selectedProgram = programs.find(
      (program) => program.slug === programSlug
    );

    if (selectedProgram) {
      setForm((current) => ({
        ...current,
        program: selectedProgram.slug,
      }));
    }
  }, [programs]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setErrorMessage("");
    setSuccess(false);

    const selectedProgram = programs.find(
      (program) => program.slug === form.program
    );

    if (!selectedProgram) {
      setErrorMessage("Please select a valid program.");
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("applications").insert({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        program: selectedProgram.title,
        qualification: form.qualification.trim() || null,
        city: form.city.trim() || null,
        experience: form.experience.trim() || null,
        message: form.message.trim() || null,
        agreed_to_terms: true,
      });

      if (error) {
        console.error("Application submission error:", error);

        setErrorMessage(
          "We couldn't submit your application right now. Please try again."
        );

        return;
      }

      setSuccess(true);

      setForm({
        full_name: "",
        email: "",
        phone: "",
        program: "",
        qualification: "",
        city: "",
        experience: "",
        message: "",
      });
    } catch (error) {
      console.error("Application submission error:", error);

      setErrorMessage(
        "We couldn't submit your application right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="py-16 sm:py-20">
        <div className="container-academy">
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-card px-7 py-14 text-center shadow-sm sm:px-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Application Submitted
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
              Thank you for applying to Techlance Academy. Our admissions team
              will review your application and contact you with the next steps.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Explore Programs
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold transition hover:bg-muted"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="container-academy">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Application Form
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Tell us about yourself.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Please provide accurate information so our admissions team can
              understand your goals and guide you through the next step.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="full_name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full Name <span className="text-primary">*</span>
                </label>

                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email Address <span className="text-primary">*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold"
                >
                  Phone Number <span className="text-primary">*</span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+92 3XX XXXXXXX"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Program */}
              <div>
                <label
                  htmlFor="program"
                  className="mb-2 block text-sm font-semibold"
                >
                  Select Program <span className="text-primary">*</span>
                </label>

                <select
                  id="program"
                  name="program"
                  required
                  value={form.program}
                  onChange={handleChange}
                  disabled={loadingPrograms}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {loadingPrograms
                      ? "Loading programs..."
                      : "Select a program"}
                  </option>

                  {programs.map((program) => (
                    <option key={program.id} value={program.slug}>
                      {program.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Qualification */}
              <div>
                <label
                  htmlFor="qualification"
                  className="mb-2 block text-sm font-semibold"
                >
                  Highest Qualification
                </label>

                <input
                  id="qualification"
                  name="qualification"
                  type="text"
                  value={form.qualification}
                  onChange={handleChange}
                  placeholder="e.g. Intermediate, Bachelor"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Faisalabad"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Experience */}
              <div className="md:col-span-2">
                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-semibold"
                >
                  Previous Experience
                </label>

                <input
                  id="experience"
                  name="experience"
                  type="text"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. Beginner / 1 year freelance experience"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold"
                >
                  Why do you want to join?
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your goals, interests, or what you want to learn..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-border pt-6 sm:flex-row sm:items-center">
              <p className="max-w-md text-xs leading-5 text-muted-foreground">
                By submitting this form, you confirm that the information
                provided is accurate.
              </p>

              <button
                type="submit"
                disabled={submitting || loadingPrograms}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}