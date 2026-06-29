import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  const hash = await bcrypt.hash('Password123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pm.com' },
    update: { password: hash, role: 'admin' },
    create: { name: 'Admin', email: 'admin@pm.com', password: hash, role: 'admin' },
  });
  const manager = await prisma.user.upsert({
    where: { email: 'manager@pm.com' },
    update: { password: hash, role: 'manager' },
    create: { name: 'Manager', email: 'manager@pm.com', password: hash, role: 'manager' },
  });
  const user = await prisma.user.upsert({
    where: { email: 'user@pm.com' },
    update: { password: hash, role: 'user' },
    create: { name: 'User', email: 'user@pm.com', password: hash, role: 'user' },
  });

  const project = await prisma.project.create({
    data: { name: 'Website Redesign', description: 'Q3 project', ownerId: manager.id, status: 'active' },
  });
  await prisma.task.createMany({
    data: [
      { title: 'Design mockups', projectId: project.id, assigneeId: user.id, priority: 'high' },
      { title: 'Set up CI', projectId: project.id, assigneeId: manager.id, priority: 'medium' },
    ],
  });

  console.log('🌱 Seeded users (admin/manager/user @pm.com, pass Password123) + project + tasks');
  console.log(`   admin id=${admin.id}, manager id=${manager.id}, user id=${user.id}`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
