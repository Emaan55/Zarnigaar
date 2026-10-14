import test from 'node:test';
import assert from 'node:assert/strict';
import { productSchema } from '../lib/validation/product.ts';
import { dealSchema, isSafeNavigation } from '../lib/validation/deal.ts';

const article = {
  name: 'Embroidered lawn suit', slug: 'embroidered-lawn', description: 'Three-piece suit',
  price: '5000', salePrice: '', sku: 'LAWN-01', stock: '4', categoryId: 'category',
  status: 'draft', sizes: 'S, M, L', fabricDetails: 'Cotton lawn',
  additionalDetails: 'Includes a dupatta', careInstructions: 'Hand wash',
  designPhilosophy: 'Inspired by traditional embroidery',
};

test('article content survives validation for create and edit', () => {
  const parsed = productSchema.parse(article);
  for (const key of ['fabricDetails', 'additionalDetails', 'careInstructions', 'designPhilosophy']) {
    assert.equal(parsed[key], article[key]);
  }
  assert.equal(parsed.price, 5000);
});

test('optional article fields support existing products', () => {
  const legacy = { ...article };
  for (const key of ['fabricDetails', 'additionalDetails', 'careInstructions', 'designPhilosophy']) delete legacy[key];
  assert.equal(productSchema.safeParse(legacy).success, true);
  assert.equal(productSchema.safeParse({ ...article, fabricDetails: 'x'.repeat(10001) }).success, false);
});

test('deal image and CTA validate before database writes', () => {
  const deal = { title: 'Summer sale', imageUrl: 'https://example.com/sale.jpg', ctaLabel: 'Shop sale', ctaHref: '/new-in', active: 'on' };
  assert.equal(dealSchema.safeParse(deal).success, true);
  for (const href of ['javascript:alert(1)', '//evil.com', '/\\evil.com', 'http://example.com', 'https://user:password@example.com']) {
    assert.equal(dealSchema.safeParse({ ...deal, ctaHref: href }).success, false, href);
  }
  assert.equal(dealSchema.safeParse({ ...deal, imageUrl: 'javascript:alert(1)' }).success, false);
  assert.equal(isSafeNavigation('https://example.com/shop'), true);
});
