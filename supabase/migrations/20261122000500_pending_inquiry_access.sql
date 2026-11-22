alter table public.inquiries
  add column if not exists created_at timestamptz;

update public.inquiries
set created_at = now()
where created_at is null;

alter table public.inquiries
  alter column created_at set default now(),
  alter column created_at set not null;

alter table public.inquiries
  add column if not exists status text;

update public.inquiries
set status = 'pending'
where status is null;

alter table public.inquiries
  alter column status set default 'pending',
  alter column status set not null;

grant select (id, created_at, status, move_in, length, booking_for, guest_name)
  on table public.inquiries to authenticated;

drop policy if exists "authenticated users can read own inquiries" on public.inquiries;
create policy "authenticated users can read own inquiries"
  on public.inquiries for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));
