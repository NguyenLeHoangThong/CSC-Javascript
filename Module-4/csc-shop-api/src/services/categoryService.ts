import prisma from '../db/prisma';
import { AppError } from '../types/api';
import { slugify } from '../utils/slug';
import { categoryCache, CATEGORY_LIST_KEY } from '../utils/categoryCache';

// The shape every category read returns — declared once so the cached value and the
// fresh value can never drift apart.
export interface CategoryWithCount {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { products: number };
}

// Bài 37 — the category list is on every page load and changes almost never.
// Serve it from a 10-minute in-memory cache; invalidate on every write below.
export async function findAll(): Promise<CategoryWithCount[]> {
  const cached = categoryCache.get(CATEGORY_LIST_KEY) as CategoryWithCount[] | undefined;
  if (cached) return cached;

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });

  categoryCache.set(CATEGORY_LIST_KEY, categories);
  return categories;
}

export async function findById(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) throw new AppError(404, 'Category not found');
  return category;
}

export async function create(data: { name: string; description?: string | null }) {
  // Derive the unique slug from the name so clients don't have to send it.
  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description ?? null,
    },
  });
  categoryCache.invalidate(CATEGORY_LIST_KEY);
  return category;
}

export async function update(id: number, data: { name?: string; description?: string | null }) {
  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name, slug: slugify(data.name) }),
      ...(data.description !== undefined && { description: data.description }),
    },
  });
  categoryCache.invalidate(CATEGORY_LIST_KEY);
  return category;
}

export async function remove(id: number) {
  // onDelete: Restrict in the schema means Prisma throws P2003 if products still
  // reference this category — the errorHandler maps that to a 409.
  const category = await prisma.category.delete({ where: { id } });
  categoryCache.invalidate(CATEGORY_LIST_KEY);
  return category;
}
