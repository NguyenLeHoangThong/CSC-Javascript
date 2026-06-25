import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.transfer.deleteMany();
  await prisma.account.deleteMany();
  await prisma.account.createMany({
    data: [
      { owner: 'Alice', balance: 1000 },
      { owner: 'Bob', balance: 500 },
    ],
  });
  console.log('🌱 Seeded 2 accounts (Alice=1000, Bob=500)');
}

main().then(() => prisma.$disconnect());
