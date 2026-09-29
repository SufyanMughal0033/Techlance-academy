import { requireRole } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function Page() {
  const { user, profile } = await requireRole("student");

  const studentName =
    profile.fullname?.trim() || user.email?.split("@")[0] || "Student";

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <p className="text-sm font-medium text-primary">Student Portal</p>

        <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
          Welcome back, {studentName} 👋
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Here&apos;s your learning overview. Your academic information and
          account status are connected to your Techlance Academy profile.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          icon={<GraduationCap className="h-5 w-5" />}
          label="Program"
          value={profile.program || "Not assigned"}
        />

        <InfoCard
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Account"
          value={profile.is_active ? "Active" : "Inactive"}
        />

        <InfoCard
          icon={<MapPin className="h-5 w-5" />}
          label="City"
          value={profile.city || "Not provided"}
        />

        <InfoCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Experience"
          value={profile.experience || "Not provided"}
        />
      </div>

      {/* Student Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Student Information</CardTitle>

          <Badge variant={profile.is_active ? "default" : "destructive"}>
            {profile.is_active ? "Active" : "Inactive"}
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              icon={<User className="h-4 w-4" />}
              label="Full Name"
              value={profile.fullname}
            />

            <DetailItem
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={profile.email || user.email}
            />

            <DetailItem
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={profile.phone}
            />

            <DetailItem
              icon={<GraduationCap className="h-4 w-4" />}
              label="Qualification"
              value={profile.qualification}
            />

            <DetailItem
              icon={<MapPin className="h-4 w-4" />}
              label="City"
              value={profile.city}
            />

            <DetailItem
              icon={<Briefcase className="h-4 w-4" />}
              label="Experience"
              value={profile.experience}
            />
          </div>
        </CardContent>
      </Card>

      {/* Coming LMS Data */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Learning Progress</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm font-medium text-foreground">
                Progress tracking is coming next
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Course progress will appear here once the student progress
                records are connected.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Classes</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm font-medium text-foreground">
                No classes loaded yet
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Upcoming classes will appear here once class scheduling is
                connected to Supabase.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-foreground">
          {value?.trim() || "Not provided"}
        </p>
      </div>
    </div>
  );
}