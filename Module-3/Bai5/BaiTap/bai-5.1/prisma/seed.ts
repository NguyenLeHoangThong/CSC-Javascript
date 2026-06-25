import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.task.createMany({
    data: [
      { title: 'Learn Prisma', description: 'Read the docs', status: 'doing', priority: 3 },
      { title: 'Write CRUD API', status: 'todo', priority: 5 },
      { title: 'Setup PostgreSQL', status: 'done', priority: 2 },
    ],
  });
  console.log('🌱 Seeded tasks');
}

main().then(() => prisma.$disconnect());
