-- Contact form submissions (Contact page). Run after 0002_policies.sql.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Inserts happen via a server action using the service-role client, so no
-- public insert policy is needed. Only admins can read submissions.
create policy "contact_messages_admin_read" on public.contact_messages
  for select using (public.is_admin());
