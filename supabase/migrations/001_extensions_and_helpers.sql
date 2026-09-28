-- =============================================================================
-- 001_extensions_and_helpers.sql
-- Extensions, enum types, and shared helper functions/triggers used across
-- every later migration. Safe to re-run (everything is IF NOT EXISTS /
-- CREATE OR REPLACE).
-- =============================================================================

create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Enum types
-- ---------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('admin', 'instructor', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum (
    'pending', 'under_review', 'assessment_scheduled', 'approved', 'rejected', 'enrolled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type learning_mode as enum ('online_live', 'self_paced', 'hybrid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enrollment_status as enum ('pending', 'active', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending', 'partial', 'paid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type program_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type program_level as enum ('beginner', 'intermediate', 'advanced');
exception when duplicate_object then null; end $$;

do $$ begin
  create type class_status as enum ('scheduled', 'live', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type attendance_status as enum ('present', 'absent', 'late', 'excused');
exception when duplicate_object then null; end $$;

do $$ begin
  create type assignment_status as enum ('pending', 'submitted', 'reviewed', 'late');
exception when duplicate_object then null; end $$;

do $$ begin
  create type certificate_status as enum ('valid', 'revoked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type announcement_target_type as enum ('all', 'program', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type blog_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notification_type as enum (
    'announcement', 'class_reminder', 'assignment', 'quiz', 'certificate',
    'application_status', 'enrollment_update'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- updated_at trigger — attach to every table with an updated_at column via
--   create trigger set_updated_at before update on <table>
--   for each row execute function set_updated_at();
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Role helpers used throughout RLS policies (011_rls_policies.sql).
-- SECURITY DEFINER so they can read `profiles` regardless of the caller's
-- own row-level access, which is what lets them be used *inside* policies
-- without recursion.
-- ---------------------------------------------------------------------------
create or replace function public.current_role()
returns user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_instructor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select role = 'instructor' from public.profiles where id = auth.uid()), false);
$$;
