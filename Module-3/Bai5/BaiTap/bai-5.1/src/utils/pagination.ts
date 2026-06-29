import { PaginationMeta } from '../types/api';

export function buildSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function buildMeta(total: number, page: number, limit: number): PaginationMeta {
  return { total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}
