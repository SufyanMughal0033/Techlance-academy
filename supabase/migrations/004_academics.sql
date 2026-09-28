-- =============================================================================
-- 004_academics.sql
-- Hierarchy: program -> (program_modules: public curriculum outline)
--            program -> course -> lesson -> learning_material (LMS content)
-- =============================================================================

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,                 -- e.g. "Web Development", "Digital Marketing"
  level program_level not null default 'beginner',
  short_description text,
  overview text,                          -- rich text (Tiptap JSON or HTML)
  who_this_is_for text,
  learning_outcomes text,
  eligibility text,
  requirements text,
  duration_weeks integer,
  class_format text,                      -- e.g. "Live online, 3x/week"
  weekly_schedule text,
  fee numeric(12, 2),
  currency text not null default 'PKR',
  certificate_info text,
  image_url text,
  status program_status not null default 'draft',
  display_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.programs
  for each row execute function set_updated_at();

create index if not exists idx_programs_status on public.programs(status);
create index if not exists idx_programs_category on public.programs(category);
create index if not exists idx_programs_slug on public.programs(slug);

-- Now that programs exists, wire up the deferred foreign keys.
alter table public.applications
  add constraint applications_program_id_fkey
  foreign key (program_id) references public.programs(id) on delete set null;

alter table public.enrollments
  add constraint enrollments_program_id_fkey
  foreign key (program_id) references public.programs(id) on delete restrict;

-- Public curriculum outline shown on the program detail page
-- ("Module 01", "Module 02", ...). Distinct from the LMS course/lesson
-- structure below, which is what enrolled students actually work through.
create table if not exists public.program_modules (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  title text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.program_modules
  for each row execute function set_updated_at();

create index if not exists idx_program_modules_program on public.program_modules(program_id, display_order);

-- LMS course. Usually one primary course per program, but modelled as its
-- own table so a program can have more than one (e.g. a bonus/elective course).
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  title text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.courses
  for each row execute function set_updated_at();

create index if not exists idx_courses_program on public.courses(program_id, display_order);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.lessons
  for each row execute function set_updated_at();

create index if not exists idx_lessons_course on public.lessons(course_id, display_order);

create table if not exists public.learning_materials (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  type text not null default 'link',      -- 'pdf' | 'video' | 'link' | 'document' | 'other'
  url text,                               -- external link, or Supabase Storage path
  storage_bucket text,                    -- e.g. 'course-materials', when type is a stored file
  storage_path text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.learning_materials
  for each row execute function set_updated_at();

create index if not exists idx_learning_materials_lesson on public.learning_materials(lesson_id, display_order);
