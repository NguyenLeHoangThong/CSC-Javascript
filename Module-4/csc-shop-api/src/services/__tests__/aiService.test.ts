import { describe, it, expect, vi, beforeEach } from 'vitest';

// Bài 35 — testing an AI feature WITHOUT calling the AI.
//
// Everything external is mocked: Prisma (no DB in CI) and the Gemini client
// (no API key, no quota burned, no flaky network, deterministic assertions).
const { prismaMock, generateContentMock } = vi.hoisted(() => ({
  prismaMock: { product: { findMany: vi.fn() } },
  generateContentMock: vi.fn(),
}));

vi.mock('../../db/prisma', () => ({ default: prismaMock }));
vi.mock('../../lib/gemini', () => ({
  GEMINI_MODEL: 'gemini-test',
  isGeminiConfigured: () => true,
  getGeminiClient: () => ({ models: { generateContent: generateContentMock } }),
}));

import * as aiService from '../aiService';
import { clearCache } from '../../utils/aiCache';

const FAKE_PRODUCTS = [
  { id: 1, title: 'MacBook Pro 14"', price: 1999, brand: 'Apple', category: { name: 'Laptops' } },
  { id: 2, title: 'Dell XPS 15', price: 1499, brand: 'Dell', category: { name: 'Laptops' } },
];

beforeEach(() => {
  vi.clearAllMocks();
  clearCache(); // otherwise test #2 would be answered by test #1's cached value
});

describe('buildSuggestPrompt', () => {
  it('grounds the prompt in the real catalogue and forbids inventing products', () => {
    const prompt = aiService.buildSuggestPrompt('laptop cho lập trình viên', [
      { id: 1, title: 'MacBook Pro 14"', price: 1999, brand: 'Apple', category: 'Laptops' },
    ]);

    expect(prompt).toContain('MacBook Pro 14"');
    expect(prompt).toContain('laptop cho lập trình viên');
    // The anti-hallucination instruction is the whole reason this feature is safe
    // to show customers — assert it never gets dropped by an edit.
    expect(prompt).toContain('không bịa');
  });
});

describe('suggestProducts', () => {
  it('rejects a query shorter than 3 characters with 400 — before touching the DB or Gemini', async () => {
    await expect(aiService.suggestProducts('ab')).rejects.toMatchObject({ statusCode: 400 });

    expect(prismaMock.product.findMany).not.toHaveBeenCalled();
    expect(generateContentMock).not.toHaveBeenCalled();
  });

  it('only feeds in-stock products to the model', async () => {
    prismaMock.product.findMany.mockResolvedValue(FAKE_PRODUCTS);
    generateContentMock.mockResolvedValue({ text: 'Gợi ý: MacBook Pro 14"' });

    await aiService.suggestProducts('laptop lập trình');

    const where = prismaMock.product.findMany.mock.calls[0][0].where;
    expect(where).toEqual({ stock: { gt: 0 } });
  });

  it('returns the suggestion and marks it as fresh on a cache miss', async () => {
    prismaMock.product.findMany.mockResolvedValue(FAKE_PRODUCTS);
    generateContentMock.mockResolvedValue({ text: '  Gợi ý: Dell XPS 15  ' });

    const result = await aiService.suggestProducts('laptop mỏng nhẹ');

    expect(result.cached).toBe(false);
    expect(result.suggestion).toBe('Gợi ý: Dell XPS 15'); // trimmed
    expect(generateContentMock).toHaveBeenCalledTimes(1);
  });

  it('answers a repeated query from cache without calling Gemini again', async () => {
    prismaMock.product.findMany.mockResolvedValue(FAKE_PRODUCTS);
    generateContentMock.mockResolvedValue({ text: 'Gợi ý: MacBook Pro 14"' });

    await aiService.suggestProducts('laptop cho dân văn phòng');
    // Different spacing/casing on purpose: cacheKey() normalises before lookup.
    const second = await aiService.suggestProducts('  LAPTOP cho dân   văn phòng ');

    expect(second.cached).toBe(true);
    expect(generateContentMock).toHaveBeenCalledTimes(1); // still 1, not 2
  });

  it('maps a short-term 429 to 429 "retry soon"', async () => {
    prismaMock.product.findMany.mockResolvedValue(FAKE_PRODUCTS);
    generateContentMock.mockRejectedValue(new Error('429 Too Many Requests'));

    await expect(aiService.suggestProducts('tai nghe chống ồn')).rejects.toMatchObject({
      statusCode: 429,
      code: 'AI_RATE_LIMITED',
    });
  });

  it('maps an exhausted daily quota to 503 — retrying today will not help', async () => {
    prismaMock.product.findMany.mockResolvedValue(FAKE_PRODUCTS);
    generateContentMock.mockRejectedValue(new Error('RESOURCE_EXHAUSTED: quota exceeded for the day'));

    await expect(aiService.suggestProducts('điện thoại chụp ảnh đẹp')).rejects.toMatchObject({
      statusCode: 503,
      code: 'AI_QUOTA_EXCEEDED',
    });
  });

  it('never leaks the raw provider error to the client', async () => {
    prismaMock.product.findMany.mockResolvedValue(FAKE_PRODUCTS);
    generateContentMock.mockRejectedValue(new Error('Invalid API key AIzaSyD-SECRET-KEY-1234'));

    const error = await aiService.suggestProducts('máy tính bảng').catch((e) => e);

    expect(error.statusCode).toBe(502);
    expect(error.message).not.toContain('AIzaSy');
  });

  it('does not cache a failed call', async () => {
    prismaMock.product.findMany.mockResolvedValue(FAKE_PRODUCTS);
    generateContentMock.mockRejectedValueOnce(new Error('429 Too Many Requests'));

    await expect(aiService.suggestProducts('sạc nhanh')).rejects.toBeTruthy();

    // The retry must reach Gemini again instead of replaying the error.
    generateContentMock.mockResolvedValue({ text: 'Gợi ý: Anker 65W Charger' });
    const retry = await aiService.suggestProducts('sạc nhanh');

    expect(retry.cached).toBe(false);
    expect(retry.suggestion).toContain('Anker');
  });

  it('returns 404 when nothing is in stock instead of asking the model for nothing', async () => {
    prismaMock.product.findMany.mockResolvedValue([]);

    await expect(aiService.suggestProducts('bất kỳ thứ gì')).rejects.toMatchObject({ statusCode: 404 });
    expect(generateContentMock).not.toHaveBeenCalled();
  });
});
