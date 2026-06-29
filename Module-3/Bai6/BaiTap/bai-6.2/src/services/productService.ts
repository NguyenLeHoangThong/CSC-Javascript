import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../types/api';
import { buildSkip } from '../utils/pagination';

// Convert a Prisma row into the exact shape the React frontend expects:
// price/rating as numbers, category as a slug string.
function toShape(p: any) {
  return {
    id: p.id,
    title: p.title,
    price: Number(p.price),
    thumbnail: p.thumbnail,
    category: p.category.slug, // FE wants a string, not the relation object
    description: p.description ?? '',
    brand: p.brand ?? '',
    stock: p.stock,
    rating: Number(p.rating),
    ratingCount: p.ratingCount,
  };
}

// Look up the category id from its slug (throws 404 if missing).
async function resolveCategoryId(slug: string): Promise<number> {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) throw new AppError(404, `Category "${slug}" không tồn tại`);
  return category.id;
}

export async function findAll(query: { category?: string; search?: string; page: number; limit: number }) {
  const { category, search, page, limit } = query;

  const where: Prisma.ProductWhereInput = {
    ...(category && { category: { slug: category } }),
    ...(search && { title: { contains: search, mode: 'insensitive' } }),
  };

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: buildSkip(page, limit),
    }),
    prisma.product.count({ where }),
  ]);

  return { data: products.map(toShape), total };
}

export async function findById(id: number) {
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  if (!product) throw new AppError(404, 'Không tìm thấy sản phẩm');
  return toShape(product);
}

export async function create(data: any) {
  const categoryId = await resolveCategoryId(data.category);
  const product = await prisma.product.create({
    data: {
      title: data.title,
      price: new Prisma.Decimal(data.price),
      thumbnail: data.thumbnail,
      description: data.description ?? null,
      brand: data.brand ?? null,
      stock: data.stock ?? 0,
      categoryId,
    },
    include: { category: true },
  });
  return toShape(product);
}

export async function update(id: number, data: any) {
  const categoryId = data.category ? await resolveCategoryId(data.category) : undefined;
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.price !== undefined && { price: new Prisma.Decimal(data.price) }),
      ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.brand !== undefined && { brand: data.brand }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(categoryId !== undefined && { categoryId }),
    },
    include: { category: true },
  });
  return toShape(product);
}

export async function remove(id: number) {
  return prisma.product.delete({ where: { id } });
}
