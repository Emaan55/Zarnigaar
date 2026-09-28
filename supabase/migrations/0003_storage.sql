-- Storage bucket + policies for product/media images.
-- Run after 0002_policies.sql.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_bucket_public_read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media_bucket_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

create policy "media_bucket_admin_update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());

create policy "media_bucket_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());
