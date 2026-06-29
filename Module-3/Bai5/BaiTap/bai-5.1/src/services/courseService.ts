import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../types/api';
import { buildSkip } from '../utils/pagination';

export async function findAll(query: {
  categoryId?: number;
  status?: string;
  search?: string;
  page: number;
  limit: number;
}) {
  const { categoryId, status, search, page, limit } = query;

  const where: Prisma.CourseWhereInput = {
    ...(categoryId && { categoryId }),
    ...(status && { status: status as any }),
    ...(search && { title: { contains: search, mode: 'insensitive' } }),
  };

  // Run the data + count queries together
  const [data, total] = await prisma.$transaction([
    prisma.course.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: buildSkip(page, limit),
    }),
    prisma.course.count({ where }),
  ]);

  return { data, total };
}

export async function findById(id: number) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { enrollments: true } },
    },
  });
  if (!course) throw new AppError(404, 'Không tìm thấy khoá học');
  return course;
}

export async function create(data: any) {
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new AppError(404, 'Category không tồn tại');
  return prisma.course.create({ data });
}

export async function update(id: number, data: any) {
  await findById(id); // 404 if missing
  return prisma.course.update({ where: { id }, data });
}

export async function remove(id: number) {
  // Block deletion when the course still has enrollments
  const count = await prisma.enrollment.count({ where: { courseId: id } });
  if (count > 0) throw new AppError(409, `Không thể xóa — khoá học đang có ${count} học viên`);
  return prisma.course.delete({ where: { id } });
}

export async function enroll(courseId: number, data: { studentName: string; studentEmail: string }) {
  await findById(courseId); // 404 if course missing
  // Unique [studentEmail, courseId] → P2002 if duplicate → errorHandler returns 409
  return prisma.enrollment.create({ data: { courseId, ...data } });
}
