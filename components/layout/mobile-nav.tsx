"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, GraduationCap, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { mainNav } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-[85%] flex-col sm:max-w-xs">
        <SheetHeader>
          <SheetTitle asChild>
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {mainNav.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2.5 text-[0.95rem] font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
                  pathname === item.href && "bg-muted text-foreground"
                )}
              >
                {item.title}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <SheetClose asChild>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/student/login">
                <GraduationCap className="h-4 w-4" />
                Student Login
              </Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button asChild className="justify-between">
              <Link href="/apply">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
