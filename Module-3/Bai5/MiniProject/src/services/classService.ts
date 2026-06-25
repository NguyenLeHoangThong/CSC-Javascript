import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';

export const getAllClasses = () =>
  prisma.class.findMany({
    include: { _count: { select: { students: true } } },
    orderBy: { createdAt: 'desc' },
  });

export const getClassById = (id: number) =>
  prisma.class.findUnique({
    where: { id },
    include: {
      _count: { select: { students: true } },
      students: {
        where: { status: 'active' },
        select: {
          id: true,
          fullName: true,
          email: true,
          gpa: true,
          status: true,
        },
      },
    },
  });

export const createClass = (data: Prisma.ClassCreateInput) =>
  prisma.class.create({
    data,
    include: { _count: { select: { students: true } } },
  });

export const updateClass = (id: number, data: Prisma.ClassUpdateInput) =>
  prisma.class.update({
    where: { id },
    data,
    include: { _count: { select: { students: true } } },
  });

export const deleteClass = (id: number) =>
  prisma.class.delete({
    where: { id },
  });
