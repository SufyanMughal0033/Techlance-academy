import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Support" };

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">Support</h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          A way to reach academy support about your account, classes, or enrollment.
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
