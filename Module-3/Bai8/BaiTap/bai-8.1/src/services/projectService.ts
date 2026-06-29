import prisma from '../db/prisma';
import { AppError } from '../types/api';

export async function findAll() {
  return prisma.project.findMany({
    include: { owner: { select: { id: true, name: true } }, _count: { select: { tasks: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id: number) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { owner: { select: { id: true, name: true } }, tasks: true },
  });
  if (!project) throw new AppError(404, 'Không tìm thấy dự án');
  return project;
}

export async function create(ownerId: number, data: any) {
  return prisma.project.create({ data: { ...data, ownerId } });
}

export async function update(id: number, data: any) {
  await findById(id);
  return prisma.project.update({ where: { id }, data });
}

export async function remove(id: number) {
  await findById(id);
  return prisma.project.delete({ where: { id } });
}

// Helper for authorizeOwner middleware (project.ownerId)
export async function getOwnerId(id: number): Promise<number | null> {
  const p = await prisma.project.findUnique({ where: { id }, select: { ownerId: true } });
  return p?.ownerId ?? null;
}

// Tasks within a project
export async function listTasks(projectId: number) {
  await findById(projectId);
  return prisma.task.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } });
}

export async function createTask(projectId: number, data: any) {
  await findById(projectId);
  return prisma.task.create({ data: { ...data, projectId } });
}
