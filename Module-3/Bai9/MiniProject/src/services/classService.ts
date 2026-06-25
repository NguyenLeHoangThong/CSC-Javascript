import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../types/api';
import { buildSkip } from '../utils/pagination';

export async function findAll(query: {
  subject?: string;
  hasSlot?: boolean;
  sort?: string;
  order?: string;
  page: number;
  limit: number;
}) {
  const { subject, hasSlot, sort = 'name', order = 'asc', page, limit } = query;

  const classes = await prisma.class.findMany({
    where: {
      ...(subject && { subject: { contains: subject, mode: 'insensitive' } }),
    },
    include: {
      _count: { select: { students: true } },
    },
    orderBy: { [sort]: order },
    take: limit,
    skip: buildSkip(page, limit),
  });

  const filtered = hasSlot
    ? classes.filter((c) => c._count.students < c.maxStudents)
    : classes;

  const total = await prisma.class.count({
    where: {
      ...(subject && { subject: { contains: subject, mode: 'insensitive' } }),
    },
  });

  return { data: filtered, total };
}

export async function findById(id: number) {
  const classData = await prisma.class.findUnique({
    where: { id },
    include: {
      _count: { select: { students: true } },
      students: {
        where: { status: 'active' },
        orderBy: { gpa: 'desc' },
      },
    },
  });

  if (!classData) throw new AppError(404, 'Lớp không tồn tại');
  return classData;
}

export async function create(data: Prisma.ClassCreateInput) {
  return prisma.class.create({
    data,
    include: { _count: { select: { students: true } } },
  });
}

export async function update(id: number, data: Prisma.ClassUpdateInput) {
  return prisma.class.update({
    where: { id },
    data,
    include: { _count: { select: { students: true } } },
  });
}

export async function remove(id: number) {
  return prisma.class.delete({ where: { id } });
}

export async function transferStudent(studentId: number, newClassId: number) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({
      where: { id: studentId },
    });
    if (!student) throw new AppError(404, 'Không tìm thấy học sinh');

    const newClass = await tx.class.findUnique({
      where: { id: newClassId },
      include: { _count: { select: { students: true } } },
    });
    if (!newClass) throw new AppError(404, 'Lớp không tồn tại');
    if (newClass._count.students >= newClass.maxStudents) {
      throw new AppError(409, `Lớp ${newClass.name} đã đủ học sinh`);
    }

    return tx.student.update({
      where: { id: studentId },
      data: { classId: newClassId },
    });
  });
}
