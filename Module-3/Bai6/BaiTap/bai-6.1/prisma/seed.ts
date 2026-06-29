import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();

  const eng = await prisma.department.create({ data: { name: 'Engineering', code: 'ENG' } });
  const sales = await prisma.department.create({ data: { name: 'Sales', code: 'SAL' } });
  const mkt = await prisma.department.create({ data: { name: 'Marketing', code: 'MKT' } });

  const rows = [
    { fullName: 'Alice', email: 'alice@co.com', position: 'Senior Dev', salary: 2500, departmentId: eng.id, startDate: new Date('2022-01-10') },
    { fullName: 'Bob', email: 'bob@co.com', position: 'Dev', salary: 1800, departmentId: eng.id, startDate: new Date('2023-03-15') },
    { fullName: 'Carol', email: 'carol@co.com', position: 'Lead', salary: 3200, departmentId: eng.id, startDate: new Date('2021-06-01') },
    { fullName: 'Dave', email: 'dave@co.com', position: 'Sales Rep', salary: 1500, departmentId: sales.id, startDate: new Date('2023-07-20') },
    { fullName: 'Erin', email: 'erin@co.com', position: 'Sales Lead', salary: 2100, departmentId: sales.id, startDate: new Date('2022-11-05') },
    { fullName: 'Frank', email: 'frank@co.com', position: 'Marketer', salary: 1700, departmentId: mkt.id, startDate: new Date('2024-02-12'), status: 'inactive' as const },
    { fullName: 'Grace', email: 'grace@co.com', position: 'Marketer', salary: 1700, departmentId: mkt.id, startDate: new Date('2023-09-30') },
  ];

  for (const r of rows) await prisma.employee.create({ data: r });

  console.log('🌱 Seeded 3 departments + 7 employees');
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
