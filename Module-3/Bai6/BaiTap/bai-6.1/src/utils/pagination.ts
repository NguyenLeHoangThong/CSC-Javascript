import { PaginationMeta } from '../types/api';

export function buildSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

// Richer meta: also expose hasNext / hasPrev for the frontend.
export function buildMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 1;
  return { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
}
