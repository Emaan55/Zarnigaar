-- Row Level Security policies for Zarnigaar
-- Run after 0001_schema.sql.

-- =========================================================
-- helper: is the current user an admin?
-- =========================================================
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  ) or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer set search_path = public;

-- =========================================================
-- profiles
-- =========================================================
alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- =========================================================
-- admin_users (admin-only, no public policy needed on client)
-- =========================================================
alter table public.admin_users enable row level security;

create policy "admin_users_select_admin_only" on public.admin_users
  for select using (public.is_admin());

-- =========================================================
-- categories / collections / collection_products (public read, admin write)
-- =========================================================
alter table public.categories enable row level security;
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

alter table public.collections enable row level security;
create policy "collections_public_read" on public.collections for select using (true);
create policy "collections_admin_write" on public.collections for all
  using (public.is_admin()) with check (public.is_admin());

alter table public.collection_products enable row level security;
create policy "collection_products_public_read" on public.collection_products for select using (true);
create policy "collection_products_admin_write" on public.collection_products for all
  using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- products / product_images (public read of active products, admin write)
-- =========================================================
alter table public.products enable row level security;
create policy "products_public_read" on public.products
  for select using (status = 'active' or public.is_admin());
create policy "products_admin_write" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

alter table public.product_images enable row level security;
create policy "product_images_public_read" on public.product_images for select using (true);
create policy "product_images_admin_write" on public.product_images for all
  using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- orders / order_items (owner or admin; inserts happen via server actions
-- using the service role, so no public insert policy is granted here)
-- =========================================================
alter table public.orders enable row level security;
create policy "orders_select_owner_or_admin" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

alter table public.order_items enable row level security;
create policy "order_items_select_owner_or_admin" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- =========================================================
-- discounts (admin manages; validation of a code happens via server action
-- using the service role, so no public select policy is granted here)
-- =========================================================
alter table public.discounts enable row level security;
create policy "discounts_admin_all" on public.discounts for all
  using (public.is_admin()) with check (public.is_admin());

alter table public.discount_usages enable row level security;
create policy "discount_usages_admin_read" on public.discount_usages
  for select using (public.is_admin() or auth.uid() = user_id);

-- =========================================================
-- deals (public read of active deals, admin write)
-- =========================================================
alter table public.deals enable row level security;
create policy "deals_public_read" on public.deals
  for select using (active = true or public.is_admin());
create policy "deals_admin_write" on public.deals for all
  using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- wishlists / wishlist_items (owner only)
-- =========================================================
alter table public.wishlists enable row level security;
create policy "wishlists_owner_all" on public.wishlists for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.wishlist_items enable row level security;
create policy "wishlist_items_owner_all" on public.wishlist_items for all
  using (
    exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
  );

-- =========================================================
-- faqs (public read, admin write)
-- =========================================================
alter table public.faqs enable row level security;
create policy "faqs_public_read" on public.faqs for select using (true);
create policy "faqs_admin_write" on public.faqs for all
  using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- media (admin only)
-- =========================================================
alter table public.media enable row level security;
create policy "media_admin_all" on public.media for all
  using (public.is_admin()) with check (public.is_admin());
