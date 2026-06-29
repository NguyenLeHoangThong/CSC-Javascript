import prisma from '../db/prisma';
import { AppError } from '../types/api';

export async function findAll() {
  return prisma.department.findMany({
    include: { _count: { select: { employees: true } } },
    orderBy: { name: 'asc' },
  });
}

export async function create(data: { name: string; code: string }) {
  return prisma.department.create({ data });
}

// Transactional delete: refuse if the department still has employees.
export async function remove(id: number) {
  return prisma.$transaction(async (tx) => {
    const count = await tx.employee.count({ where: { departmentId: id } });
    if (count > 0) throw new AppError(409, `Không thể xóa — phòng ban còn ${count} nhân viên`);
    return tx.department.delete({ where: { id } });
  });
}
