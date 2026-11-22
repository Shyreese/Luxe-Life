insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resident-documents',
  'resident-documents',
  false,
  15728640,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "resident admins can read resident documents" on storage.objects;
create policy "resident admins can read resident documents"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'resident-documents'
    and exists (
      select 1
      from public.resident_admins
      where lower(email) = lower(auth.jwt() ->> 'email')
    )
  );

drop policy if exists "resident admins can upload resident documents" on storage.objects;
create policy "resident admins can upload resident documents"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'resident-documents'
    and exists (
      select 1
      from public.resident_admins
      where lower(email) = lower(auth.jwt() ->> 'email')
    )
  );

drop policy if exists "resident admins can update resident documents" on storage.objects;
create policy "resident admins can update resident documents"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'resident-documents'
    and exists (
      select 1
      from public.resident_admins
      where lower(email) = lower(auth.jwt() ->> 'email')
    )
  )
  with check (
    bucket_id = 'resident-documents'
    and exists (
      select 1
      from public.resident_admins
      where lower(email) = lower(auth.jwt() ->> 'email')
    )
  );

drop policy if exists "resident admins can delete resident documents" on storage.objects;
create policy "resident admins can delete resident documents"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'resident-documents'
    and exists (
      select 1
      from public.resident_admins
      where lower(email) = lower(auth.jwt() ->> 'email')
    )
  );
