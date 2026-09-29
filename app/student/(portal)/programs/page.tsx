import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  CheckCircle2,
  BookOpen,
  ChevronRight,
} from "lucide-react";

export const metadata = { title: "My Programs" };

export default async function Page() {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  // Get student's actual enrollments
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("id, program_id, status, enrolled_at")
    .eq("student_id", user.id)
    .eq("status", "active");

  if (enrollmentError) {
    console.error("Enrollment fetch error:", enrollmentError);
  }

  const programIds = enrollments?.map((item) => item.program_id) ?? [];

  // Get enrolled programs
  const { data: programs, error: programError } =
    programIds.length > 0
      ? await supabase
          .from("programs")
          .select("id, slug, title, status")
          .in("id", programIds)
          .eq("status", "active")
      : { data: [], error: null };

  if (programError) {
    console.error("Program fetch error:", programError);
  }

  // Get modules for enrolled programs
  const { data: modules, error: modulesError } =
    programIds.length > 0
      ? await supabase
          .from("modules")
          .select(
            "id, program_id, title, description, module_order, status"
          )
          .in("program_id", programIds)
          .eq("status", "active")
          .order("module_order", { ascending: true })
      : { data: [], error: null };

  if (modulesError) {
    console.error("Modules fetch error:", modulesError);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          My Programs
        </h2>

        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Your enrolled Techlance Academy programs and their learning modules.
        </p>
      </div>

      {/* No enrollment */}
      {!programs || programs.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-muted-foreground" />

            <p className="mt-4 text-sm font-medium text-foreground">
              No active program found
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              You currently don't have an active Academy program enrollment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {programs.map((program) => {
            const enrollment = enrollments?.find(
              (item) => item.program_id === program.id
            );

            const programModules =
              modules?.filter(
                (module) => module.program_id === program.id
              ) ?? [];

            return (
              <Card key={program.id}>
                {/* Program Header */}
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

                        {enrollment?.enrolled_at && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Enrolled on{" "}
                            {new Date(
                              enrollment.enrolled_at
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    <Badge>Active</Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-5">
                  {/* Active status */}
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />

                      <p className="text-sm font-medium text-foreground">
                        Program active
                      </p>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Your learning content, classes, assignments, tests,
                      attendance, and progress will be organized under this
                      program.
                    </p>
                  </div>

                  {/* Modules */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          Course Modules
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {programModules.length}{" "}
                          {programModules.length === 1
                            ? "module"
                            : "modules"}{" "}
                          available
                        </p>
                      </div>

                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {programModules.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border p-6 text-center">
                        <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />

                        <p className="mt-3 text-sm font-medium text-foreground">
                          No modules available yet
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Course modules will appear here when they are
                          published.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {programModules.map((module) => (
                          <div
                            key={module.id}
                            className="group flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/40"
                          >
                            {/* Module number */}
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                              {module.module_order}
                            </div>

                            {/* Module content */}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {module.title}
                              </p>

                              {module.description && (
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                  {module.description}
                                </p>
                              )}
                            </div>

                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}