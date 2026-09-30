import { requireRole } from "@/lib/auth";
import { AdminShellClient } from "@/components/dashboard/admin-shell-client";

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await requireRole("admin");

  return (
    <AdminShellClient
      user={{
        name: profile.fullname || user.email || "Admin",
        email: profile.email ?? user.email ?? "",
        avatarUrl: undefined,
      }}
    >
      {children}
    </AdminShellClient>
  );
}