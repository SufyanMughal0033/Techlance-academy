-- =============================================================================
-- 012_storage.sql
-- Buckets and storage.objects policies. Convention for owner-scoped buckets:
-- objects are stored at `<user_id>/<filename>`, so storage.foldername(name)[1]
-- gives the owning user's id for policy checks.
-- =============================================================================

insert into storage.buckets (id, name, public)
values
  ('student-avatars', 'student-avatars', true),
  ('program-images', 'program-images', true),
  ('blog-images', 'blog-images', true),
  ('resources', 'resources', true),
  ('course-materials', 'course-materials', false),
  ('assignments', 'assignments', false),
  ('certificates', 'certificates', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- student-avatars — public read; a student may only write inside their own
-- "<user_id>/..." folder; admins may write anywhere.
-- ---------------------------------------------------------------------------
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'student-avatars');

create policy "avatars_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'student-avatars'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );

create policy "avatars_owner_update" on storage.objects
  for update using (
    bucket_id = 'student-avatars'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );

create policy "avatars_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'student-avatars'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );

-- ---------------------------------------------------------------------------
-- program-images / blog-images / resources — public read, admin-only write
-- ---------------------------------------------------------------------------
create policy "public_buckets_read" on storage.objects
  for select using (bucket_id in ('program-images', 'blog-images', 'resources'));

create policy "public_buckets_admin_write" on storage.objects
  for insert with check (bucket_id in ('program-images', 'blog-images', 'resources') and public.is_admin());
create policy "public_buckets_admin_update" on storage.objects
  for update using (bucket_id in ('program-images', 'blog-images', 'resources') and public.is_admin());
create policy "public_buckets_admin_delete" on storage.objects
  for delete using (bucket_id in ('program-images', 'blog-images', 'resources') and public.is_admin());

-- ---------------------------------------------------------------------------
-- course-materials — private; enrolled students (of the relevant program)
-- and admins can read. Since materiality of "which program" isn't encoded
-- in the storage path by default, the simplest safe policy is admin-write /
-- authenticated-read, with the *real* gate enforced at the application
-- layer via signed URLs generated only after the learning_materials RLS
-- check passes. Tighten further (e.g. path-prefixed by program id) once
-- the upload flow is implemented in Phase 5.
-- ---------------------------------------------------------------------------
create policy "course_materials_authenticated_read" on storage.objects
  for select using (bucket_id = 'course-materials' and auth.role() = 'authenticated');
create policy "course_materials_admin_write" on storage.objects
  for insert with check (bucket_id = 'course-materials' and public.is_admin());
create policy "course_materials_admin_update" on storage.objects
  for update using (bucket_id = 'course-materials' and public.is_admin());
create policy "course_materials_admin_delete" on storage.objects
  for delete using (bucket_id = 'course-materials' and public.is_admin());

-- ---------------------------------------------------------------------------
-- assignments — a student may upload/read only inside their own
-- "<user_id>/..." folder; admins can read/write everything (for feedback
-- attachments and review).
-- ---------------------------------------------------------------------------
create policy "assignments_owner_read" on storage.objects
  for select using (
    bucket_id = 'assignments'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );
create policy "assignments_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'assignments'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );
create policy "assignments_owner_update" on storage.objects
  for update using (
    bucket_id = 'assignments'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );
create policy "assignments_admin_delete" on storage.objects
  for delete using (bucket_id = 'assignments' and public.is_admin());

-- ---------------------------------------------------------------------------
-- certificates — private; a student may read only their own certificate
-- file ("<user_id>/..."), admins can read/write everything. Never public.
-- ---------------------------------------------------------------------------
create policy "certificates_owner_read" on storage.objects
  for select using (
    bucket_id = 'certificates'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );
create policy "certificates_admin_write" on storage.objects
  for insert with check (bucket_id = 'certificates' and public.is_admin());
create policy "certificates_admin_update" on storage.objects
  for update using (bucket_id = 'certificates' and public.is_admin());
create policy "certificates_admin_delete" on storage.objects
  for delete using (bucket_id = 'certificates' and public.is_admin());
