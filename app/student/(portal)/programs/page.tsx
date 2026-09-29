import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CheckCircle2 } from "lucide-react";

export const metadata = { title: "My Programs" };

export default async function Page() {
  const { profile } = await requireRole("student");
  const supabase = await createClient();

  const programName = profile.program?.trim() || "";

  const { data: programs, error } = await supabase
    .from("programs")
    .select("id, slug, title, status")
    .eq("status", "active");

  if (error) {
    console.error("Program fetch error:", error);
  }

  const normalizedStudentProgram = programName.toLowerCase();

  const program =
    programs?.find(
      (item) =>
        item.title?.trim().toLowerCase() === normalizedStudentProgram ||
        item.slug?.trim().toLowerCase() === normalizedStudentProgram
    ) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          My Programs
        </h2>

        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Your currently assigned Techlance Academy program.
        </p>
      </div>

      {!program ? (
        <Card>
          <CardContent className="py-14 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-muted-foreground" />

            <p className="mt-4 text-sm font-medium text-foreground">
              No program assigned
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              We could not match your assigned program with an active Academy
              program.
            </p>

            {programName && (
              <p className="mt-3 text-xs text-muted-foreground">
                Assigned program:{" "}
                <span className="font-medium text-foreground">
                  {programName}
                </span>
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <div>
                  <CardTitle>{program.title}</CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {program.slug}
                  </p>
                </div>
              </div>

              <Badge>Active</Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />

                <p className="text-sm font-medium text-foreground">
                  Program active
                </p>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Your classes, learning materials, assignments, attendance,
                progress, and certificates will be connected to this program
                as the LMS modules are activated.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}