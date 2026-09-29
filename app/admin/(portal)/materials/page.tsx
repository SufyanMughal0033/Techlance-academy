import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "./actions";

export const metadata = {
  title: "Materials",
};

const materialTypes = [
  { value: "pdf", label: "PDF" },
  { value: "video", label: "Video" },
  { value: "document", label: "Document" },
  { value: "link", label: "Link" },
  { value: "slides", label: "Slides" },
  { value: "other", label: "Other" },
];

export default async function MaterialsPage() {
  const supabase = await createClient();

  const [materialsResult, modulesResult] = await Promise.all([
    supabase
      .from("materials")
      .select("*")
      .order("module_id")
      .order("material_order", { ascending: true }),

    supabase
      .from("modules")
      .select("id, title, module_order, program_id")
      .order("module_order", { ascending: true }),
  ]);

  const materials = materialsResult.data ?? [];
  const modules = modulesResult.data ?? [];

  const moduleMap = new Map(
    modules.map((module) => [module.id, module.title])
  );

  const publishedCount = materials.filter(
    (material) => material.status === "published"
  ).length;

  const draftCount = materials.filter(
    (material) => material.status === "draft"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Materials
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage learning materials for your course modules.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Materials
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {materials.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Published
            </p>

            <p className="mt-2 text-2xl font-semibold text-emerald-600">
              {publishedCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Drafts
            </p>

            <p className="mt-2 text-2xl font-semibold text-amber-600">
              {draftCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Material */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              Add Material
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add a PDF, video, document, link or other learning resource.
            </p>
          </div>

          <form action={createMaterial} className="grid gap-5">
            {/* Module + Title */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="module_id"
                  className="text-sm font-medium"
                >
                  Module
                </label>

                <select
                  id="module_id"
                  name="module_id"
                  required
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select module</option>

                  {modules.map((module) => (
                    <option
                      key={module.id}
                      value={module.id}
                    >
                      {module.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium"
                >
                  Material Title
                </label>

                <input
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. React Components Notes"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Type + Order + Status */}
            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="material_type"
                  className="text-sm font-medium"
                >
                  Material Type
                </label>

                <select
                  id="material_type"
                  name="material_type"
                  defaultValue="pdf"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  {materialTypes.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="material_order"
                  className="text-sm font-medium"
                >
                  Order
                </label>

                <input
                  id="material_order"
                  name="material_order"
                  type="number"
                  min="1"
                  defaultValue="1"
                  required
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="text-sm font-medium"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue="published"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="published">
                    Published
                  </option>

                  <option value="draft">
                    Draft
                  </option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe this learning material..."
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </div>

            {/* URLs */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="file_url"
                  className="text-sm font-medium"
                >
                  File URL
                </label>

                <input
                  id="file_url"
                  name="file_url"
                  type="url"
                  placeholder="https://..."
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />

                <p className="text-xs text-muted-foreground">
                  Use this for PDFs or uploaded files.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="external_url"
                  className="text-sm font-medium"
                >
                  External URL
                </label>

                <input
                  id="external_url"
                  name="external_url"
                  type="url"
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />

                <p className="text-xs text-muted-foreground">
                  Use this for YouTube, websites or external resources.
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Add Material
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Materials List */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              All Materials
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage existing learning materials.
            </p>
          </div>

          {materials.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No materials found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="rounded-xl border p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {material.title}
                        </h3>

                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium uppercase">
                          {material.material_type}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            material.status === "published"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {material.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Module:{" "}
                        <span className="font-medium text-foreground">
                          {moduleMap.get(material.module_id) ||
                            "Unknown module"}
                        </span>
                      </p>

                      {material.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {material.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>
                          Order: {material.material_order}
                        </span>

                        {material.file_url && (
                          <Link
                            href={material.file_url}
                            target="_blank"
                            className="font-medium text-primary hover:underline"
                          >
                            Open File
                          </Link>
                        )}

                        {material.external_url && (
                          <Link
                            href={material.external_url}
                            target="_blank"
                            className="font-medium text-primary hover:underline"
                          >
                            Open External Link
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2">
                      <details className="relative">
                        <summary className="cursor-pointer list-none rounded-lg border px-4 py-2 text-sm font-medium">
                          Edit
                        </summary>

                        <div className="absolute right-0 z-20 mt-2 w-[min(92vw,600px)] rounded-xl border bg-background p-5 shadow-xl">
                          <div className="mb-5">
                            <h4 className="font-semibold">
                              Edit Material
                            </h4>
                          </div>

                          <form
                            action={updateMaterial}
                            className="grid gap-4"
                          >
                            <input
                              type="hidden"
                              name="id"
                              value={material.id}
                            />

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Module
                                </label>

                                <select
                                  name="module_id"
                                  required
                                  defaultValue={material.module_id}
                                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                >
                                  <option value="">
                                    Select module
                                  </option>

                                  {modules.map((module) => (
                                    <option
                                      key={module.id}
                                      value={module.id}
                                    >
                                      {module.title}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Material Title
                                </label>

                                <input
                                  name="title"
                                  required
                                  defaultValue={material.title}
                                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                />
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Type
                                </label>

                                <select
                                  name="material_type"
                                  defaultValue={
                                    material.material_type
                                  }
                                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                >
                                  {materialTypes.map((type) => (
                                    <option
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Order
                                </label>

                                <input
                                  name="material_order"
                                  type="number"
                                  min="1"
                                  required
                                  defaultValue={
                                    material.material_order
                                  }
                                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Status
                                </label>

                                <select
                                  name="status"
                                  defaultValue={material.status}
                                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                >
                                  <option value="published">
                                    Published
                                  </option>

                                  <option value="draft">
                                    Draft
                                  </option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Description
                              </label>

                              <textarea
                                name="description"
                                rows={3}
                                defaultValue={
                                  material.description || ""
                                }
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                              />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  File URL
                                </label>

                                <input
                                  name="file_url"
                                  type="url"
                                  defaultValue={
                                    material.file_url || ""
                                  }
                                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  External URL
                                </label>

                                <input
                                  name="external_url"
                                  type="url"
                                  defaultValue={
                                    material.external_url || ""
                                  }
                                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                            >
                              Save Changes
                            </button>
                          </form>
                        </div>
                      </details>

                      <form action={deleteMaterial}>
                        <input
                          type="hidden"
                          name="id"
                          value={material.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}