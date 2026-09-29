"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps next-themes. Using attribute="class" toggles the `.dark` class on
 * <html>, which our design tokens in globals.css key off. next-themes
 * injects a small blocking inline script on the server so the correct
 * theme class is present before first paint — this is what prevents
 * the light/dark "flash" on load. `enableSystem` + defaultTheme="system"
 * means a first-time visitor gets their OS preference automatically.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}