import prisma from '../db/prisma';
import { Prisma, Role } from '@prisma/client';
import { AppError } from '../types/api';
import { buildSkip } from '../utils/pagination';
import { USER_SELECT } from '../constants/userSelect';

// Bài 36 — admin user management.
//
// Module 3 shipped an admin UI (AdminUsersPage) with no backend behind it. Adding the
// routes here is also the natural place to demonstrate the two security rules the
// lesson is about: never select credential columns, and never let an admin lock
// themselves out.

export interface UserQuery {
  search?: string;
  role?: Role;
  page: number;
  limit: number;
}

export async function findAll(query: UserQuery) {
  const { search, role, page, limit } = query;

  const where: Prisma.UserWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(role && { role }),
  };

  const [users, total] = await prisma.$transaction([
    // USER_SELECT — password and refreshToken can never end up in this response.
    prisma.user.findMany({
      where,
      select: USER_SELECT,
      orderBy: { createdAt: 'desc' },
      skip: buildSkip(page, limit),
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { data: users, total };
}

export async function findById(id: number) {
  const user = await prisma.user.findUnique({ where: { id }, select: USER_SELECT });
  if (!user) throw new AppError(404, 'User not found');
  return user;
}

export async function updateRole(id: number, role: Role, actingUserId: number) {
  // Self-demotion would leave the shop with zero admins if this is the last one.
  // The frontend disables the button; the backend still has to enforce it.
  if (id === actingUserId) {
    throw new AppError(400, 'You cannot change your own role');
  }
  await findById(id); // 404 before we attempt the write

  return prisma.user.update({ where: { id }, data: { role }, select: USER_SELECT });
}

export async function remove(id: number, actingUserId: number) {
  if (id === actingUserId) {
    throw new AppError(400, 'You cannot delete your own account');
  }
  await findById(id);

  // Order.userId is `onDelete: SetNull`, so past orders survive as guest orders
  // instead of being wiped along with the account.
  return prisma.user.delete({ where: { id } });
}
