import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';

interface StudentFilterParams {
  classId?: number;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getAllStudents = async (params: StudentFilterParams) => {
  const {
    classId,
    status,
    search,
    page = 1,
    limit = 10,
  } = params;

  const where: Prisma.StudentWhereInput = {};

  if (classId) where.classId = classId;
  if (status) where.status = status as any;
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: {
        class: { select: { name: true } },
        grades: { select: { id: true } },
      },
      skip,
      take: limit,
      orderBy: { enrolledAt: 'desc' },
    }),
    prisma.student.count({ where }),
  ]);

  return {
    data: students,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getStudentById = (id: number) =>
  prisma.student.findUnique({
    where: { id },
    include: {
      class: true,
      grades: { orderBy: { recordedAt: 'desc' } },
    },
  });

export const createStudent = (data: Prisma.StudentCreateInput) =>
  prisma.student.create({
    data,
    include: { class: true },
  });

export const updateStudent = (id: number, data: Prisma.StudentUpdateInput) =>
  prisma.student.update({
    where: { id },
    data,
    include: { class: true },
  });

export const deleteStudent = (id: number) =>
  prisma.student.delete({
    where: { id },
  });

export const getStudentStatus = (id: number) =>
  prisma.student.findUnique({
    where: { id },
    select: { status: true },
  });
