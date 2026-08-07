import prisma from '../db/prisma';
import { AppError } from '../types/api';
import { GEMINI_MODEL, getGeminiClient, isGeminiConfigured } from '../lib/gemini';
import { getCached, setCached } from '../utils/aiCache';

// Bài 35 — AI for Backend.
//
// The whole point of putting Gemini behind our own service (instead of letting the
// browser call it) is that the API key stays on the server AND we get to add the
// three things an LLM call always needs in production: a cache, a timeout, and
// error classification.

const MIN_QUERY_LENGTH = 3;
const MAX_QUERY_LENGTH = 200;
const MAX_PRODUCTS_IN_PROMPT = 20;
const GEMINI_TIMEOUT_MS = 15_000;

export interface SuggestProduct {
  id: number;
  title: string;
  price: number;
  brand: string | null;
  category: string;
}

export interface SuggestResult {
  query: string;
  suggestion: string;
  cached: boolean;
}

// ── Error classification ────────────────────────────────────────────────
// Gemini answers 429 for two very different situations and the fix differs:
//   - short-term rate limit  -> "retry in a few seconds" (429)
//   - daily quota exhausted  -> retrying today will not help (503)
function classifyGeminiError(err: unknown): AppError {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  const isQuotaExhausted = lower.includes('quota') || lower.includes('resource_exhausted');
  const isRateLimited = lower.includes('429') || lower.includes('rate limit');

  if (isQuotaExhausted) {
    return new AppError(503, 'AI daily quota exceeded. Please try again tomorrow.', 'AI_QUOTA_EXCEEDED');
  }
  if (isRateLimited) {
    return new AppError(429, 'AI is busy right now. Please retry in a few seconds.', 'AI_RATE_LIMITED');
  }
  if (lower.includes('timeout') || lower.includes('aborted')) {
    return new AppError(504, 'AI request timed out. Please try again.', 'AI_TIMEOUT');
  }
  // Never surface the raw provider message: it can contain the API key or internal ids.
  return new AppError(502, 'AI service is unavailable. Please try again later.', 'AI_UNAVAILABLE');
}

// ── Low-level wrapper ───────────────────────────────────────────────────
export async function callGemini(prompt: string): Promise<string> {
  if (!isGeminiConfigured()) {
    throw new AppError(503, 'AI feature is not configured on this server.', 'AI_NOT_CONFIGURED');
  }

  // A hanging LLM call would hold an Express connection open forever — always bound it.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        abortSignal: controller.signal,
        temperature: 0.4, // low: we want consistent shopping advice, not creativity
        maxOutputTokens: 512,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new AppError(502, 'AI returned an empty response.', 'AI_EMPTY');
    return text;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw classifyGeminiError(err);
  } finally {
    clearTimeout(timer);
  }
}

// ── Prompt building ─────────────────────────────────────────────────────
// Kept separate from the call so it can be unit-tested without any network,
// and so the prompt is easy to review/tweak on its own.
export function buildSuggestPrompt(query: string, products: SuggestProduct[]): string {
  const catalogue = products
    .map((p) => `- #${p.id} | ${p.title} | ${p.brand ?? 'No brand'} | ${p.category} | $${p.price}`)
    .join('\n');

  return [
    'Bạn là nhân viên tư vấn của CSC Shop (cửa hàng công nghệ).',
    '',
    'DANH SÁCH SẢN PHẨM CÒN HÀNG:',
    catalogue,
    '',
    `NHU CẦU CỦA KHÁCH: "${query}"`,
    '',
    'YÊU CẦU:',
    '1. Chọn tối đa 3 sản phẩm PHÙ HỢP NHẤT, CHỈ được chọn từ danh sách trên.',
    '2. Mỗi sản phẩm: 1 dòng gồm tên + 1 câu ngắn giải thích vì sao hợp với khách.',
    '3. Nếu không có sản phẩm nào phù hợp, nói thẳng "Hiện chưa có sản phẩm phù hợp" và gợi ý khách mô tả rõ hơn.',
    '4. TUYỆT ĐỐI không bịa ra sản phẩm, giá, hay thông số không có trong danh sách.',
    '5. Trả lời bằng tiếng Việt, tối đa 120 từ, không dùng markdown heading.',
  ].join('\n');
}

// ── Public API ──────────────────────────────────────────────────────────
export async function suggestProducts(rawQuery: unknown): Promise<SuggestResult> {
  // 1. Validate BEFORE doing anything expensive (no DB hit, no Gemini call).
  const query = typeof rawQuery === 'string' ? rawQuery.trim() : '';
  if (query.length < MIN_QUERY_LENGTH) {
    throw new AppError(400, `Query must be at least ${MIN_QUERY_LENGTH} characters`);
  }
  if (query.length > MAX_QUERY_LENGTH) {
    throw new AppError(400, `Query must be at most ${MAX_QUERY_LENGTH} characters`);
  }

  // 2. Cache first — a hit costs nothing and answers instantly.
  const cached = getCached(query);
  if (cached) {
    return { query, suggestion: cached, cached: true };
  }

  // 3. Ground the model in real data: only products we can actually sell.
  //    `select` (not the whole row) keeps the prompt small = cheaper + more accurate.
  const rows = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    select: {
      id: true,
      title: true,
      price: true,
      brand: true,
      category: { select: { name: true } },
    },
    orderBy: { rating: 'desc' },
    take: MAX_PRODUCTS_IN_PROMPT,
  });

  if (rows.length === 0) {
    throw new AppError(404, 'No products are currently in stock');
  }

  const products: SuggestProduct[] = rows.map((p) => ({
    id: p.id,
    title: p.title,
    price: Number(p.price),
    brand: p.brand,
    category: p.category.name,
  }));

  // 4. Call the model, then remember the answer.
  const suggestion = await callGemini(buildSuggestPrompt(query, products));
  setCached(query, suggestion);

  return { query, suggestion, cached: false };
}
