-- Real customer reviews: one review per signed-in account per active product.
create table public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 60),
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(btrim(body)) between 10 and 2000),
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);
create index product_reviews_product_created_idx on public.product_reviews(product_id, created_at desc);
alter table public.product_reviews enable row level security;
create policy "reviews_read_active_products" on public.product_reviews for select
  using (exists (select 1 from public.products where id = product_id and status = 'active'));
create policy "reviews_insert_own" on public.product_reviews for insert to authenticated
  with check (user_id = auth.uid() and exists (
    select 1 from public.products where id = product_id and status = 'active'
  ));
-- Only deletions by the review's owner are allowed. Editing another customer's
-- review or submitting a second review is never allowed, even via direct API calls.
create policy "reviews_delete_own" on public.product_reviews for delete to authenticated
  using (user_id = auth.uid());
-- Override any broad Supabase default grants before granting minimum privileges.
revoke all on public.product_reviews from anon, authenticated;
grant select on public.product_reviews to anon, authenticated;
grant insert (product_id, user_id, display_name, rating, body) on public.product_reviews to authenticated;
grant delete on public.product_reviews to authenticated;

create view public.product_review_stats with (security_invoker = true) as
  select product_id, count(*)::integer as review_count,
    round(avg(rating), 1)::numeric as average_rating
  from public.product_reviews group by product_id;
revoke all on public.product_review_stats from anon, authenticated;
grant select on public.product_review_stats to anon, authenticated;
