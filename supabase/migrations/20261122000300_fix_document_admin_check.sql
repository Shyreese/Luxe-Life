create or replace function public.is_resident_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.resident_admins
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

revoke all on function public.is_resident_admin() from public, anon, authenticated;
grant execute on function public.is_resident_admin() to authenticated;

drop policy if exists "admins and residents can read stay documents" on storage.objects;
drop policy if exists "resident admins can upload stay documents" on storage.objects;
drop policy if exists "resident admins can update stay documents" on storage.objects;
drop policy if exists "resident admins can delete stay documents" on storage.objects;

create policy "admins and residents can read stay documents"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'resident-documents'
    and cardinality(storage.foldername(name)) = 1
    and split_part(name, '/', 2) in ('lease.pdf', 'payment-receipt.pdf')
    and (
      public.is_resident_admin()
      or exists (
        select 1
        from public.residents
        where residents.id::text = (storage.foldername(name))[1]
          and lower(residents.email) = lower(auth.jwt() ->> 'email')
          and residents.status in ('active', 'ended')
      )
    )
  );

create policy "resident admins can upload stay documents"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'resident-documents'
    and cardinality(storage.foldername(name)) = 1
    and split_part(name, '/', 2) in ('lease.pdf', 'payment-receipt.pdf')
    and public.is_resident_admin()
    and exists (
      select 1
      from public.residents
      where residents.id::text = (storage.foldername(name))[1]
    )
  );

create policy "resident admins can update stay documents"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'resident-documents'
    and cardinality(storage.foldername(name)) = 1
    and split_part(name, '/', 2) in ('lease.pdf', 'payment-receipt.pdf')
    and public.is_resident_admin()
    and exists (
      select 1
      from public.residents
      where residents.id::text = (storage.foldername(name))[1]
    )
  )
  with check (
    bucket_id = 'resident-documents'
    and cardinality(storage.foldername(name)) = 1
    and split_part(name, '/', 2) in ('lease.pdf', 'payment-receipt.pdf')
    and public.is_resident_admin()
    and exists (
      select 1
      from public.residents
      where residents.id::text = (storage.foldername(name))[1]
    )
  );

create policy "resident admins can delete stay documents"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'resident-documents'
    and cardinality(storage.foldername(name)) = 1
    and split_part(name, '/', 2) in ('lease.pdf', 'payment-receipt.pdf')
    and public.is_resident_admin()
    and exists (
      select 1
      from public.residents
      where residents.id::text = (storage.foldername(name))[1]
    )
  );
