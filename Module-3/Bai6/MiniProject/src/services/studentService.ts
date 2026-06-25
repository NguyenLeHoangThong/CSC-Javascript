import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../types/api';
import { buildSkip } from '../utils/pagination';

export async function findAll(query: {
  classId?: number;
  status?: string;
  search?: string;
  sort?: string;
  order?: string;
  page: number;
  limit: number;
}) {
  const { classId, status, search, sort = 'enrolledAt', order = 'desc', page, limit } = query;

  const where: Prisma.StudentWhereInput = {};

  if (classId) where.classId = classId;
  if (status) where.status = status as any;
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: {
        class: { select: { name: true } },
        grades: { select: { id: true } },
      },
      orderBy: { [sort]: order },
      take: limit,
      skip: buildSkip(page, limit),
    }),
    prisma.student.count({ where }),
  ]);

  return { data: students, total };
}

export async function findById(id: number) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      class: true,
      grades: { orderBy: { recordedAt: 'desc' } },
    },
  });

  if (!student) throw new AppError(404, 'Không tìm thấy học sinh');
  return student;
}

export async function create(data: {
  fullName: string;
  email: string;
  phone?: string;
  classId?: number;
  gpa?: number;
  status?: string;
}) {
  return prisma.$transaction(async (tx) => {
    if (data.classId) {
      const classData = await tx.class.findUnique({
        where: { id: data.classId },
        include: { _count: { select: { students: true } } },
      });

      if (!classData) throw new AppError(404, 'Lớp không tồn tại');
      if (classData._count.students >= classData.maxStudents) {
        throw new AppError(409, `Lớp ${classData.name} đã đủ học sinh`);
      }
    }

    return tx.student.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        classId: data.classId,
        gpa: data.gpa ? parseFloat(String(data.gpa)) : 0,
        status: (data.status as any) || 'active',
      },
      include: { class: true },
    });
  });
}

export async function update(
  id: number,
  data: {
    fullName?: string;
    email?: string;
    phone?: string;
    classId?: number;
    gpa?: number;
    status?: string;
  }
) {
  return prisma.$transaction(async (tx) => {
    if (data.classId !== undefined && data.classId !== null) {
      const classData = await tx.class.findUnique({
        where: { id: data.classId },
        include: { _count: { select: { students: true } } },
      });

      if (!classData) throw new AppError(404, 'Lớp không tồn tại');

      const currentStudent = await tx.student.findUnique({ where: { id } });
      if (currentStudent?.classId !== data.classId) {
        if (classData._count.students >= classData.maxStudents) {
          throw new AppError(409, `Lớp ${classData.name} đã đủ học sinh`);
        }
      }
    }

    return tx.student.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        classId: data.classId,
        gpa: data.gpa !== undefined ? parseFloat(String(data.gpa)) : undefined,
        status: data.status as any,
      },
      include: { class: true },
    });
  });
}

export async function remove(id: number) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({ where: { id } });
    if (!student) throw new AppError(404, 'Không tìm thấy học sinh');

    if (student.status === 'active') {
      throw new AppError(409, 'Không thể xóa học sinh đang hoạt động');
    }

    await tx.grade.deleteMany({ where: { studentId: id } });
    return tx.student.delete({ where: { id } });
  });
}
