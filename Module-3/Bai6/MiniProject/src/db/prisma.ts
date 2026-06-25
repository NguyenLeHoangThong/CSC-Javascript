import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['info', 'warn', 'error'] : ['error'],
});

export default prisma;
