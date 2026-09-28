-- =============================================================================
-- 008_communications.sql
-- =============================================================================

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  target_type announcement_target_type not null default 'all',
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.announcements
  for each row execute function set_updated_at();

create index if not exists idx_announcements_published on public.announcements(is_published, published_at desc);

-- Rows only needed when target_type = 'program' or 'student'.
create table if not exists public.announcement_targets (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint announcement_target_one_of check (
    (program_id is not null and student_id is null) or
    (program_id is null and student_id is not null)
  )
);

create index if not exists idx_announcement_targets_announcement on public.announcement_targets(announcement_id);
create index if not exists idx_announcement_targets_program on public.announcement_targets(program_id);
create index if not exists idx_announcement_targets_student on public.announcement_targets(student_id);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_profile on public.notifications(profile_id, is_read);
