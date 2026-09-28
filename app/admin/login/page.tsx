import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login-form";
import { signInAdmin } from "./actions";

export const metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Restricted to Techlance Academy staff accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm action={signInAdmin} redirectTo="/admin/dashboard" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
