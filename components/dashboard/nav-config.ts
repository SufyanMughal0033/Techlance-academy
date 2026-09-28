import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  GraduationCap,
  Video,
  FileText,
  ClipboardList,
  FileQuestion,
  CalendarCheck,
  TrendingUp,
  Megaphone,
  Award,
  UserCircle,
  LifeBuoy,
  Users,
  Inbox,
  BookOpen,
  Layers,
  HelpCircle,
  Quote,
  Newspaper,
  FolderOpen,
  Globe,
  Settings,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const studentNav: NavItem[] = [
  { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { title: "My Programs", href: "/student/programs", icon: GraduationCap },
  { title: "Classes", href: "/student/classes", icon: Video },
  { title: "Materials", href: "/student/materials", icon: FileText },
  { title: "Assignments", href: "/student/assignments", icon: ClipboardList },
  { title: "Tests", href: "/student/tests", icon: FileQuestion },
  { title: "Attendance", href: "/student/attendance", icon: CalendarCheck },
  { title: "Progress", href: "/student/progress", icon: TrendingUp },
  { title: "Announcements", href: "/student/announcements", icon: Megaphone },
  { title: "Certificates", href: "/student/certificates", icon: Award },
  { title: "Profile", href: "/student/profile", icon: UserCircle },
  { title: "Support", href: "/student/support", icon: LifeBuoy },
];

export const adminNav: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Students", href: "/admin/students", icon: Users },
  { title: "Applications", href: "/admin/applications", icon: Inbox },
  { title: "Programs", href: "/admin/programs", icon: GraduationCap },
  { title: "Courses", href: "/admin/courses", icon: BookOpen },
  { title: "Modules", href: "/admin/modules", icon: Layers },
  { title: "Materials", href: "/admin/materials", icon: FileText },
  { title: "Classes", href: "/admin/classes", icon: Video },
  { title: "Assignments", href: "/admin/assignments", icon: ClipboardList },
  { title: "Tests", href: "/admin/tests", icon: FileQuestion },
  { title: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { title: "Progress", href: "/admin/progress", icon: TrendingUp },
  { title: "Certificates", href: "/admin/certificates", icon: Award },
  { title: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { title: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { title: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { title: "Blog", href: "/admin/blog", icon: Newspaper },
  { title: "Resources", href: "/admin/resources", icon: FolderOpen },
  { title: "Website Content", href: "/admin/content", icon: Globe },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];
