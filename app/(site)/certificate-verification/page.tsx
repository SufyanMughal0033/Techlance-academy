import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Info,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata = {
  title: "Certificate Verification",
  description:
    "Verify the authenticity of a Techlance Academy certificate using its certificate ID.",
};

export default function CertificateVerificationPage() {
  return (
    <>
      <PageHero
        eyebrow="Verification"
        title="Certificate Verification"
        description="Verify the authenticity of a Techlance Academy certificate using its certificate ID."
      />

      <main className="container-academy pb-20">
        {/* Verification Area */}
        <section className="py-12">
          <div className="mx-auto max-w-3xl">
            {/* Main Card */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              {/* Card Header */}
              <div className="border-b border-border bg-primary/[0.04] px-6 py-8 sm:px-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-8 w-8" />
                </div>

                <div className="mt-5 text-center">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Verify a certificate
                  </h2>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                    Enter the unique certificate ID printed on a Techlance
                    Academy certificate to verify its authenticity.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 sm:p-10">
                <form className="space-y-5">
                  <div>
                    <label
                      htmlFor="certificate-id"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Certificate ID
                    </label>

                    <div className="relative">
                      <FileCheck2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                      <input
                        id="certificate-id"
                        name="certificate-id"
                        type="text"
                        placeholder="e.g. TLA-2026-000123"
                        className="h-13 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Your certificate ID can be found on the certificate
                      issued by Techlance Academy.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
                  >
                    <Search className="h-4 w-4" />
                    Verify Certificate
                  </button>
                </form>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="mt-5 flex gap-3 rounded-2xl border border-border bg-muted/30 p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <p className="text-xs leading-6 text-muted-foreground">
                Certificate verification only displays information necessary
                to confirm certificate authenticity. No private student
                information is exposed through the verification service.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t border-border pt-14">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-sm font-semibold text-primary">
                Simple verification
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                How certificate verification works
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Anyone can verify a Techlance Academy certificate in just a
                few seconds.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {/* Step 1 */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  01
                </div>

                <h3 className="mt-5 font-semibold">
                  Find the certificate ID
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Locate the unique certificate ID printed on the student&apos;s
                  Techlance Academy certificate.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  02
                </div>

                <h3 className="mt-5 font-semibold">
                  Enter the ID
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Enter the certificate ID into the verification form above
                  and submit your request.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  03
                </div>

                <h3 className="mt-5 font-semibold">
                  View verification status
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The system will show whether the certificate is valid,
                  revoked, or not found.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Example Verification Result */}
        <section className="mt-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 text-center">
              <p className="text-sm font-semibold text-primary">
                Verification result
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                What a verified certificate looks like
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-card">
              {/* Result Header */}
              <div className="flex flex-col gap-5 border-b border-border bg-emerald-500/[0.05] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <BadgeCheck className="h-7 w-7" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Verification status
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Certificate Verified
                    </h3>
                  </div>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Valid Certificate
                </span>
              </div>

              {/* Result Details */}
              <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                <div className="flex gap-3">
                  <UserRound className="mt-0.5 h-5 w-5 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Student Name
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      Muhammad Ahmed
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <GraduationCap className="mt-0.5 h-5 w-5 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Program
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      Full Stack Web Development
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Issue Date
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      September 24, 2026
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <FileCheck2 className="mt-0.5 h-5 w-5 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Certificate ID
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      TLA-2026-000123
                    </p>
                  </div>
                </div>
              </div>

              {/* Result Footer */}
              <div className="border-t border-border px-6 py-5 sm:px-8">
                <p className="text-xs leading-6 text-muted-foreground">
                  This example demonstrates the information that may be shown
                  when a certificate is successfully verified. Actual results
                  will be retrieved from the Techlance Academy certificate
                  database.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Invalid Example */}
        <section className="mx-auto mt-8 max-w-4xl">
          <div className="flex gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

            <div>
              <h3 className="text-sm font-semibold">
                Certificate not found or revoked?
              </h3>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                If a certificate ID cannot be verified, check that the ID was
                entered correctly. If the issue continues, contact Techlance
                Academy for assistance.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-primary/20 bg-primary px-6 py-12 text-center text-primary-foreground sm:px-10 sm:py-14">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-background/15">
            <Sparkles className="h-5 w-5" />
          </div>

          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Want to earn a Techlance Academy certificate?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 opacity-85 sm:text-base">
            Explore our career-focused programs and start building practical
            digital skills.
          </p>

          <Link
            href="/programs"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
          >
            Explore programs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </>
  );
}
