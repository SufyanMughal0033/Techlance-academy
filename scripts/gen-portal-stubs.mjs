import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const root = "/home/claude/techlance-academy/app";

const studentPages = [
  ["dashboard", "Dashboard", "Your welcome overview: active programs, upcoming classes, pending assignments, attendance, and progress at a glance."],
  ["programs", "My Programs", "The programs you're enrolled in, pulled from your `enrollments` records."],
  ["classes", "Classes", "Upcoming and past live classes for your enrolled programs, each with its meeting link when it's time."],
  ["materials", "Materials", "PDFs, documents, links, and videos for each lesson in your enrolled courses."],
  ["assignments", "Assignments", "Assignments due, submitted, and reviewed, with marks and feedback once graded."],
  ["tests", "Tests", "Quizzes available to you, taken through a server-side grading flow so answer keys are never exposed to the browser."],
  ["attendance", "Attendance", "Your attendance record per class, plus your overall attendance percentage."],
  ["progress", "Progress", "Module completion, assignment completion, quiz average, and attendance rolled into one progress view."],
  ["announcements", "Announcements", "Announcements addressed to all students, your program, or you directly."],
  ["certificates", "Certificates", "Certificates issued to you, each with a certificate ID you can share for verification."],
  ["profile", "Profile", "Your profile details. Sensitive fields (email, account status) require admin verification to change."],
  ["support", "Support", "A way to reach academy support about your account, classes, or enrollment."],
];

const adminPages = [
  ["dashboard", "Admin Dashboard", "Key statistics — students, pending applications, active programs, upcoming classes — plus recent activity."],
  ["students", "Students", "Every student account: add, edit, deactivate, manage enrollment, and view progress."],
  ["applications", "Applications", "Review, filter, and act on admission applications — approve, reject, schedule an assessment, or convert to a student."],
  ["programs", "Programs", "Create and manage programs: description, curriculum outline, fee, duration, and publish status."],
  ["courses", "Courses", "The LMS course structure that sits under each program."],
  ["modules", "Modules", "Curriculum modules shown on public program pages, and the lessons enrolled students work through."],
  ["materials", "Materials", "Upload and organize learning materials — PDFs, links, and videos — per lesson."],
  ["classes", "Classes", "Schedule live classes, assign an instructor, and attach a meeting link."],
  ["assignments", "Assignments", "Create assignments and review student submissions with marks and feedback."],
  ["tests", "Tests", "Build quizzes: questions, options, correct answers, time limits, and passing scores."],
  ["attendance", "Attendance", "Mark attendance per class and review attendance reports by student, program, or date."],
  ["progress", "Progress", "Program-wide and per-student progress and completion rates."],
  ["certificates", "Certificates", "Issue, edit, revoke, and verify certificates, with a unique ID generated for each."],
  ["announcements", "Announcements", "Publish announcements to all students, a specific program, or an individual student."],
  ["faqs", "FAQs", "Manage the categorized FAQ list shown on the public FAQ page."],
  ["testimonials", "Testimonials", "Add and publish real, consented student testimonials (seeded demo entries are clearly flagged)."],
  ["blog", "Blog", "Write, edit, and publish blog posts with the rich-text editor, categories, and SEO metadata."],
  ["resources", "Resources", "Upload and organize downloadable resources shown on the public Resources page."],
  ["content", "Website Content", "Edit homepage sections, About content, policies, and other CMS-managed text without a code change."],
  ["settings", "Settings", "Academy name, logo, contact details, socials, business hours, currency, and certificate settings."],
];

const jsxText = (s) => s.replace(/'/g, "&apos;");

function template(title, description) {
  return `import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "${title}" };

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">${jsxText(title)}</h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          ${jsxText(description)}
        </p>
      </div>
      <Card>
        <CardContent className="py-14 text-center text-sm text-muted-foreground">
          This section&apos;s data views and actions are built in a later phase,
          once real Supabase data and CRUD flows are wired up on top of this
          foundation.
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

for (const [slug, title, description] of studentPages) {
  const file = `${root}/student/(portal)/${slug}/page.tsx`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, template(title, description), "utf8");
  console.log("wrote", file);
}

for (const [slug, title, description] of adminPages) {
  const file = `${root}/admin/(portal)/${slug}/page.tsx`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, template(title, description), "utf8");
  console.log("wrote", file);
}
