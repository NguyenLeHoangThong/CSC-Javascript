import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../types/api';
import { slugify } from '../utils/slug';
import { buildSkip } from '../utils/pagination';

// Prisma returns Decimal columns as Decimal objects (JSON-serialized as strings).
// The React frontend expects plain numbers, so we normalize every product before sending it.
function serialize(product: any) {
  return {
    ...product,
    price: Number(product.price),
    rating: Number(product.rating),
    category: product.category?.slug ?? undefined,
  };
}

export interface ProductQuery {
  search?: string;
  category?: string; // category slug
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating' | 'createdAt';
  order?: 'asc' | 'desc';
  page: number;
  limit: number;
}

// Bài 6: list with search + filter + sort + pagination, all done in the database.
export async function findAll(query: ProductQuery) {
  const { search, category, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc', page, limit } = query;

  // Build the WHERE clause incrementally — only add a condition when the filter is present.
  const where: Prisma.ProductWhereInput = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(category && category !== 'all' && { category: { slug: category } }),
    // price is a range filter: combine gte/lte into one object
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  };

  // Run the data query and the count query together in one round trip.
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { [sortBy]: order },
      skip: buildSkip(page, limit),
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { data: products.map(serialize), total };
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
