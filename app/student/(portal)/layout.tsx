import { requireRole } from "@/lib/auth";
import { StudentShellClient } from "@/components/dashboard/student-shell-client";

export default async function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await requireRole("student");

  return (
    <StudentShellClient
      user={{
        name: profile.full_name || user.email || "Student",
        email: profile.email ?? user.email ?? "",
        avatarUrl: profile.avatar_url,
      }}
    >
      {children}
    </StudentShellClient>
  );
}
