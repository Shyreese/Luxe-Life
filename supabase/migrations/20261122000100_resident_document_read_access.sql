drop policy if exists "residents can read their own resident documents" on storage.objects;
create policy "residents can read their own resident documents"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'resident-documents'
    and exists (
      select 1
      from public.residents
      where residents.id::text = (storage.foldername(name))[1]
        and lower(residents.email) = lower(auth.jwt() ->> 'email')
    )
  );
