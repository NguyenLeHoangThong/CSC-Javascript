import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();

  const hash = await bcrypt.hash('Password123', 12);
  const alice = await prisma.user.upsert({
    where: { email: 'alice@blog.com' },
    update: { password: hash },
    create: { name: 'Alice', email: 'alice@blog.com', password: hash },
  });
  const bob = await prisma.user.upsert({
    where: { email: 'bob@blog.com' },
    update: { password: hash },
    create: { name: 'Bob', email: 'bob@blog.com', password: hash },
  });

  await prisma.post.createMany({
    data: [
      { title: 'Hello from Alice', content: 'First post', published: true, authorId: alice.id },
      { title: 'Draft by Alice', content: 'Not published yet', published: false, authorId: alice.id },
      { title: 'Bob writes too', content: 'Bob post', published: true, authorId: bob.id },
    ],
  });

  console.log('🌱 Seeded users (alice@blog.com / bob@blog.com, pass Password123) + posts');
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
