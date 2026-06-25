import { PrismaClient } from '@prisma/client';

// Single shared PrismaClient instance for the whole app.
// Creating a new client per-request would exhaust the DB connection pool.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export default prisma;
