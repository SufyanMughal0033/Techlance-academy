import { requireRole } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Profile" };

export default async function Page() {
  const { profile } = await requireRole("student");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Profile
        </h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Your profile details. Sensitive fields such as email and account
          status require admin verification to change.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Personal Information</CardTitle>

            <Badge variant={profile.is_active ? "default" : "destructive"}>
              {profile.is_active ? "Active Student" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileItem
              label="Full Name"
              value={profile.fullname}
            />

            <ProfileItem
              label="Email"
              value={profile.email}
            />

            <ProfileItem
              label="Phone"
              value={profile.phone}
            />

            <ProfileItem
              label="Program"
              value={profile.program}
            />

            <ProfileItem
              label="Qualification"
              value={profile.qualification}
            />

            <ProfileItem
              label="City"
              value={profile.city}
            />

            <ProfileItem
              label="Experience"
              value={profile.experience}
            />

            <ProfileItem
              label="Account Role"
              value={profile.role}
            />
          </div>

          {profile.message && (
            <div className="mt-6 border-t border-border pt-5">
              <p className="mb-2 text-sm font-medium text-foreground">
                Additional Information
              </p>

              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {profile.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-foreground">
        {value?.trim() || "Not provided"}
      </p>
    </div>
  );
}