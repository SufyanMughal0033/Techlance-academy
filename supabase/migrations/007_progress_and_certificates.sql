-- =============================================================================
-- 007_progress_and_certificates.sql
-- =============================================================================

create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete cascade,
  modules_completed integer not null default 0,
  modules_total integer not null default 0,
  assignments_completed integer not null default 0,
  assignments_total integer not null default 0,
  average_quiz_score numeric(5, 2),
  attendance_percentage numeric(5, 2),
  overall_percentage numeric(5, 2) generated always as (
    case when modules_total > 0
      then round((modules_completed::numeric / modules_total) * 100, 2)
      else 0
    end
  ) stored,
  updated_at timestamptz not null default now(),
  unique (student_id, program_id)
);

create trigger set_updated_at before update on public.student_progress
  for each row execute function set_updated_at();

create index if not exists idx_progress_student on public.student_progress(student_id);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_code text unique not null default (
    'TLA-CERT-' || to_char(now(), 'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  ),
  verification_code text unique not null default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  student_id uuid not null references public.students(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete restrict,
  status certificate_status not null default 'valid',
  issue_date date not null default current_date,
  revoked_at timestamptz,
  revoked_reason text,
  file_bucket text default 'certificates',
  file_path text,
  issued_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.certificates
  for each row execute function set_updated_at();

create index if not exists idx_certificates_student on public.certificates(student_id);
create index if not exists idx_certificates_code on public.certificates(certificate_code);
create index if not exists idx_certificates_verification on public.certificates(verification_code);

-- Append-only log of public verification lookups (not the certificate
-- record itself). Useful for admin visibility into verification traffic;
-- never exposes anything beyond what the public verification page shows.
create table if not exists public.certificate_verifications (
  id uuid primary key default gen_random_uuid(),
  looked_up_code text not null,
  certificate_id uuid references public.certificates(id) on delete set null,
  result text not null,                    -- 'valid' | 'revoked' | 'not_found'
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_cert_verifications_code on public.certificate_verifications(looked_up_code);
