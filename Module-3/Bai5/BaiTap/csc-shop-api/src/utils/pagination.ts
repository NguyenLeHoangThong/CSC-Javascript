import { PaginationMeta } from '../types/api';

// Convert (page, limit) into the number of rows Prisma should skip.
export function buildSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

// Build the pagination block returned alongside list responses.
export function buildMeta(total: number, page: number, limit: number): PaginationMeta {
  const pages = Math.ceil(total / limit) || 1;
  return {
    total,
    page,
    limit,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
}
