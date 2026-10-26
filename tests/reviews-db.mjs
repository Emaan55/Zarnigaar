// Run with PGLITE_MODULE pointing to an isolated @electric-sql/pglite installation.
// This tests migrations locally; it never connects to the hosted Supabase project.
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
const first = '11111111-1111-4111-8111-111111111111';
const second = '22222222-2222-4222-8222-222222222222';
const product = '33333333-3333-4333-8333-333333333333';
const draft = '44444444-4444-4444-8444-444444444444';
try {
  await db.exec(`
    create role anon; create role authenticated;
    alter default privileges in schema public grant all on tables to anon, authenticated;
    create schema auth;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public, auth to anon, authenticated;
    create table public.products (id uuid primary key, status text);
    grant select on public.products to anon, authenticated;
    insert into auth.users values ('${first}'), ('${second}');
    insert into public.products values ('${product}', 'active'), ('${draft}', 'draft');
  `);
  await db.exec(await readFile(new URL('../supabase/migrations/0007_product_reviews.sql', import.meta.url), 'utf8'));
  const insert = (author, rating = 5, id = product) => db.query(`insert into product_reviews (product_id, user_id, display_name, rating, body) values ($1, $2, 'Customer', $3, 'A genuine customer review')`, [id, author, rating]);
  await db.exec('set role anon');
  await assert.rejects(insert(first));
  await assert.rejects(db.exec("truncate product_reviews"));
  await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${first}', false)`);
  await assert.rejects(insert(second));
  await assert.rejects(insert(first, 0));
  await assert.rejects(insert(first, 6));
  await assert.rejects(insert(first, 5, draft));
  await insert(first, 5);
  await assert.rejects(insert(first));
  await assert.rejects(db.exec('update product_reviews set rating = 1'));
  await assert.rejects(db.exec('truncate product_reviews'));
  await assert.rejects(db.query(`insert into product_reviews (product_id, user_id, display_name, rating, body, created_at) values ($1, $2, 'Customer', 5, 'A genuine review', '2000-01-01')`, [product, second]));
  await db.exec(`select set_config('request.jwt.claim.sub', '${second}', false)`);
  assert.equal((await db.query('delete from product_reviews returning id')).rows.length, 0);
  await insert(second, 3);
  await db.exec('set role anon');
  const stats = (await db.query('select * from product_review_stats')).rows[0];
  assert.equal(stats.review_count, 2);
  assert.equal(Number(stats.average_rating), 4);
  assert.equal((await db.query('select * from product_reviews')).rows.length, 2);
  await db.exec(`reset role; update products set status = 'draft' where id = '${product}'; set role anon`);
  assert.equal((await db.query('select * from product_reviews')).rows.length, 0);
  assert.equal((await db.query('select * from product_review_stats')).rows.length, 0);
  console.log('PASS: anonymous read, authenticated authorship, active products, duplicate prevention, rating bounds, immutable timestamps, update denial, ownership deletion, and exact aggregate ratings.');
  await db.exec(`reset role;
    create table categories (description text);
    create table collections (name text, description text);
    alter table products add column name text, add column description text;
    create table faqs (answer text);
    insert into products values ('55555555-5555-4555-8555-555555555555', 'active', 'Printed Lawn Suit', 'My own fabric description');
    insert into categories values ('Founder custom description');
  `);
  const cleanup = await readFile(new URL('../supabase/migrations/0008_remove_starter_fabric_claims.sql', import.meta.url), 'utf8');
  await db.exec(cleanup);
  const cleaned = (await db.query("select name, description from products where id = '55555555-5555-4555-8555-555555555555'")).rows[0];
  assert.equal(cleaned.name, 'Printed Suit');
  assert.equal(cleaned.description, 'My own fabric description');
  assert.equal((await db.query('select description from categories')).rows[0].description, 'Founder custom description');
  await db.exec(cleanup);
  console.log('PASS: cleanup removes starter names, preserves founder descriptions and is repeatable.');
} finally {
  await db.close();
}
