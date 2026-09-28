import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Certificates" };

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">Certificates</h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Certificates issued to you, each with a certificate ID you can share for verification.
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
