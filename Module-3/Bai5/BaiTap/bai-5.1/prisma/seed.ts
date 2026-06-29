import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();

  const web = await prisma.category.create({ data: { name: 'Web Development', slug: 'web' } });
  const mobile = await prisma.category.create({ data: { name: 'Mobile', slug: 'mobile' } });

  const node = await prisma.course.create({
    data: { title: 'Node.js Backend', description: 'REST API với Node', price: 1990000, duration: 1200, categoryId: web.id, status: 'published' },
  });
  await prisma.course.create({
    data: { title: 'React Cơ bản', description: 'SPA với React', price: 1490000, duration: 900, categoryId: web.id, status: 'published' },
  });
  await prisma.course.create({
    data: { title: 'Flutter', description: 'App đa nền tảng', price: 2490000, duration: 1500, categoryId: mobile.id, status: 'draft' },
  });

  await prisma.enrollment.createMany({
    data: [
      { courseId: node.id, studentName: 'An', studentEmail: 'an@gmail.com' },
      { courseId: node.id, studentName: 'Binh', studentEmail: 'binh@gmail.com' },
    ],
  });

  console.log('🌱 Seeded categories, courses, enrollments');
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
