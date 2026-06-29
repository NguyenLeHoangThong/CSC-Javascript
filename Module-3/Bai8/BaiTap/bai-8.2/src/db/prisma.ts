import { PrismaClient } from '@prisma/client';

// One shared client for the whole app (avoid exhausting the DB connection pool).
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export default prisma;
