import { PaginationMeta } from '../types/api';

export function buildSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function buildMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const pages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
}
