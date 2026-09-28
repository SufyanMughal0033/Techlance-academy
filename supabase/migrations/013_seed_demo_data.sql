-- =============================================================================
-- 013_seed_demo_data.sql
-- Realistic starter content so the site isn't empty on first run. Anything
-- that could be mistaken for a real testimonial or statistic is marked
-- is_demo = true (testimonials) or carries an explicit "demo" flag inside
-- its JSON payload (site_content stats) — see 041/spec section 59.
-- This file is safe to skip or delete entirely; nothing else depends on it.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Programs
-- ---------------------------------------------------------------------------
insert into public.programs (slug, name, category, level, short_description, duration_weeks, class_format, fee, currency, status, display_order)
values
  ('digital-marketing', 'Digital Marketing', 'Digital Marketing', 'beginner',
    'Plan, run, and measure digital marketing campaigns across search, social, and email.', 10, 'Live online, 3x/week', 45000, 'PKR', 'published', 1),
  ('web-development', 'Web Development', 'Web Development', 'beginner',
    'Full-stack web development from HTML/CSS fundamentals to deployed applications.', 16, 'Live online, 4x/week', 65000, 'PKR', 'published', 2),
  ('front-end-development', 'Front-End Development', 'Web Development', 'beginner',
    'Modern front-end engineering with HTML, CSS, JavaScript, and React.', 12, 'Live online, 3x/week', 55000, 'PKR', 'published', 3),
  ('back-end-development', 'Back-End Development', 'Web Development', 'intermediate',
    'Server-side development, databases, APIs, and deployment.', 12, 'Live online, 3x/week', 55000, 'PKR', 'published', 4),
  ('app-development', 'App Development', 'App Development', 'intermediate',
    'Cross-platform mobile app development from idea to app-store-ready build.', 14, 'Live online, 3x/week', 60000, 'PKR', 'published', 5),
  ('seo', 'SEO', 'SEO', 'beginner',
    'Technical, on-page, and off-page SEO for ranking real websites.', 8, 'Live online, 2x/week', 35000, 'PKR', 'published', 6),
  ('content-writing', 'Content Writing', 'Content Creation', 'beginner',
    'Writing for the web: blogs, landing pages, and SEO-aware content.', 8, 'Live online, 2x/week', 30000, 'PKR', 'published', 7),
  ('graphic-design', 'Graphic Design', 'Graphic Design', 'beginner',
    'Visual design fundamentals and professional tools for branding and digital media.', 10, 'Live online, 3x/week', 40000, 'PKR', 'published', 8),
  ('video-editing', 'Video Editing', 'Video Editing', 'beginner',
    'Editing, color, and sound for short-form and long-form video content.', 8, 'Live online, 2x/week', 35000, 'PKR', 'published', 9),
  ('ai-emerging-digital-skills', 'AI & Emerging Digital Skills', 'AI & Emerging Skills', 'intermediate',
    'Practical, tool-based introduction to working with modern AI systems.', 8, 'Live online, 2x/week', 45000, 'PKR', 'published', 10)
on conflict (slug) do nothing;

-- Example curriculum outline for two programs
insert into public.program_modules (program_id, title, description, display_order)
select id, m.title, m.description, m.ord
from public.programs, lateral (
  values
    ('Module 01 — Foundations', 'HTML, CSS, and how the web actually works.', 1),
    ('Module 02 — JavaScript', 'Core programming concepts and DOM interaction.', 2),
    ('Module 03 — React', 'Building interactive interfaces with components and state.', 3),
    ('Module 04 — Capstone Project', 'A complete project built and deployed from scratch.', 4)
) as m(title, description, ord)
where programs.slug = 'web-development'
on conflict do nothing;

insert into public.program_modules (program_id, title, description, display_order)
select id, m.title, m.description, m.ord
from public.programs, lateral (
  values
    ('Module 01 — Marketing Fundamentals', 'Funnels, channels, and how a campaign is structured.', 1),
    ('Module 02 — Search & Social Ads', 'Running and optimizing paid campaigns.', 2),
    ('Module 03 — SEO & Content', 'Organic growth through search and content.', 3),
    ('Module 04 — Analytics & Reporting', 'Measuring what a campaign actually did.', 4)
) as m(title, description, ord)
where programs.slug = 'digital-marketing'
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- FAQs
-- ---------------------------------------------------------------------------
insert into public.faqs (category, question, answer, display_order) values
  ('Admissions', 'Who can apply to Techlance Academy?', 'Anyone 16 or older with a willingness to learn — no prior technical background is required for beginner-level programs.', 1),
  ('Admissions', 'Is there an entry test?', 'Most programs only require the application form. Some advanced programs include a short assessment or interview.', 2),
  ('Programs', 'Are classes live or pre-recorded?', 'Classes are live and instructor-led on a fixed weekly schedule, not a pre-recorded video course.', 1),
  ('Fees', 'Can I pay in installments?', 'Yes, installment plans are available for most programs — ask during your application review.', 1),
  ('Fees', 'Is there a refund if I withdraw early?', 'Refunds are handled according to our Refund & Cancellation Policy, based on how much of the program has been delivered.', 2),
  ('Certificates', 'When is the certificate issued?', 'After you meet the program''s completion requirements — attendance, assignments, and any required assessment score.', 1),
  ('Certificates', 'How can someone verify my certificate?', 'Anyone can verify a certificate''s authenticity at the Certificate Verification page using its certificate ID.', 2),
  ('Student Portal', 'How do I access my classes and materials?', 'Once enrolled, you''ll receive login access to the student dashboard, where classes, materials, and assignments are all in one place.', 1),
  ('Attendance', 'What attendance percentage is required?', 'Most programs require at least 80% attendance to remain eligible for a certificate.', 1),
  ('Mentorship', 'How does 1-to-1 mentorship work?', 'Each student is paired with a mentor who reviews their work and is available for scheduled check-ins throughout the program.', 1)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Testimonials — demo content, clearly flagged
