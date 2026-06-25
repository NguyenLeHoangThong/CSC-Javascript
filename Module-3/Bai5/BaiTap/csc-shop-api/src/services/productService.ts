import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../types/api';
import { slugify } from '../utils/slug';

// Prisma returns Decimal columns as Decimal objects (JSON-serialized as strings).
// The React frontend expects plain numbers, so we normalize every product before sending it.
function serialize(product: any) {
  return {
    ...product,
    price: Number(product.price),
    rating: Number(product.rating),
    // expose the category slug as `category` (string) to match the frontend Product type
    category: product.category?.slug ?? undefined,
  };
}

export async function findAll() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
  return products.map(serialize);
}

export async function findById(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) throw new AppError(404, 'Product not found');
  return serialize(product);
}

export async function create(data: {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  brand?: string | null;
  stock?: number;
  rating?: number;
  ratingCount?: number;
  categoryId: number;
}) {
  // Make sure the category exists first — gives a clear 404 instead of a raw FK error.
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new AppError(404, 'Category not found');

  const product = await prisma.product.create({
    data: {
      title: data.title,
      slug: slugify(data.title),
      description: data.description,
      price: new Prisma.Decimal(data.price),
      thumbnail: data.thumbnail,
      brand: data.brand ?? null,
      stock: data.stock ?? 0,
      rating: new Prisma.Decimal(data.rating ?? 0),
      ratingCount: data.ratingCount ?? 0,
      categoryId: data.categoryId,
    },
    include: { category: true },
  });
  return serialize(product);
}

export async function update(
  id: number,
  data: {
    title?: string;
    description?: string;
    price?: number;
    thumbnail?: string;
    brand?: string | null;
    stock?: number;
    rating?: number;
    ratingCount?: number;
    categoryId?: number;
  }
) {
  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new AppError(404, 'Category not found');
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title, slug: slugify(data.title) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: new Prisma.Decimal(data.price) }),
      ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
      ...(data.brand !== undefined && { brand: data.brand }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.rating !== undefined && { rating: new Prisma.Decimal(data.rating) }),
      ...(data.ratingCount !== undefined && { ratingCount: data.ratingCount }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
    },
    include: { category: true },
  });
  return serialize(product);
}

export async function remove(id: number) {
  return prisma.product.delete({ where: { id } });
}
