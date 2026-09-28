"use client";

import { useRouter } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { studentNav } from "@/components/dashboard/nav-config";
import { createClient } from "@/lib/supabase/client";

export function StudentShellClient({
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
    router.replace("/student/login");
    router.refresh();
  }

  return (
    <DashboardShell
      navItems={studentNav}
      roleLabel="Student"
      profileHref="/student/profile"
      user={user}
      onSignOut={handleSignOut}
    >
      {children}
    </DashboardShell>
  );
}
