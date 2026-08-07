import prisma from '../db/prisma';
import { AppError } from '../types/api';
import { buildSkip } from '../utils/pagination';
import { USER_PUBLIC_SELECT } from '../constants/userSelect';

// Bài 35 — ProductReview service.

export interface ReviewQuery {
  page: number;
  limit: number;
}

// Public list: hidden reviews are invisible to everyone except through the admin route.
export async function findByProduct(productId: number, query: ReviewQuery) {
  const where = { productId, isVisible: true };

  const [reviews, total, agg] = await prisma.$transaction([
    prisma.productReview.findMany({
      where,
      // include the author in the SAME query — a loop of findUnique() here would be
      // the classic N+1 (Bài 37).
      include: { user: { select: USER_PUBLIC_SELECT } },
      orderBy: { createdAt: 'desc' },
      skip: buildSkip(query.page, query.limit),
      take: query.limit,
    }),
    prisma.productReview.count({ where }),
    prisma.productReview.aggregate({ where, _avg: { rating: true } }),
  ]);

  return {
    data: reviews,
    total,
    // Rounded to 1 decimal so the UI can render "4.3" without formatting logic.
    averageRating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : 0,
  };
}

export async function create(
  productId: number,
  userId: number,
  input: { rating: number; comment?: string | null }
) {
  // Fail fast with 404 instead of letting Prisma throw a foreign-key error (P2003),
  // which would surface as a confusing 409.
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) throw new AppError(404, 'Product not found');

  // The duplicate check is the DB's job: @@unique([userId, productId]) -> P2002.
  // Doing "findFirst then create" instead would let two concurrent requests both pass.
  return prisma.productReview.create({
    data: {
      productId,
      userId,
      rating: input.rating,
      comment: input.comment ?? null,
    },
    include: { user: { select: USER_PUBLIC_SELECT } },
  });
}

// Returns the author of a review (null when it does not exist) — feeds authorizeOwner
// so a customer can delete their own review and an admin can delete any.
export async function findOwnerId(id: number): Promise<number | null> {
  const review = await prisma.productReview.findUnique({ where: { id }, select: { userId: true } });
  return review?.userId ?? null;
}

export async function remove(id: number) {
  return prisma.productReview.delete({ where: { id } });
}

// Admin moderation.
export async function setVisibility(id: number, isVisible: boolean) {
  return prisma.productReview.update({ where: { id }, data: { isVisible } });
}
