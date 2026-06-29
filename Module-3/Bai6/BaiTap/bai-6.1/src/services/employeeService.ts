import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../types/api';
import { buildSkip } from '../utils/pagination';

export async function findAll(query: {
  departmentId?: number;
  status?: string;
  search?: string;
  sort: string;
  order: string;
  page: number;
  limit: number;
}) {
  const { departmentId, status, search, sort, order, page, limit } = query;

  const where: Prisma.EmployeeWhereInput = {
    ...(departmentId && { departmentId }),
    ...(status && { status: status as any }),
    ...(search && { fullName: { contains: search, mode: 'insensitive' } }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.employee.findMany({
      where,
      include: { department: { select: { name: true, code: true } } },
      orderBy: { [sort]: order },
      take: limit,
      skip: buildSkip(page, limit),
    }),
    prisma.employee.count({ where }),
  ]);

  return { data, total };
}

export async function findById(id: number) {
  const employee = await prisma.employee.findUnique({ where: { id }, include: { department: true } });
  if (!employee) throw new AppError(404, 'Không tìm thấy nhân viên');
  return employee;
}

export async function create(data: any) {
  return prisma.employee.create({ data });
}

export async function update(id: number, data: any) {
  await findById(id);
  return prisma.employee.update({ where: { id }, data });
}

export async function remove(id: number) {
  await findById(id);
  return prisma.employee.delete({ where: { id } });
}

// Aggregate statistics — count + aggregate + groupBy.
export async function getStats() {
  const [totalActive, salaryStats, byDept] = await prisma.$transaction([
    prisma.employee.count({ where: { status: 'active' } }),
    prisma.employee.aggregate({
      _avg: { salary: true },
      _max: { salary: true },
      _min: { salary: true },
      where: { status: 'active' },
    }),
    prisma.employee.groupBy({
      by: ['departmentId'],
      _count: true,
      _avg: { salary: true },
      where: { status: 'active' },
      orderBy: { departmentId: 'asc' },
    }),
  ]);

  return {
    totalActive,
    salary: {
      average: salaryStats._avg.salary ? Number(salaryStats._avg.salary) : 0,
      highest: salaryStats._max.salary ? Number(salaryStats._max.salary) : 0,
      lowest: salaryStats._min.salary ? Number(salaryStats._min.salary) : 0,
    },
    byDepartment: byDept.map((d) => ({
      departmentId: d.departmentId,
      count: d._count,
      avgSalary: d._avg?.salary ? Number(d._avg.salary) : 0,
    })),
  };
}
