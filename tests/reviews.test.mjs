import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewSchema } from '../lib/validation/review.ts';

const valid = { productId: 'f77b2710-d1d6-4d3e-8a87-b1f08a1dc2b0', rating: '5', displayName: '  A customer  ', body: '  A helpful review about this article.  ' };

test('reviews validate and normalize submitted fields', () => {
  const result = reviewSchema.parse(valid);
  assert.equal(result.rating, 5);
  assert.equal(result.displayName, 'A customer');
  assert.equal(result.body, 'A helpful review about this article.');
});

test('reject invalid ratings, product IDs and empty or oversized reviews', () => {
  for (const rating of ['', '0', '6', '3.5', 'NaN']) assert.equal(reviewSchema.safeParse({ ...valid, rating }).success, false);
  for (const body of ['', '         ', 'too short', 'x'.repeat(2001)]) assert.equal(reviewSchema.safeParse({ ...valid, body }).success, false);
  assert.equal(reviewSchema.safeParse({ ...valid, productId: 'not-a-uuid' }).success, false);
  assert.equal(reviewSchema.safeParse({ ...valid, displayName: ' ' }).success, false);
});

test('ignore client supplied author identity', () => {
  const result = reviewSchema.parse({ ...valid, user_id: 'someone-else', created_at: '2000-01-01' });
  assert.equal('user_id' in result, false);
  assert.equal('created_at' in result, false);
});
