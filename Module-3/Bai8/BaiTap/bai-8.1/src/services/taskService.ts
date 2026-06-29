import prisma from '../db/prisma';
import { AppError } from '../types/api';

export async function findById(id: number) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new AppError(404, 'Không tìm thấy task');
  return task;
}

export async function update(id: number, data: any) {
  await findById(id);
  return prisma.task.update({ where: { id }, data });
}

export async function remove(id: number) {
  await findById(id);
  return prisma.task.delete({ where: { id } });
}

// Helper for authorizeOwner middleware (task.assigneeId)
export async function getAssigneeId(id: number): Promise<number | null> {
  const t = await prisma.task.findUnique({ where: { id }, select: { assigneeId: true } });
  return t?.assigneeId ?? null;
}
