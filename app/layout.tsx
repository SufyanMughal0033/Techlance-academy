import type { Metadata, Viewport } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getSiteSettings } from "@/lib/site-settings";
import { SmoothScroll } from "@/components/smooth-scroll/smooth-scroll";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const favicon = settings.faviconUrl || "/favicon.ico";

  return {
    metadataBase: new URL(settings.url),

    title: {
      default: `${settings.name} — ${settings.tagline}`,
      template: `%s — ${settings.name}`,
    },

    description: settings.description,

    openGraph: {
      type: "website",
      locale: "en_PK",
      url: settings.url,
      siteName: settings.name,
      title: `${settings.name} — ${settings.tagline}`,
      description: settings.description,
    },

    twitter: {
      card: "summary_large_image",
      title: `${settings.name} — ${settings.tagline}`,
      description: settings.description,
    },

    icons: {
      icon: favicon,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#faf9f6",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#0e1013",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}