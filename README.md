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

## Password recovery email setup

The login page includes **Forgot password?**: enter an email, verify the recovery
code, then enter and confirm a new password. Recovery uses Supabase's
`resetPasswordForEmail`, `verifyOtp` with `type: "recovery"`, and `updateUser`.
The recovery session stays in memory; refreshing or leaving the form requires
requesting another code. No service-role key is exposed to the browser.

In Supabase **Authentication → Email Templates → Reset Password**, configure
the email body to display the OTP rather than only a confirmation link:

```html
<h2>Reset your Zarnigaar password</h2>
<p>Enter this verification code on the page where you requested your reset:</p>
<p><strong>{{ .Token }}</strong></p>
<p>If you did not request this, you can ignore this email.</p>
```

Configure custom SMTP for production email delivery; the built-in sender's
email restrictions and rate limits also apply to recovery emails. Keep OTP
expiry and rate limits enabled. The form accepts numeric codes of 6–10 digits.

With a test account, validate: email delivery; incorrect and expired codes
cannot unlock the password form; mismatched passwords cannot be submitted;
a correct code permits updating the password; the new password signs in and
the old password no longer works. Live delivery requires Supabase configuration
and cannot be verified without access to the test inbox.

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

## Admin content management

Use `/admin/products` to create articles with name, description, fabric details,
additional article details, sizes, colors, care instructions, design philosophy,
price, stock and publication status. Save a new article first, then upload its
photos from the edit page. Draft and archived articles remain hidden from the
storefront. Optional detail sections appear on the product page when populated.

Before deploying these article fields, apply
`supabase/migrations/0006_article_details.sql` in the Supabase SQL Editor after
migrations 0001–0005. This additive migration preserves existing products and
uses their existing admin write policies. It has not been applied automatically
to the hosted project.

Use `/admin/deals` to upload a promotion image (PNG, JPEG, WebP or AVIF, up to
5 MB), set its title, description, CTA label and destination, and activate or
hide it. Destinations accept site paths such as `/women` or HTTPS links. All
active deals within their stored date window appear on the homepage. Uploads
require the `media` bucket and admin policies from migration 0003.

Use `/admin/customers` to view registered account email, name, signup date,
latest sign-in date and confirmation status, with 50 accounts per page.
Dates use Pakistan time. This screen is admin-only and requires the server-side
`SUPABASE_SERVICE_ROLE_KEY` in Vercel's environment settings. It does not expose
credentials, list live visitors, or retain a history of every sign-in.

Validation commands:

```bash
npm run lint
npx --no-install next typegen
npx --no-install tsc --noEmit
node --experimental-strip-types --test tests/admin-content.test.mjs
npm run build
```

After configuring the database and environment, verify with an admin account:
create a draft article with all detail fields, upload photos, publish it and
check its product page; create and edit multiple deals and check their images
and CTA destinations on the homepage; open Customers and check pagination.
Confirm a customer account cannot access any admin page or invoke admin writes.

## Product reviews and owner-provided fabric details

Fabric information is entered manually in the article editor. Storefront copy
and starter content must not infer a material, composition or fabric treatment.
The optional starter seed uses neutral descriptions; existing URLs are retained
so product links continue to work.

Apply migrations in order after 0006:

- `0007_product_reviews.sql`: review table, database validation, ownership
  policies and a rating summary view that respects row-level security.
- `0008_remove_starter_fabric_claims.sql`: replace only exact original starter
  fabric claims. Custom names/descriptions are preserved, as are URL slugs.

These migrations have not been applied to the hosted Supabase project.
Without 0007, product browsing still works and the reviews section reports
that reviews are unavailable rather than showing fabricated ratings.

Customers can read reviews without signing in. Writing requires an authenticated
account, a public display name, 1–5 stars and a 10–2,000 character review. Each
account can submit one review per product. Reviews are published immediately;
they are not labeled as verified purchases. Product cards show real aggregate
ratings and link to the review section. Product pages show ten reviews per page.

Run validation with `node --experimental-strip-types --test tests/*.test.mjs`.
For isolated PostgreSQL policy/migration checks (no hosted database access):

```bash
npm install --prefix /tmp/zarnigaar-review-db --cache /workspace/.npm --no-audit --no-fund @electric-sql/pglite
PGLITE_MODULE=/tmp/zarnigaar-review-db/node_modules/@electric-sql/pglite/dist/index.js node tests/reviews-db.mjs
```

After applying migrations, test review submission using a real signed-in test
account, verify it appears on its product page and rating card, and confirm a
second submission is rejected. Also check that a signed-out visitor can read
reviews and is prompted to sign in before posting.
