-- =============================================================================
-- 005_classes_and_attendance.sql
-- =============================================================================

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  program_module_id uuid references public.program_modules(id) on delete set null,
  title text not null,
  description text,
  class_date date not null,
  start_time time not null,
  end_time time not null,
  instructor_id uuid references public.instructors(id) on delete set null,
  meeting_link text,
  status class_status not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.classes
  for each row execute function set_updated_at();

create index if not exists idx_classes_program on public.classes(program_id);
create index if not exists idx_classes_date on public.classes(class_date);
create index if not exists idx_classes_instructor on public.classes(instructor_id);

create table if not exists public.class_attendance (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status attendance_status not null default 'absent',
  marked_by uuid references public.profiles(id) on delete set null,
  marked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (class_id, student_id)
);

create trigger set_updated_at before update on public.class_attendance
  for each row execute function set_updated_at();

create index if not exists idx_attendance_student on public.class_attendance(student_id);
create index if not exists idx_attendance_class on public.class_attendance(class_id);
