"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Program = {
  id: string;
  slug: string;
  title: string;
};

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  program: string;
  qualification: string;
  city: string;
  experience: string;
  message: string;
};

const initialForm: FormState = {
  full_name: "",
  email: "",
  phone: "",
  program: "",
  qualification: "",
  city: "",
  experience: "",
  message: "",
};

export function ApplyForm() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(
    null,
  );

  const [form, setForm] = useState<FormState>(initialForm);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function loadPrograms() {
      setLoadingPrograms(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("programs")
        .select("id, slug, title")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Programs loading error:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        setErrorMessage(
          "Unable to load programs right now. Please try again.",
        );

        setLoadingPrograms(false);
        return;
      }

      setPrograms((data || []) as Program[]);
      setLoadingPrograms(false);
    }

    loadPrograms();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "program") {
      const program =
        programs.find((item) => item.slug === value) || null;

      setSelectedProgram(program);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitting(true);
    setSuccess(false);
    setErrorMessage("");

    if (!form.full_name.trim()) {
      setErrorMessage("Please enter your full name.");
      setSubmitting(false);
      return;
    }

    if (!form.email.trim()) {
      setErrorMessage("Please enter your email address.");
      setSubmitting(false);
      return;
    }

    if (!form.phone.trim()) {
      setErrorMessage("Please enter your phone number.");
      setSubmitting(false);
      return;
    }

    if (!selectedProgram) {
      setErrorMessage("Please select a program.");
      setSubmitting(false);
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.from("applications").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      program: selectedProgram.title,
      qualification: form.qualification.trim() || null,
      city: form.city.trim() || null,
      experience: form.experience.trim() || null,
      message: form.message.trim() || null,
    });

    if (error) {
      console.error("Application submission error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      setErrorMessage(
        error.message || "Something went wrong. Please try again.",
      );

      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setForm(initialForm);
    setSelectedProgram(null);
    setSubmitting(false);
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="container-academy">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex rounded-full border border-black/10 bg-black/[0.03] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-black/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60">
              Admission Application
            </span>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black sm:text-4xl dark:text-white">
              Start your application
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-black/60 sm:text-base dark:text-white/60">
              Complete the form below and our admissions team will review your
              application and contact you with the next steps.
            </p>
          </div>

          {success ? (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.06] p-8 text-center sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-9 w-9 text-emerald-500" />
              </div>

              <h3 className="mt-6 text-2xl font-semibold text-black dark:text-white">
                Application submitted successfully
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-black/60 dark:text-white/60">
                Thank you for applying to Techlance Academy. Our admissions
                team will review your application and contact you soon.
              </p>

              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-black"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] sm:p-8 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-sm font-medium text-black dark:text-white"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30 dark:border-white/10 dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/30"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-black dark:text-white"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30 dark:border-white/10 dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/30"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-black dark:text-white"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+92 3XX XXXXXXX"
                    required
                    className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30 dark:border-white/10 dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/30"
                  />
                </div>

                {/* Program */}
                <div>
                  <label
                    htmlFor="program"
                    className="mb-2 block text-sm font-medium text-black dark:text-white"
                  >
                    Select Program <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="program"
                    name="program"
                    value={form.program}
                    onChange={handleChange}
                    required
                    disabled={loadingPrograms}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 dark:border-white/10 dark:bg-[#111315] dark:text-white dark:focus:border-white/30"
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
                    className="mb-2 block text-sm font-medium text-black dark:text-white"
                  >
                    Qualification
                  </label>

                  <input
                    id="qualification"
                    name="qualification"
                    type="text"
                    value={form.qualification}
                    onChange={handleChange}
                    placeholder="e.g. Intermediate, Bachelor's"
                    className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30 dark:border-white/10 dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/30"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-black dark:text-white"
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
                    className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30 dark:border-white/10 dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/30"
                  />
                </div>

                {/* Experience */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="experience"
                    className="mb-2 block text-sm font-medium text-black dark:text-white"
                  >
                    Previous Experience
                  </label>

                  <input
                    id="experience"
                    name="experience"
                    type="text"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Tell us briefly about your previous experience"
                    className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30 dark:border-white/10 dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/30"
                  />
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-black dark:text-white"
                  >
                    Additional Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Anything else you would like us to know?"
                    rows={5}
                    className="w-full resize-none rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/30"
                  />
                </div>
              </div>

              {/* Error */}
              {errorMessage && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || loadingPrograms}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-black/45 dark:text-white/40">
                By submitting this form, you confirm that the information
                provided is accurate.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}