import {
  Award,
  CalendarDays,
  CheckCircle2,
  Download,
  GraduationCap,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Certificates",
  description: "View your Techlance Academy certificates.",
};

type Certificate = {
  id: string;
  certificate_number: string;
  issue_date: string;
  title: string;
  description: string | null;
  certificate_url: string | null;
  status: "issued" | "revoked";
  programs:
    | {
        title: string;
        slug: string;
      }
    | {
        title: string;
        slug: string;
      }[]
    | null;
};

export default async function CertificatesPage() {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("certificates")
    .select(`
      id,
      certificate_number,
      issue_date,
      title,
      description,
      certificate_url,
      status,
      programs (
        title,
        slug
      )
    `)
    .eq("student_id", user.id)
    .eq("status", "issued")
    .order("issue_date", { ascending: false });

  const certificates = (data ?? []) as unknown as Certificate[];

  function getProgramTitle(certificate: Certificate) {
    if (!certificate.programs) return "Techlance Academy Program";

    const program = Array.isArray(certificate.programs)
      ? certificate.programs[0]
      : certificate.programs;

    return program?.title ?? "Techlance Academy Program";
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Student Portal
        </p>

        <div className="mt-1 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Award className="h-5 w-5 text-primary" />
          </div>

          <h2 className="font-display text-2xl font-semibold text-foreground">
            My Certificates
          </h2>
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          View certificates issued for your successfully completed
          Techlance Academy programs.
        </p>
      </div>

      {/* Certificate count */}
      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-muted-foreground">
              Certificates Earned
            </p>

            <p className="mt-1 text-2xl font-semibold text-foreground">
              {certificates.length}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      {error ? (
        <Card>
          <CardContent className="py-14 text-center">
            <p className="text-sm font-medium text-destructive">
              Unable to load certificates
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Please refresh the page and try again.
            </p>
          </CardContent>
        </Card>
      ) : certificates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-14 text-center">
            <Award className="h-10 w-10 text-muted-foreground" />

            <p className="mt-4 text-sm font-medium text-foreground">
              No certificates yet
            </p>

            <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
              Certificates will appear here once you successfully
              complete an eligible program.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {certificates.map((certificate) => (
            <Card
              key={certificate.id}
              className="overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Certificate preview */}
                <div className="relative border-b bg-muted/20 p-6 sm:p-8">
                  <div className="absolute right-5 top-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border bg-background">
                      <Award className="h-7 w-7 text-primary" />
                    </div>

                    <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Techlance Academy
                    </p>

                    <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
                      {certificate.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      This certificate is awarded for the successful
                      completion of
                    </p>

                    <p className="mt-3 text-lg font-semibold text-foreground">
                      {getProgramTitle(certificate)}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6">
                  {certificate.description && (
                    <p className="text-sm leading-6 text-muted-foreground">
                      {certificate.description}
                    </p>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Issue Date
                      </div>

                      <p className="mt-1 text-sm font-medium text-foreground">
                        {formatDate(certificate.issue_date)}
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <p className="text-xs text-muted-foreground">
                        Certificate Number
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-foreground">
                        {certificate.certificate_number}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {certificate.certificate_url ? (
                      <a
                        href={certificate.certificate_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        <Download className="h-4 w-4" />
                        View Certificate
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-muted-foreground">
                        <Award className="h-4 w-4" />
                        Certificate Available
                      </span>
                    )}

                    <span className="inline-flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}