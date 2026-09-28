-- =============================================================================
-- 011_rls_policies.sql
-- Enables Row Level Security on every table and defines who can read/write
-- what. General shape used throughout:
--   - "own row" access for students on their own data
--   - full access for admins via public.is_admin()
--   - public/anon access only for content that is genuinely meant to be
--     public (published programs, FAQs, blog, testimonials, site content)
--   - a couple of SECURITY DEFINER RPC functions for the two cases where a
--     plain row-policy would either leak data (quiz answers) or require
--     exposing an entire table to anon (certificate verification)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Helper: is the current user an *active* enrolled student of this program?
-- ---------------------------------------------------------------------------
create or replace function public.is_enrolled(p_program_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.enrollments
    where student_id = auth.uid()
      and program_id = p_program_id
      and status = 'active'
  );
$$;

-- Enable RLS everywhere.
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.admins enable row level security;
alter table public.instructors enable row level security;
alter table public.applications enable row level security;
alter table public.enrollments enable row level security;
alter table public.programs enable row level security;
alter table public.program_modules enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.learning_materials enable row level security;
alter table public.classes enable row level security;
alter table public.class_attendance enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.student_progress enable row level security;
alter table public.certificates enable row level security;
alter table public.certificate_verifications enable row level security;
alter table public.announcements enable row level security;
alter table public.announcement_targets enable row level security;
alter table public.notifications enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.resources enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_content enable row level security;
alter table public.audit_logs enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

create policy "profiles_admin_delete" on public.profiles
  for delete using (public.is_admin());

-- Prevent a non-admin from promoting themselves or reactivating/deactivating
-- their own account, even though the UPDATE policy above lets them touch
-- their own row for ordinary profile edits.
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    if new.role is distinct from old.role or new.is_active is distinct from old.is_active then
      raise exception 'Only an admin can change role or account status.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- ---------------------------------------------------------------------------
-- students / admins / instructors
-- ---------------------------------------------------------------------------
create policy "students_select_own_or_admin" on public.students
  for select using (id = auth.uid() or public.is_admin());
create policy "students_update_own_or_admin" on public.students
  for update using (id = auth.uid() or public.is_admin());
create policy "students_admin_insert" on public.students
  for insert with check (public.is_admin());
create policy "students_admin_delete" on public.students
  for delete using (public.is_admin());

create policy "admins_admin_only" on public.admins
  for all using (public.is_admin()) with check (public.is_admin());

create policy "instructors_select_authenticated" on public.instructors
  for select using (auth.role() = 'authenticated');
create policy "instructors_admin_write" on public.instructors
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- applications — anyone can apply; only admins can read/manage applications
-- ---------------------------------------------------------------------------
create policy "applications_public_insert" on public.applications
  for insert with check (agreed_to_terms = true);
create policy "applications_admin_manage" on public.applications
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- enrollments — a student reads their own; only admins write
-- ---------------------------------------------------------------------------
create policy "enrollments_select_own_or_admin" on public.enrollments
  for select using (student_id = auth.uid() or public.is_admin());
create policy "enrollments_admin_write" on public.enrollments
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- programs / program_modules — published rows are public, admins see all
-- ---------------------------------------------------------------------------
create policy "programs_public_select_published" on public.programs
  for select using (status = 'published' or public.is_admin());
create policy "programs_admin_write" on public.programs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "program_modules_public_select" on public.program_modules
  for select using (
    public.is_admin() or exists (
      select 1 from public.programs p
      where p.id = program_modules.program_id and p.status = 'published'
    )
  );
create policy "program_modules_admin_write" on public.program_modules
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- courses / lessons / learning_materials — enrolled students + admins only
-- (this is LMS content, not public marketing content)
-- ---------------------------------------------------------------------------
create policy "courses_select_enrolled_or_admin" on public.courses
  for select using (public.is_admin() or public.is_enrolled(program_id));
create policy "courses_admin_write" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

create policy "lessons_select_enrolled_or_admin" on public.lessons
  for select using (
    public.is_admin() or exists (
      select 1 from public.courses c
      where c.id = lessons.course_id and public.is_enrolled(c.program_id)
    )
  );
create policy "lessons_admin_write" on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

create policy "materials_select_enrolled_or_admin" on public.learning_materials
  for select using (
    public.is_admin() or exists (
      select 1 from public.lessons l
      join public.courses c on c.id = l.course_id
      where l.id = learning_materials.lesson_id and public.is_enrolled(c.program_id)
    )
  );
create policy "materials_admin_write" on public.learning_materials
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- classes / class_attendance
-- ---------------------------------------------------------------------------
create policy "classes_select_enrolled_or_admin" on public.classes
  for select using (public.is_admin() or public.is_enrolled(program_id));
create policy "classes_admin_write" on public.classes
  for all using (public.is_admin()) with check (public.is_admin());

create policy "attendance_select_own_or_admin" on public.class_attendance
  for select using (student_id = auth.uid() or public.is_admin());
