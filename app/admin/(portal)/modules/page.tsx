import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Modules" };

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">Modules</h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Curriculum modules shown on public program pages, and the lessons enrolled students work through.
        </p>
      </div>
      <Card>
        <CardContent className="py-14 text-center text-sm text-muted-foreground">
          This section&apos;s data views and actions are built in a later phase,
          once real Supabase data and CRUD flows are wired up on top of this
          foundation.
        </CardContent>
      </Card>
    </div>
  );
}
