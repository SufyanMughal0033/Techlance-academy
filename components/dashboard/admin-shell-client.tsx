"use client";

import { useRouter } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNav } from "@/components/dashboard/nav-config";
import { createClient } from "@/lib/supabase/client";

export function AdminShellClient({
  user,
  children,
}: {
  user: { name: string; email: string; avatarUrl?: string | null };
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <DashboardShell
      navItems={adminNav}
      roleLabel="Admin"
      profileHref="/admin/settings"
      user={user}
      onSignOut={handleSignOut}
    >
      {children}
    </DashboardShell>
  );
}
