"use client";

import { FormEvent, useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Clock3,
  MapPin,
  Send,
  CheckCircle2,
  User,
  BookOpen,
} from "lucide-react";

export default function ContactContent() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    // Supabase integration will be added here.
    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="container-academy py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* Contact Information */}
        <section>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Get in touch
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              We're here to help
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              Whether you want to know more about a program, need help with
              your application, or have a general question, feel free to reach
              out to Techlance Academy.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="mt-8 space-y-4">
            <a
              href="mailto:info@techlance.website"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail size={20} />
              </span>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Email
                </p>
                <p className="mt-1 text-sm text-muted-foreground transition-colors group-hover:text-primary">
                  info@techlance.website
                </p>
              </div>
            </a>

            <a
              href="tel:+923287060442"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone size={20} />
              </span>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Phone
                </p>
                <p className="mt-1 text-sm text-muted-foreground transition-colors group-hover:text-primary">
                  +92 328 7060442
                </p>
              </div>
            </a>

            <a
              href="https://wa.me/923287060442"
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageCircle size={20} />
              </span>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  WhatsApp
                </p>
                <p className="mt-1 text-sm text-muted-foreground transition-colors group-hover:text-primary">
                  Chat with our team
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock3 size={20} />
              </span>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Business Hours
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Monday – Saturday
                  <br />
                  10:00 AM – 7:00 PM
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin size={20} />
              </span>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Location
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Faisalabad, Punjab
                  <br />
                  Pakistan
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
            {submitted ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 size={34} />
                </div>

                <h2 className="mt-6 text-2xl font-semibold text-foreground">
                  Message sent successfully
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                  Thank you for contacting Techlance Academy. Our team will
                  review your message and get back to you soon.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-7 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Send us a message
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    How can we help?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Fill out the form below and our team will get back to you.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Enter your full name"
                        className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Phone / WhatsApp
                    </label>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+92 3XX XXXXXXX"
                        className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {/* Program */}
                  <div>
                    <label
                      htmlFor="program"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Program
                    </label>

                    <div className="relative">
                      <BookOpen
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <select
                        id="program"
                        name="program"
                        defaultValue=""
                        className="h-12 w-full appearance-none rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                      >
                        <option value="" disabled>
                          Select a program
                        </option>
                        <option value="web-development">
                          Web Development
                        </option>
                        <option value="digital-marketing">
                          Digital Marketing
                        </option>
                        <option value="graphic-design">
                          Graphic Design
                        </option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}