create policy "attendance_admin_write" on public.class_attendance
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- assignments / assignment_submissions
-- ---------------------------------------------------------------------------
create policy "assignments_select_enrolled_or_admin" on public.assignments
  for select using (public.is_admin() or public.is_enrolled(program_id));
create policy "assignments_admin_write" on public.assignments
  for all using (public.is_admin()) with check (public.is_admin());

create policy "submissions_select_own_or_admin" on public.assignment_submissions
  for select using (student_id = auth.uid() or public.is_admin());
create policy "submissions_insert_own" on public.assignment_submissions
  for insert with check (student_id = auth.uid());
create policy "submissions_update_own_or_admin" on public.assignment_submissions
  for update using (student_id = auth.uid() or public.is_admin());
create policy "submissions_admin_delete" on public.assignment_submissions
  for delete using (public.is_admin());

-- Students may resubmit/edit their own submission file & note, but must not
-- be able to grade themselves.
create or replace function public.protect_submission_review_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    if new.marks_obtained is distinct from old.marks_obtained
      or new.feedback is distinct from old.feedback
      or new.status = 'reviewed' then
      raise exception 'Only an admin can grade or review a submission.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_submission_review_fields on public.assignment_submissions;
create trigger protect_submission_review_fields before update on public.assignment_submissions
  for each row execute function public.protect_submission_review_fields();

-- ---------------------------------------------------------------------------
-- quizzes / quiz_questions / quiz_options / quiz_attempts
-- Students never read quiz_options directly (it would expose is_correct);
-- quiz-taking goes through the sanitized RPC functions below instead.
-- ---------------------------------------------------------------------------
create policy "quizzes_select_enrolled_or_admin" on public.quizzes
  for select using (public.is_admin() or (is_published and public.is_enrolled(program_id)));
create policy "quizzes_admin_write" on public.quizzes
  for all using (public.is_admin()) with check (public.is_admin());

create policy "quiz_questions_admin_only" on public.quiz_questions
  for all using (public.is_admin()) with check (public.is_admin());
create policy "quiz_options_admin_only" on public.quiz_options
  for all using (public.is_admin()) with check (public.is_admin());

create policy "quiz_attempts_select_own_or_admin" on public.quiz_attempts
  for select using (student_id = auth.uid() or public.is_admin());
create policy "quiz_attempts_insert_own" on public.quiz_attempts
  for insert with check (student_id = auth.uid());
create policy "quiz_attempts_admin_write" on public.quiz_attempts
  for update using (public.is_admin());

-- Returns quiz questions + options WITHOUT is_correct, for an enrolled
-- student taking the quiz.
create or replace function public.get_quiz_questions(p_quiz_id uuid)
returns table (
  question_id uuid,
  question text,
  marks numeric,
  display_order integer,
  option_id uuid,
  option_text text,
  option_order integer
)
language sql
security definer
set search_path = public
stable
as $$
  select
    qq.id, qq.question, qq.marks, qq.display_order,
    qo.id, qo.option_text, qo.display_order
  from public.quiz_questions qq
  join public.quizzes q on q.id = qq.quiz_id
  join public.quiz_options qo on qo.question_id = qq.id
  where qq.quiz_id = p_quiz_id
    and q.is_published
    and public.is_enrolled(q.program_id)
  order by qq.display_order, qo.display_order;
$$;

-- Grades and records a quiz attempt server-side, so the answer key never
-- has to reach the browser at all.
create or replace function public.submit_quiz_attempt(p_quiz_id uuid, p_answers jsonb)
returns public.quiz_attempts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_marks numeric := 0;
  v_score numeric := 0;
  v_passing numeric;
  v_program uuid;
  v_result public.quiz_attempts;
  v_question record;
  v_selected uuid;
begin
  select passing_score, program_id into v_passing, v_program
  from public.quizzes where id = p_quiz_id and is_published;

  if v_program is null or not public.is_enrolled(v_program) then
    raise exception 'Not enrolled in this quiz''s program.';
  end if;

  for v_question in
    select id, marks from public.quiz_questions where quiz_id = p_quiz_id
  loop
    v_total_marks := v_total_marks + v_question.marks;
    v_selected := (p_answers ->> v_question.id::text)::uuid;
    if v_selected is not null and exists (
      select 1 from public.quiz_options
      where id = v_selected and question_id = v_question.id and is_correct
    ) then
      v_score := v_score + v_question.marks;
    end if;
  end loop;

  insert into public.quiz_attempts (quiz_id, student_id, answers, score, passed, submitted_at)
  values (
    p_quiz_id, auth.uid(), p_answers,
    case when v_total_marks > 0 then round((v_score / v_total_marks) * 100, 2) else 0 end,
    case when v_total_marks > 0 then (v_score / v_total_marks) * 100 >= v_passing else false end,
    now()
  )
  returning * into v_result;

  return v_result;
