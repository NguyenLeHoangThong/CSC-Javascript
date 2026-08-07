import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Bài 32 — integration test with Supertest.
//
// This is only possible because Bài 32 split `app.ts` (no .listen()) from
// `server.ts`. Supertest boots the app on an ephemeral port, so the test exercises
// the REAL middleware chain: helmet -> CORS -> rate limiter -> validateQuery ->
// controller -> errorHandler. Only Prisma is faked.
const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    product: { findMany: vi.fn(), count: vi.fn() },
    $queryRaw: vi.fn(),
    // productService runs its data + count queries through $transaction([...]).
    $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
  },
}));

vi.mock('../../db/prisma', () => ({ default: prismaMock }));

import app from '../../app';

const FAKE_ROW = {
  id: 1,
  title: 'iPhone 15 Pro',
  price: '999.00', // Prisma returns Decimal columns like this
  rating: '4.8',
  thumbnail: 'https://example.com/iphone.jpg',
  stock: 40,
  ratingCount: 320,
  description: 'A17 Pro chip',
  brand: 'Apple',
  categoryId: 1,
  category: { id: 1, slug: 'smartphones', name: 'Smartphones' },
};

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.product.findMany.mockResolvedValue([FAKE_ROW]);
  prismaMock.product.count.mockResolvedValue(1);
});

describe('GET /api/v1/products', () => {
  // Bài 31 — the refactor must not change the contract the frontend depends on.
  it('answers with the { success, data, meta } envelope', async () => {
    const res = await request(app).get('/api/v1/products');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true });
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toMatchObject({
      total: 1,
      page: 1,
      limit: 12, // productQuerySchema's default
      pages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });

  it('serialises Decimal columns as numbers, not strings', async () => {
    const res = await request(app).get('/api/v1/products');

    // The React storefront does arithmetic on these — a string would silently
    // turn `price * quantity` into concatenation.
    expect(res.body.data[0].price).toBe(999);
    expect(res.body.data[0].rating).toBe(4.8);
    expect(res.body.data[0].category).toBe('smartphones');
  });

  it('rejects an invalid sortBy with 400 instead of passing it to Prisma', async () => {
    // Without validateQuery this string would land in `orderBy: { [sortBy]: order }`.
    const res = await request(app).get('/api/v1/products?sortBy=DROP TABLE');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(prismaMock.product.findMany).not.toHaveBeenCalled();
  });

  it('pushes filters down into the SQL WHERE clause, not into JS', async () => {
    await request(app).get('/api/v1/products?search=iphone&category=smartphones&minPrice=500');

    const where = prismaMock.product.findMany.mock.calls[0][0].where;
    expect(where.OR).toBeDefined(); // search
    expect(where.category).toEqual({ slug: 'smartphones' });
    expect(where.price).toEqual({ gte: 500 });
  });
});

describe('security headers (Bài 36)', () => {
  it('sends helmet headers and hides the Express fingerprint', async () => {
    const res = await request(app).get('/api/v1/products');

    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['permissions-policy']).toContain('camera=()');
  });
});

describe('protected routes', () => {
  it('answers 401 for an admin route without a token', async () => {
    const res = await request(app).get('/api/v1/users');

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ success: false });
  });

  it('answers 401 for the stats dashboard, which used to be public', async () => {
    const res = await request(app).get('/api/v1/stats');

    expect(res.status).toBe(401);
  });
});

describe('GET /health (Bài 39)', () => {
  it('reports ok when the database answers', async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok', database: 'connected' });
  });

  it('reports 503 when the database is unreachable — "process alive" is not "healthy"', async () => {
    prismaMock.$queryRaw.mockRejectedValue(new Error('connection refused'));

    const res = await request(app).get('/health');

    expect(res.status).toBe(503);
    expect(res.body).toMatchObject({ status: 'error', database: 'disconnected' });
  });
});

describe('unknown routes', () => {
  it('answers 404 with the same JSON envelope as every other error', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
