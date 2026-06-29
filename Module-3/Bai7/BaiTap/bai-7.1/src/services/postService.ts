import prisma from '../db/prisma';
import { AppError } from '../types/api';

// Public list: only published posts
export async function findAllPublished() {
  return prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id: number) {
  const post = await prisma.post.findUnique({ where: { id }, include: { author: { select: { id: true, name: true } } } });
  if (!post) throw new AppError(404, 'Không tìm thấy bài viết');
  return post;
}

export async function create(authorId: number, data: { title: string; content: string; published?: boolean }) {
  return prisma.post.create({ data: { ...data, authorId } });
}

// Update/delete only allowed for the author (checked here for clear 403/404).
export async function updateOwn(id: number, userId: number, data: any) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new AppError(404, 'Không tìm thấy bài viết');
  if (post.authorId !== userId) throw new AppError(403, 'Bạn không phải tác giả của bài viết này');
  return prisma.post.update({ where: { id }, data });
}

export async function removeOwn(id: number, userId: number) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new AppError(404, 'Không tìm thấy bài viết');
  if (post.authorId !== userId) throw new AppError(403, 'Bạn không phải tác giả của bài viết này');
  return prisma.post.delete({ where: { id } });
}
