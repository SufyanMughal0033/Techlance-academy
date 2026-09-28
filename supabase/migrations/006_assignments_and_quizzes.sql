-- =============================================================================
-- 006_assignments_and_quizzes.sql
-- =============================================================================

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  program_module_id uuid references public.program_modules(id) on delete set null,
  title text not null,
  description text,
  instructions text,
  attachment_bucket text,
  attachment_path text,
  due_date timestamptz,
  max_marks numeric(6, 2) not null default 100,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.assignments
  for each row execute function set_updated_at();

create index if not exists idx_assignments_program on public.assignments(program_id);

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status assignment_status not null default 'pending',
  submission_bucket text,
  submission_path text,
  submission_note text,
  marks_obtained numeric(6, 2),
  feedback text,
  submitted_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);

create trigger set_updated_at before update on public.assignment_submissions
  for each row execute function set_updated_at();

create index if not exists idx_submissions_student on public.assignment_submissions(student_id);
create index if not exists idx_submissions_assignment on public.assignment_submissions(assignment_id);
create index if not exists idx_submissions_status on public.assignment_submissions(status);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  program_module_id uuid references public.program_modules(id) on delete set null,
  title text not null,
  description text,
  time_limit_minutes integer,
  passing_score numeric(5, 2) not null default 50,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.quizzes
  for each row execute function set_updated_at();

create index if not exists idx_quizzes_program on public.quizzes(program_id);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null,
  marks numeric(5, 2) not null default 1,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_questions_quiz on public.quiz_questions(quiz_id, display_order);

create table if not exists public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  display_order integer not null default 0
);

create index if not exists idx_quiz_options_question on public.quiz_options(question_id);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,   -- { question_id: option_id }
  score numeric(6, 2),
  passed boolean,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_attempts_student on public.quiz_attempts(student_id);
create index if not exists idx_quiz_attempts_quiz on public.quiz_attempts(quiz_id);
