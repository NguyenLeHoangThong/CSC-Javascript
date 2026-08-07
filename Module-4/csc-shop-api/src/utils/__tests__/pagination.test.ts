import { describe, it, expect } from 'vitest';
import { buildSkip, buildMeta } from '../pagination';

// Bài 32 — start with the pure functions: no DB, no mocks, no async.
// These two helpers decide what every list endpoint returns, so a bug here is
// invisible in code review but very visible to users ("page 2 shows page 1").

describe('buildSkip', () => {
  it('skips nothing on the first page', () => {
    expect(buildSkip(1, 12)).toBe(0);
  });

  it('skips one full page on page 2', () => {
    expect(buildSkip(2, 12)).toBe(12);
  });

  it('multiplies correctly for a far page', () => {
    expect(buildSkip(10, 20)).toBe(180);
  });
});

describe('buildMeta', () => {
  it('computes the number of pages by rounding up', () => {
    // 25 rows / 10 per page = 2.5 -> 3 pages, the last one holding 5 rows
    expect(buildMeta(25, 1, 10)).toEqual({
      total: 25,
      page: 1,
      limit: 10,
      pages: 3,
      hasNext: true,
      hasPrev: false,
    });
  });

  it('reports no next page on the last page', () => {
    const meta = buildMeta(25, 3, 10);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(true);
  });

  it('reports both neighbours on a middle page', () => {
    const meta = buildMeta(100, 5, 10);
    expect(meta).toMatchObject({ pages: 10, hasNext: true, hasPrev: true });
  });

  // ── Edge cases: this is where list endpoints actually break ──
  it('still reports 1 page when there are no rows at all', () => {
    // `Math.ceil(0 / 10) || 1` — without the `|| 1` the UI would render "page 1 of 0"
    const meta = buildMeta(0, 1, 10);
    expect(meta.pages).toBe(1);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(false);
  });

  it('handles an exact multiple without inventing an empty last page', () => {
    // 20 rows / 10 = exactly 2 pages, NOT 3
    expect(buildMeta(20, 2, 10).pages).toBe(2);
  });

  it('does not claim a next page when the caller asks past the end', () => {
    const meta = buildMeta(5, 99, 10);
    expect(meta.pages).toBe(1);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(true);
  });
});