end;
$$;

-- ---------------------------------------------------------------------------
-- student_progress — computed server-side, students may only read their own
-- ---------------------------------------------------------------------------
create policy "progress_select_own_or_admin" on public.student_progress
  for select using (student_id = auth.uid() or public.is_admin());
create policy "progress_admin_write" on public.student_progress
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- certificates — never exposed to anon directly; public verification goes
-- through verify_certificate() below.
-- ---------------------------------------------------------------------------
create policy "certificates_select_own_or_admin" on public.certificates
  for select using (student_id = auth.uid() or public.is_admin());
create policy "certificates_admin_write" on public.certificates
  for all using (public.is_admin()) with check (public.is_admin());

create policy "cert_verifications_admin_select" on public.certificate_verifications
  for select using (public.is_admin());

-- Public, rate-limitable entry point for /certificate-verification. Returns
-- only what that page is allowed to show, and logs the lookup.
create or replace function public.verify_certificate(p_code text)
returns table (
  result text,
  student_name text,
  program_name text,
  certificate_code text,
  issue_date date,
  status certificate_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cert record;
begin
  select c.*, p.full_name as student_full_name, pr.name as program_name_val
  into v_cert
  from public.certificates c
  join public.profiles p on p.id = c.student_id
  join public.programs pr on pr.id = c.program_id
  where c.certificate_code = p_code or c.verification_code = p_code
  limit 1;

  insert into public.certificate_verifications (looked_up_code, certificate_id, result)
  values (
    p_code,
    v_cert.id,
    case when v_cert.id is null then 'not_found' else v_cert.status::text end
  );

  if v_cert.id is null then
    return query select 'not_found', null::text, null::text, null::text, null::date, null::certificate_status;
  end if;

  return query select
    v_cert.status::text, v_cert.student_full_name, v_cert.program_name_val,
    v_cert.certificate_code, v_cert.issue_date, v_cert.status;
end;
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;
grant execute on function public.get_quiz_questions(uuid) to authenticated;
grant execute on function public.submit_quiz_attempt(uuid, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- announcements / announcement_targets
-- ---------------------------------------------------------------------------
create policy "announcement_targets_select_own_or_admin" on public.announcement_targets
  for select using (
    public.is_admin()
    or student_id = auth.uid()
    or (program_id is not null and public.is_enrolled(program_id))
  );
create policy "announcement_targets_admin_write" on public.announcement_targets
  for all using (public.is_admin()) with check (public.is_admin());

create policy "announcements_select_visible_or_admin" on public.announcements
  for select using (
    public.is_admin()
    or (
      is_published and (
        target_type = 'all'
        or exists (
          select 1 from public.announcement_targets t
          where t.announcement_id = announcements.id
            and (t.student_id = auth.uid() or (t.program_id is not null and public.is_enrolled(t.program_id)))
        )
      )
    )
  );
create policy "announcements_admin_write" on public.announcements
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create policy "notifications_select_own_or_admin" on public.notifications
  for select using (profile_id = auth.uid() or public.is_admin());
create policy "notifications_update_own" on public.notifications
  for update using (profile_id = auth.uid());
create policy "notifications_admin_insert" on public.notifications
  for insert with check (public.is_admin());
create policy "notifications_admin_delete" on public.notifications
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Public content: faqs, testimonials, blog, resources
-- ---------------------------------------------------------------------------
create policy "faqs_public_select_published" on public.faqs
  for select using (is_published or public.is_admin());
create policy "faqs_admin_write" on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "testimonials_public_select_published" on public.testimonials
  for select using (is_published or public.is_admin());
create policy "testimonials_admin_write" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

create policy "blog_categories_public_select" on public.blog_categories
  for select using (true);
create policy "blog_categories_admin_write" on public.blog_categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "blog_posts_public_select_published" on public.blog_posts
  for select using (status = 'published' or public.is_admin());
create policy "blog_posts_admin_write" on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

create policy "resources_public_select_published" on public.resources
  for select using (is_published or public.is_admin());
create policy "resources_admin_write" on public.resources
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- contact_messages — anyone can submit, only admins can read
-- ---------------------------------------------------------------------------
create policy "contact_messages_public_insert" on public.contact_messages
  for insert with check (true);
create policy "contact_messages_admin_manage" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- site_settings / site_content — public read (drives the public site),
-- admin-only write
-- ---------------------------------------------------------------------------
create policy "site_settings_public_select" on public.site_settings
  for select using (true);
create policy "site_settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

create policy "site_content_public_select" on public.site_content
  for select using (true);
create policy "site_content_admin_write" on public.site_content
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- audit_logs — admin read-only from the client; writes happen exclusively
-- through the service-role client (see lib/supabase/admin.ts), so no
-- insert/update/delete policy is defined here on purpose.
-- ---------------------------------------------------------------------------
create policy "audit_logs_admin_select" on public.audit_logs
  for select using (public.is_admin());
