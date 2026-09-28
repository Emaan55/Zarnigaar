# Zarnigaar

Premium Pakistani clothing & scarves e-commerce site — Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and Supabase (Postgres + Auth + Storage).

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4 + shadcn/ui (Base UI primitives)
- Zustand (cart / guest wishlist), React Hook Form + Zod (validated forms)
- Supabase: Postgres, Row Level Security, Auth, Storage
- Framer Motion for scroll reveals and micro-interactions

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project's anon key and service role key (Project Settings → API in the Supabase dashboard). The project URL is already set to `https://rklgjlxgnbtulnbdacwy.supabase.co`.

```bash
cp .env.example .env.local
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only — it's used for guest checkout order writes, coupon validation and the contact form, all of which need to work before a user has an account. Never expose it to the client.

## 3. Run the database migrations

In the Supabase SQL Editor (or via the Supabase CLI), run the files in `supabase/migrations/` **in order**:

1. `0001_schema.sql` — all tables (profiles, products, orders, discounts, wishlists, faqs, media, etc.)
2. `0002_policies.sql` — Row Level Security policies for every table
3. `0003_storage.sql` — creates the public `media` Storage bucket + its policies
4. `0004_seed.sql` — optional starter content (categories, a handful of products, FAQs, one deal) so the storefront isn't empty. Product photography is intentionally left blank; product cards show a soft placeholder until you upload real images through `/admin/products`.
5. `0005_contact_messages.sql` — table backing the Contact page form

```bash
# with the Supabase CLI, from the project root:
supabase link --project-ref rklgjlxgnbtulnbdacwy
supabase db push
```

Or paste each file's contents into the SQL Editor and run them one at a time, in the order above.

## 4. Create your admin account

1. Run the app (`npm run dev`), go to `/login`, and create an account (this also works with a real user signing up).
2. In the Supabase SQL Editor, promote that user to admin:

```sql
update public.profiles set role = 'admin' where id = '<the user's auth.users id>';
```

3. Sign in again and visit `/admin` — the dashboard, orders, products, categories, collections, deals, discounts, media library and FAQs are all there.

## 5. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Without real Supabase keys configured, catalog/data queries fail gracefully to empty states — the homepage, navigation and layout still render so you can preview the design immediately.

## Project structure

```
/app            Routes: (site) = storefront (shares navbar/footer/cart drawer), admin = protected dashboard
/components     ui/ (shadcn) + layout, home, product, cart, shop, admin, auth composed components
/lib            Supabase clients (browser/server/admin/middleware), pricing, payments abstraction, validation schemas
/data           Server-only data-fetching functions (Supabase queries → domain types)
/actions        Server actions (mutations): checkout, auth, wishlist, contact, admin/*
/types          Database types (mirrors the SQL schema) and domain types (Product, Category, Cart, ...)
/hooks          Client hooks: cart and guest-wishlist Zustand stores
/supabase/migrations   SQL migrations, run in numeric order (see above)
```

## Notes on a few design decisions

- **Payments**: `lib/payments/` is a small provider abstraction. Cash on Delivery is fully implemented; `online-stub.ts` is a placeholder that throws until a real Pakistan-compatible gateway (JazzCash, Easypaisa, HBL PayFast, etc.) is wired into its `init()` method — nothing else in checkout needs to change when that happens. No card details are ever stored.
- **Guest vs. authenticated wishlist**: guests get a `localStorage`-backed wishlist (`hooks/use-wishlist.ts`); signed-in users get one persisted in Supabase (`wishlists` / `wishlist_items`, RLS-scoped to the owner). `WishlistButton` picks whichever applies per viewer.
- **Product images**: placeholders (`components/shared/placeholder-image.tsx`) render for any product without uploaded photos, so the site never fakes photography. Upload real images per-product from `/admin/products/[id]`.
- **Shipping/coupons**: flat-rate shipping with a free-shipping threshold lives in `lib/pricing.ts` — adjust `FLAT_SHIPPING_RATE` / `FREE_SHIPPING_THRESHOLD` there. Checkout always re-prices and re-validates stock/coupons server-side (`actions/checkout.ts`), never trusting client-submitted totals.
