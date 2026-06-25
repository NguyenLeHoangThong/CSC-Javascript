import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  const data = Array.from({ length: 25 }, (_, i) => ({
    title: `Post number ${i + 1}`,
    content: `This is the body of post ${i + 1}. Keyword: ${i % 2 === 0 ? 'prisma' : 'express'}.`,
    published: i % 3 !== 0, // ~2/3 published
    views: Math.floor(Math.random() * 1000),
  }));
  await prisma.post.createMany({ data });
  console.log('🌱 Seeded 25 posts');
}

main().then(() => prisma.$disconnect());
