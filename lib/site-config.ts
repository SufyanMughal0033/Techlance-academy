/**
 * Centralized, non-secret site configuration. Anything here that admins
 * should be able to change without a deploy (contact details, hours,
 * socials) will move into the `site_settings` table and be read at
 * request time in Phase 3+ — this file remains as the compile-time
 * fallback and the single source of truth for the public route
 * structure (nav links, footer links) built in Phase 1.
 */

export const siteConfig = {
  name: "Techlance Academy",
  tagline: "Build Digital Skills. Build Your Future.",
  description:
    "Techlance Academy is a digital skills learning and training platform offering practical, career-oriented education in web development, digital marketing, design, and emerging technology — through live classes, mentorship, and real projects.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://academy.techlance.example",
  contact: {
    email: "hello@techlanceacademy.com",
    phone: "+92 300 0000000",
    whatsapp: "+92 300 0000000",
    address: "Faisalabad, Punjab, Pakistan",
  },
  social: {
    facebook: "https://facebook.com/techlanceacademy",
    instagram: "https://instagram.com/techlanceacademy",
    linkedin: "https://linkedin.com/company/techlanceacademy",
    youtube: "https://youtube.com/@techlanceacademy",
  },
  businessHours: "Mon–Sat, 10:00 AM – 7:00 PM (PKT)",
} as const;

export const mainNav = [
  { title: "Home", href: "/" },
  { title: "Programs", href: "/programs" },
  { title: "Admissions", href: "/admissions" },
  { title: "About", href: "/about" },
  { title: "FAQ", href: "/faq" },
  { title: "Contact", href: "/contact" },
] as const;

export const footerNav = {
  academy: [
    { title: "About", href: "/about" },
    { title: "Programs", href: "/programs" },
    { title: "Admissions", href: "/admissions" },
    { title: "Blog", href: "/blog" },
    { title: "Testimonials", href: "/testimonials" },
    { title: "Contact", href: "/contact" },
  ],
  student: [
    { title: "Student Login", href: "/student/login" },
    { title: "Resources", href: "/resources" },
    { title: "Certificate Verification", href: "/certificate-verification" },
    { title: "Support", href: "/contact" },
  ],
  policies: [
    { title: "Privacy Policy", href: "/policies/privacy" },
    { title: "Terms & Conditions", href: "/policies/terms" },
    { title: "Student Policy", href: "/policies/student-policy" },
    { title: "Attendance Policy", href: "/policies/attendance" },
    { title: "Code of Conduct", href: "/policies/code-of-conduct" },
    { title: "Refund Policy", href: "/policies/refund" },
    { title: "Certificate Policy", href: "/policies/certificate" },
  ],
} as const;
