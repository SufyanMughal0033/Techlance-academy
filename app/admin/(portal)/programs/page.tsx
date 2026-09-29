import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProgram } from "./actions";

export const metadata = { title: "Programs" };

export default async function ProgramsPage() {
  const supabase = await createClient();

  const { data: programs, error } = await supabase
    .from("programs")
    .select("id, slug, title, status, created_at, updated_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Programs
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Create and manage Techlance Academy programs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Program</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={createProgram} className="grid gap-4 md:grid-cols-3">
            <Input
              name="title"
              placeholder="Program title"
              required
            />

            <Input
              name="slug"
              placeholder="program-slug"
              required
            />

            <select
              name="status"
              defaultValue="draft"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <div className="md:col-span-3">
              <Button type="submit">Create Program</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Programs</CardTitle>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="py-10 text-center text-sm text-destructive">
              Failed to load programs: {error.message}
            </div>
          ) : !programs?.length ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No programs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {programs.map((program) => (
                    <tr
                      key={program.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-4 py-4 font-medium">
                        {program.title}
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {program.slug}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                          {program.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {new Date(program.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}