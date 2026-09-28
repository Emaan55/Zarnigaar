-- Zarnigaar e-commerce schema
-- Run in the Supabase SQL editor (or via `supabase db push`) in order: 0001_schema.sql, then 0002_policies.sql, then 0003_seed.sql (optional).

create extension if not exists "pgcrypto";

-- =========================================================
-- profiles (1:1 with auth.users)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- explicit admin authorization table (admin routes check membership here)
create table if not exists public.admin_users (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- =========================================================
-- catalog
-- =========================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  sale_price numeric(10, 2) check (sale_price is null or sale_price >= 0),
  sku text unique not null,
  stock integer not null default 0 check (stock >= 0),
  category_id uuid references public.categories(id) on delete set null,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  is_new boolean not null default false,
  is_featured boolean not null default false,
  is_sold_out boolean not null default false,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_slug_idx on public.products(slug);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  position integer not null default 0
);

create index if not exists product_images_product_id_idx on public.product_images(product_id);

create table if not exists public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  primary key (collection_id, product_id)
);

-- =========================================================
-- orders
-- =========================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address text not null,
  city text not null,
  province text not null,
  postal_code text not null,
  payment_method text not null check (payment_method in ('cod', 'online')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null default 0,
  discount_total numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  discount_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_order_number_idx on public.orders(order_number);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  image text,
  price numeric(10, 2) not null,
  size text,
  color text,
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) not null
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- =========================================================
-- discounts
-- =========================================================
create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric(10, 2) not null check (value > 0),
  min_order numeric(10, 2) not null default 0,
  usage_limit integer,
  used_count integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  applicable_product_ids uuid[] not null default '{}',
  applicable_category_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists discounts_code_idx on public.discounts(code);

create table if not exists public.discount_usages (
  id uuid primary key default gen_random_uuid(),
  discount_id uuid not null references public.discounts(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  used_at timestamptz not null default now()
);

-- =========================================================
-- deals (homepage promos)
-- =========================================================
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  cta_label text,
  cta_href text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- wishlists
-- =========================================================
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (wishlist_id, product_id)
);

-- =========================================================
-- faqs
-- =========================================================
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'general',
  position integer not null default 0
);

-- =========================================================
-- media (Supabase Storage reference library)
-- =========================================================
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  path text not null,
  filename text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- updated_at trigger helper
-- =========================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.categories;
create trigger set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.collections;
create trigger set_updated_at before update on public.collections
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.products;
create trigger set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.orders;
create trigger set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