-- ---------------------------------------------------------------------------
insert into public.testimonials (student_name, program_name, message, rating, is_demo, is_published, display_order) values
  ('Demo Student — Ayesha K.', 'Web Development', 'Demo testimonial placeholder: replace with a real, consented student testimonial before launch.', 5, true, true, 1),
  ('Demo Student — Bilal R.', 'Digital Marketing', 'Demo testimonial placeholder: replace with a real, consented student testimonial before launch.', 5, true, true, 2),
  ('Demo Student — Sana M.', 'Graphic Design', 'Demo testimonial placeholder: replace with a real, consented student testimonial before launch.', 4, true, true, 3)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------
insert into public.blog_categories (slug, name) values
  ('digital-marketing', 'Digital Marketing'),
  ('web-development', 'Web Development'),
  ('seo', 'SEO'),
  ('ai', 'AI'),
  ('career-guidance', 'Career Guidance'),
  ('student-tips', 'Student Tips'),
  ('industry-updates', 'Industry Updates'),
  ('tutorials', 'Tutorials')
on conflict (slug) do nothing;

insert into public.blog_posts (slug, title, excerpt, content, category_id, tags, status, published_at)
select
  'how-to-choose-your-first-digital-skill',
  'How to Choose Your First Digital Skill',
  'A practical framework for picking a program based on your interests and the market, not just what''s trending.',
  'Demo post content — replace with real editorial content before launch.',
  (select id from public.blog_categories where slug = 'career-guidance'),
  array['career', 'beginners'],
  'published', now()
on conflict (slug) do nothing;

insert into public.blog_posts (slug, title, excerpt, content, category_id, tags, status, published_at)
select
  'seo-basics-every-beginner-should-know',
  'SEO Basics Every Beginner Should Know',
  'The handful of SEO fundamentals that matter most when you''re just starting out.',
  'Demo post content — replace with real editorial content before launch.',
  (select id from public.blog_categories where slug = 'seo'),
  array['seo', 'tutorials'],
  'published', now()
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Resources (records only — admin uploads the actual files via Storage)
-- ---------------------------------------------------------------------------
insert into public.resources (title, description, category, is_published) values
  ('Student Handbook', 'Academy policies, expectations, and how the student portal works.', 'Student Handbook', true),
  ('Application Guidelines', 'What to prepare before starting your application.', 'Guidelines', true)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Site settings (drives contact info / footer / business hours from the CMS
-- instead of hardcoded values, once Phase 3 reads from this table)
-- ---------------------------------------------------------------------------
insert into public.site_settings (key, value) values
  ('academy_name', '"Techlance Academy"'),
  ('contact_email', '"hello@techlanceacademy.com"'),
  ('contact_phone', '"+92 300 0000000"'),
  ('contact_whatsapp', '"+92 300 0000000"'),
  ('address', '"Faisalabad, Punjab, Pakistan"'),
  ('business_hours', '"Mon\u2013Sat, 10:00 AM \u2013 7:00 PM (PKT)"'),
  ('currency', '"PKR"'),
  ('social_links', '{"facebook":"https://facebook.com/techlanceacademy","instagram":"https://instagram.com/techlanceacademy","linkedin":"https://linkedin.com/company/techlanceacademy","youtube":"https://youtube.com/@techlanceacademy"}'),
  ('default_seo', '{"title":"Techlance Academy — Build Digital Skills. Build Your Future.","description":"Practical, career-oriented digital skills education through live classes, mentorship, and real projects."}')
on conflict (key) do nothing;

-- Homepage statistics — explicitly marked as demo. Replace with real
-- figures (or wire this section to compute live counts) before launch.
insert into public.site_content (page, section, content) values
  ('home', 'stats', '{"is_demo": true, "students": 120, "programs": 10, "projects": 85, "certificates": 60, "mentorship_sessions": 300}')
on conflict (page, section) do nothing;
