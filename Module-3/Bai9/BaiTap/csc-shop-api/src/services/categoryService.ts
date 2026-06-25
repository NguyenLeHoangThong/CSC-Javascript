import prisma from '../db/prisma';
import { AppError } from '../types/api';
import { slugify } from '../utils/slug';

// Return every category together with how many products it holds (_count).
export async function findAll() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
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
  return prisma.category.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description ?? null,
    },
  });
}

export async function update(
  id: number,
  data: { name?: string; description?: string | null }
) {
  return prisma.category.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name, slug: slugify(data.name) }),
      ...(data.description !== undefined && { description: data.description }),
    },
  });
}

export async function remove(id: number) {
  // onDelete: Restrict in the schema means Prisma throws P2003 if products still
  // reference this category — the errorHandler maps that to a 409.
  return prisma.category.delete({ where: { id } });
}
