-- =============================================================================
-- 002_identity.sql
-- profiles is the base identity row for every authenticated person (1:1 with
-- auth.users). students/admins/instructors extend it with role-specific
-- fields. A profile is created automatically whenever a new auth.users row
-- appears (Supabase Auth sign-up), defaulting to role='student'; promoting
-- someone to admin/instructor is a deliberate, service-role-only action.
-- =============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'student',
  full_name text not null default '',
  email text,
  phone text,
  whatsapp text,
  avatar_url text,
  city text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.profiles
  for each row execute function set_updated_at();

create index if not exists idx_profiles_role on public.profiles(role);

-- Extra, student-specific fields. One row per student, keyed to profiles.id.
create table if not exists public.students (
  id uuid primary key references public.profiles(id) on delete cascade,
  student_code text unique,                          -- e.g. TLA-2026-00001, assigned on enrollment
  father_or_guardian_name text,
  date_of_birth date,
  gender text,
  address text,
  education_level text,
  institution text,
  field_of_study text,
  graduation_year integer,
  previous_skills text,
  previous_experience text,
  career_goal text,
  application_id uuid,                                -- set once converted from an application
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.students
  for each row execute function set_updated_at();

-- Admin-specific metadata. Kept minimal; permissions are role-based, not
-- per-admin, for now.
create table if not exists public.admins (
  id uuid primary key references public.profiles(id) on delete cascade,
  department text,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.admins
  for each row execute function set_updated_at();

-- Instructor-specific metadata, referenced by classes.instructor_id.
create table if not exists public.instructors (
  id uuid primary key references public.profiles(id) on delete cascade,
  bio text,
  specialization text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.instructors
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever a new Supabase Auth user is created.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
