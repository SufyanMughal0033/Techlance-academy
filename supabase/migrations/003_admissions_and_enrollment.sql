-- =============================================================================
-- 003_admissions_and_enrollment.sql
-- The FK from applications -> programs is added in 004_academics.sql (after
-- the programs table exists) via ALTER TABLE, to keep every migration
-- runnable strictly in order without forward references.
-- =============================================================================

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  application_code text unique not null default (
    'APP-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random() * 100000)::text, 5, '0')
  ),

  -- Personal information
  full_name text not null,
  father_or_guardian_name text,
  date_of_birth date,
  gender text,
  email text not null,
  phone text not null,
  whatsapp text,
  city text,
  address text,

  -- Education
  education_level text,
  institution text,
  field_of_study text,
  graduation_year integer,

  -- Skills
  previous_skills text,
  previous_experience text,
  current_digital_skills text,

  -- Application
  program_id uuid,                                 -- FK added in 004_academics.sql
  learning_mode learning_mode not null default 'online_live',
  availability text,
  career_goal text,
  referral_source text,

  -- Additional
  message text,
  agreed_to_terms boolean not null default false,

  status application_status not null default 'pending',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  assessment_scheduled_at timestamptz,

  -- set once an admin converts an approved application into a student account
  converted_student_id uuid references public.students(id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.applications
  for each row execute function set_updated_at();

create index if not exists idx_applications_status on public.applications(status);
create index if not exists idx_applications_email on public.applications(email);
create index if not exists idx_applications_program on public.applications(program_id);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  program_id uuid not null,                        -- FK added in 004_academics.sql
  start_date date,
  end_date date,
  status enrollment_status not null default 'pending',
  fee numeric(12, 2),
  payment_status payment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, program_id)
);

create trigger set_updated_at before update on public.enrollments
  for each row execute function set_updated_at();

create index if not exists idx_enrollments_student on public.enrollments(student_id);
create index if not exists idx_enrollments_program on public.enrollments(program_id);
create index if not exists idx_enrollments_status on public.enrollments(status);
