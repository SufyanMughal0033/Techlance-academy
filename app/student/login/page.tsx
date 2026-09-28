import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login-form";
import { signInStudent } from "./actions";

export const metadata = { title: "Student Login" };

export default function StudentLoginPage() {
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
            <CardTitle>Student Login</CardTitle>
            <CardDescription>Sign in to access your dashboard, classes, and materials.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm action={signInStudent} redirectTo="/student/dashboard" />
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Not enrolled yet?{" "}
              <Link href="/apply" className="font-medium text-primary hover:underline">
                Apply now
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
