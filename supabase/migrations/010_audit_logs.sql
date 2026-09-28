-- =============================================================================
-- 010_audit_logs.sql
-- Written exclusively from server-side privileged actions (never directly
-- from the client) whenever something sensitive changes: certificate
-- issued/revoked, application approved/rejected, student created, program
-- updated, fee changed, etc.
-- =============================================================================

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,          -- e.g. 'certificate.issued', 'application.approved'
  entity_type text not null,     -- e.g. 'certificate', 'application', 'program'
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id);
create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);
