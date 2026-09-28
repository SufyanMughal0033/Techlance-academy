-- =============================================================================
-- 009_content_and_cms.sql
-- Everything an admin should be able to edit without touching code.
-- =============================================================================

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null,     -- Admissions, Programs, Fees, Classes, Online Learning,
                               -- Certificates, Assignments, Attendance, Mentorship,
                               -- Refund/Cancellation, Student Portal, Career/Support
  question text not null,
  answer text not null,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.faqs
  for each row execute function set_updated_at();

create index if not exists idx_faqs_category on public.faqs(category, display_order);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  program_name text,
  message text not null,
  photo_url text,
  rating smallint check (rating between 1 and 5),
  is_demo boolean not null default false,     -- true for seeded/demo testimonials
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.testimonials
  for each row execute function set_updated_at();

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,                              -- rich text (Tiptap JSON or HTML)
  featured_image_url text,
  category_id uuid references public.blog_categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  status blog_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.blog_posts
  for each row execute function set_updated_at();

create index if not exists idx_blog_posts_status on public.blog_posts(status, published_at desc);
create index if not exists idx_blog_posts_category on public.blog_posts(category_id);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,      -- Student Handbook, Course PDFs, Guidelines, etc.
  file_bucket text default 'resources',
  file_path text,
  external_url text,
  is_published boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.resources
  for each row execute function set_updated_at();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_read on public.contact_messages(is_read);

-- Single-row-per-key global settings (academy name, logo, contact info,
-- socials, currency, default SEO, certificate settings, business hours).
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.site_settings
  for each row execute function set_updated_at();

-- Flexible, admin-editable blocks for pages that are otherwise static UI —
-- homepage sections, About content, policy bodies, stats, CTA copy. One row
-- per (page, section) pair; `content` holds whatever shape that section needs.
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  page text not null,          -- 'home' | 'about' | 'policies.privacy' | ...
  section text not null,       -- 'hero' | 'stats' | 'body' | ...
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (page, section)
);

create trigger set_updated_at before update on public.site_content
  for each row execute function set_updated_at();
