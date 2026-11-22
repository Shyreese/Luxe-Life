grant insert (booking_for, full_name, email, phone, move_in, length, guest_name, guest_email, guest_phone, guest_org, message)
  on table public.inquiries to authenticated;

drop policy if exists "authenticated users can submit inquiries" on public.inquiries;
create policy "authenticated users can submit inquiries"
  on public.inquiries for insert to authenticated with check (true);
