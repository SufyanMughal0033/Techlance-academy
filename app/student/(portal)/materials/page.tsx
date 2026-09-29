import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  Video,
  Link as LinkIcon,
  ExternalLink,
  Download,
} from "lucide-react";

export const metadata = { title: "Materials" };

export default async function Page() {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  // Get student's active enrollments
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("program_id")
    .eq("student_id", user.id)
    .eq("status", "active");

  if (enrollmentError) {
    console.error("Enrollment fetch error:", enrollmentError);
  }

  const programIds = enrollments?.map((item) => item.program_id) ?? [];

  // Get modules belonging to enrolled programs
  const { data: modules, error: modulesError } =
    programIds.length > 0
      ? await supabase
          .from("modules")
          .select("id, program_id, title, module_order")
          .in("program_id", programIds)
          .eq("status", "active")
          .order("module_order", { ascending: true })
      : { data: [], error: null };

  if (modulesError) {
    console.error("Modules fetch error:", modulesError);
  }

  const moduleIds = modules?.map((module) => module.id) ?? [];

  // Get published materials
  const { data: materials, error: materialsError } =
    moduleIds.length > 0
      ? await supabase
          .from("materials")
          .select(
            "id, module_id, title, description, material_type, file_url, external_url, material_order, status"
          )
          .in("module_id", moduleIds)
          .eq("status", "published")
          .order("material_order", { ascending: true })
      : { data: [], error: null };

  if (materialsError) {
    console.error("Materials fetch error:", materialsError);
  }

  const materialMap = new Map<string, typeof materials>();

  for (const material of materials ?? []) {
    const existing = materialMap.get(material.module_id) ?? [];
    existing.push(material);
    materialMap.set(material.module_id, existing);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Materials
        </h2>

        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          PDFs, documents, links, and videos for each lesson in your enrolled
          courses.
        </p>
      </div>

      {/* No modules */}
      {!modules || modules.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />

            <p className="mt-4 text-sm font-medium text-foreground">
              No learning materials available
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Materials will appear here when they are published for your
              program.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {modules.map((module) => {
            const moduleMaterials = materialMap.get(module.id) ?? [];

            return (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Module {module.module_order}
                      </p>

                      <CardTitle className="mt-1 text-base">
                        {module.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {moduleMaterials.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center">
                      <FileText className="mx-auto h-7 w-7 text-muted-foreground" />

                      <p className="mt-3 text-sm font-medium text-foreground">
                        No materials yet
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Learning resources for this module will appear here
                        when published.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {moduleMaterials.map((material) => (
                        <MaterialItem
                          key={material.id}
                          title={material.title}
                          description={material.description}
                          materialType={material.material_type}
                          fileUrl={material.file_url}
                          externalUrl={material.external_url}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MaterialItem({
  title,
  description,
  materialType,
  fileUrl,
  externalUrl,
}: {
  title: string;
  description: string | null;
  materialType: string;
  fileUrl: string | null;
  externalUrl: string | null;
}) {
  const icon = getMaterialIcon(materialType);

  const url = fileUrl || externalUrl;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">{title}</p>

          <Badge variant="secondary">
            {formatMaterialType(materialType)}
          </Badge>
        </div>

        {description && (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {fileUrl ? (
            <>
              <Download className="h-4 w-4" />
              Open File
            </>
          ) : (
            <>
              <ExternalLink className="h-4 w-4" />
              Open Resource
            </>
          )}
        </a>
      )}
    </div>
  );
}

function getMaterialIcon(type: string) {
  switch (type) {
    case "pdf":
    case "document":
      return <FileText className="h-5 w-5" />;

    case "video":
      return <Video className="h-5 w-5" />;

    case "link":
      return <LinkIcon className="h-5 w-5" />;

    default:
      return <BookOpen className="h-5 w-5" />;
  }
}

function formatMaterialType(type: string) {
  switch (type) {
    case "pdf":
      return "PDF";

    case "video":
      return "Video";

    case "link":
      return "Link";

    case "document":
      return "Document";

    case "resource":
      return "Resource";

    default:
      return type;
  }
}