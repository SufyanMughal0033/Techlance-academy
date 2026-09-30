import Link from "next/link";
import { MessageCircle, Mail, Phone } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { footerNav } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/site-settings";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/layout/social-icons";

export async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-academy grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <Logo />

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {settings.description}
          </p>

          <div className="mt-5 flex items-center gap-3">
            {[
              {
                icon: FacebookIcon,
                href: settings.social.facebook,
                label: "Facebook",
              },
              {
                icon: InstagramIcon,
                href: settings.social.instagram,
                label: "Instagram",
              },
              {
                icon: LinkedinIcon,
                href: settings.social.linkedin,
                label: "LinkedIn",
              },
              {
                icon: YoutubeIcon,
                href: settings.social.youtube,
                label: "YouTube",
              },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Academy" links={footerNav.academy} />
        <FooterColumn title="Students" links={footerNav.student} />
        <FooterColumn title="Policies" links={footerNav.policies} />
      </div>

      <div className="border-t border-border">
        <div className="container-academy flex flex-col gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.name}. A division of Techlance. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={`mailto:${settings.contact.email}`}
              className="flex items-center gap-1.5 hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" />
              {settings.contact.email}
            </a>

            <a
              href={`tel:${settings.contact.phone}`}
              className="flex items-center gap-1.5 hover:text-foreground"
            >
              <Phone className="h-3.5 w-3.5" />
              {settings.contact.phone}
            </a>

            <a
              href={`https://wa.me/${settings.contact.whatsapp.replace(
                /[^\d]/g,
                ""
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { title: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">
        {title}
      </h3>

      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}