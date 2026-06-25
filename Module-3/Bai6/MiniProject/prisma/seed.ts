import prisma from '../src/db/prisma';
import Decimal from 'decimal.js';

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.grade.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();

  // Create 3 classes
  const classes = await Promise.all([
    prisma.class.create({
      data: {
        name: '10A1',
        subject: 'Mathematics',
        teacherName: 'Nguyễn Văn A',
        maxStudents: 30,
        schedule: 'Monday 08:00-09:30',
      },
    }),
    prisma.class.create({
      data: {
        name: '10A2',
        subject: 'English',
        teacherName: 'Trần Thị B',
        maxStudents: 28,
        schedule: 'Tuesday 10:00-11:30',
      },
    }),
    prisma.class.create({
      data: {
        name: '10B1',
        subject: 'Physics',
        teacherName: 'Phạm Đức C',
        maxStudents: 25,
        schedule: 'Wednesday 14:00-15:30',
      },
    }),
  ]);

  // Create 15 students (5 per class)
  const students = await Promise.all([
    // Class 1 (10A1)
    prisma.student.create({
      data: {
        fullName: 'Nguyễn Văn A',
        email: 'van.a@school.edu',
        phone: '0912345678',
        classId: classes[0].id,
        gpa: new Decimal('8.5'),
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Trần Thị B',
        email: 'thi.b@school.edu',
        phone: '0923456789',
        classId: classes[0].id,
        gpa: new Decimal('9.0'),
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Phạm Đức C',
        email: 'duc.c@school.edu',
        phone: '0934567890',
        classId: classes[0].id,
        gpa: new Decimal('7.8'),
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Hoàng Minh D',
        email: 'minh.d@school.edu',
        phone: '0945678901',
        classId: classes[0].id,
        gpa: new Decimal('6.5'),
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Vũ Ngọc E',
        email: 'ngoc.e@school.edu',
        phone: '0956789012',
        classId: classes[0].id,
        gpa: new Decimal('8.2'),
        status: 'inactive',
      },
    }),
    // Class 2 (10A2)
    prisma.student.create({
      data: {
        fullName: 'Lê Quang F',
        email: 'quang.f@school.edu',
        phone: '0967890123',
        classId: classes[1].id,
        gpa: new Decimal('7.0'),
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Đặng Hương G',
        email: 'huong.g@school.edu',
        phone: '0978901234',
        classId: classes[1].id,
        gpa: new Decimal('8.8'),
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Bùi Thanh H',
        email: 'thanh.h@school.edu',
        phone: '0989012345',
        classId: classes[1].id,
        gpa: new Decimal('5.5'),
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Cao Văn I',
        email: 'van.i@school.edu',
        phone: '0990123456',
        classId: classes[1].id,
        gpa: new Decimal('9.2'),
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Nông Xuân K',
        email: 'xuan.k@school.edu',
        phone: '0901234567',
        classId: classes[1].id,
        gpa: new Decimal('8.0'),
        status: 'graduated',
      },
    }),
    // Class 3 (10B1)
    prisma.student.create({
      data: {
        fullName: 'Đinh Hữu L',
        email: 'huu.l@school.edu',
        phone: '0912111111',
        classId: classes[2].id,
        gpa: new Decimal('7.5'),
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Trương Anh M',
        email: 'anh.m@school.edu',
        phone: '0923222222',
        classId: classes[2].id,
        gpa: new Decimal('8.3'),
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Võ Thu N',
        email: 'thu.n@school.edu',
        phone: '0934333333',
        classId: classes[2].id,
        gpa: new Decimal('6.8'),
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Hà Anh P',
        email: 'anh.p@school.edu',
        phone: '0945444444',
        classId: classes[2].id,
        gpa: new Decimal('9.1'),
        status: 'inactive',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Tạ Văn Q',
        email: 'van.q@school.edu',
        phone: '0956555555',
        classId: classes[2].id,
        gpa: new Decimal('7.2'),
        status: 'active',
      },
    }),
  ]);

  // Create 20 grades
  await Promise.all([
    // Student 1 (3 grades)
    prisma.grade.create({
      data: {
        studentId: students[0].id,
        subject: 'Mathematics',
        midterm: new Decimal('8.5'),
        final: new Decimal('8.8'),
        average: new Decimal('8.68'),
        letterGrade: 'A',
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[0].id,
        subject: 'English',
        midterm: new Decimal('7.5'),
        final: new Decimal('8.0'),
        average: new Decimal('7.8'),
        letterGrade: 'B',
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[0].id,
        subject: 'Physics',
        midterm: new Decimal('8.0'),
        final: new Decimal('8.5'),
        average: new Decimal('8.3'),
        letterGrade: 'A',
      },
    }),
    // Student 2 (3 grades)
    prisma.grade.create({
      data: {
        studentId: students[1].id,
        subject: 'Mathematics',
        midterm: new Decimal('9.0'),
        final: new Decimal('9.2'),
        average: new Decimal('9.12'),
        letterGrade: 'A',
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[1].id,
        subject: 'English',
        midterm: new Decimal('8.5'),
        final: new Decimal('9.0'),
        average: new Decimal('8.8'),
        letterGrade: 'A',
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[1].id,
        subject: 'Physics',
        midterm: new Decimal('9.0'),
        final: new Decimal('9.5'),
        average: new Decimal('9.3'),
        letterGrade: 'A',
      },
    }),
    // Student 3 (2 grades)
    prisma.grade.create({
      data: {
        studentId: students[2].id,
        subject: 'Mathematics',
        midterm: new Decimal('7.5'),
        final: new Decimal('8.0'),
        average: new Decimal('7.8'),
        letterGrade: 'B',
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[2].id,
        subject: 'English',
        midterm: new Decimal('7.0'),
        final: new Decimal('7.5'),
        average: new Decimal('7.3'),
        letterGrade: 'B',
      },
    }),
    // Student 4 (2 grades)
    prisma.grade.create({
      data: {
        studentId: students[3].id,
        subject: 'Mathematics',
        midterm: new Decimal('6.0'),
        final: new Decimal('6.5'),
        average: new Decimal('6.3'),
        letterGrade: 'C',
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[3].id,
        subject: 'English',
        midterm: new Decimal('5.5'),
        final: new Decimal('6.0'),
        average: new Decimal('5.8'),
        letterGrade: 'C',
      },
    }),
    // Student 6 (2 grades)
    prisma.grade.create({
      data: {
        studentId: students[5].id,
        subject: 'Mathematics',
        midterm: new Decimal('6.5'),
        final: new Decimal('7.0'),
        average: new Decimal('6.8'),
        letterGrade: 'C',
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[5].id,
        subject: 'English',
        midterm: new Decimal('6.5'),
        final: new Decimal('7.0'),
        average: new Decimal('6.8'),
        letterGrade: 'C',
      },
    }),
    // Student 7 (2 grades)
    prisma.grade.create({
      data: {
        studentId: students[6].id,
        subject: 'Mathematics',
        midterm: new Decimal('9.0'),
        final: new Decimal('8.8'),
        average: new Decimal('8.88'),
        letterGrade: 'A',
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[6].id,
        subject: 'English',
        midterm: new Decimal('8.5'),
        final: new Decimal('9.0'),
        average: new Decimal('8.8'),
        letterGrade: 'A',
      },
    }),
    // Student 8 (1 grade)
    prisma.grade.create({
      data: {
        studentId: students[7].id,
        subject: 'Physics',
        midterm: new Decimal('5.0'),
        final: new Decimal('5.5'),
        average: new Decimal('5.3'),
        letterGrade: 'C',
      },
    }),
    // Student 9 (2 grades)
    prisma.grade.create({
      data: {
        studentId: students[8].id,
        subject: 'Mathematics',
        midterm: new Decimal('9.5'),
        final: new Decimal('9.0'),
        average: new Decimal('9.2'),
        letterGrade: 'A',
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[8].id,
        subject: 'English',
        midterm: new Decimal('9.0'),
        final: new Decimal('9.5'),
        average: new Decimal('9.3'),
        letterGrade: 'A',
      },
    }),
    // Student 11 (1 grade)
    prisma.grade.create({
      data: {
        studentId: students[10].id,
        subject: 'Physics',
        midterm: new Decimal('7.5'),
        final: new Decimal('7.5'),
        average: new Decimal('7.5'),
        letterGrade: 'B',
      },
    }),
    // Student 12 (1 grade)
    prisma.grade.create({
      data: {
        studentId: students[11].id,
        subject: 'Physics',
        midterm: new Decimal('8.0'),
        final: new Decimal('8.5'),
        average: new Decimal('8.3'),
        letterGrade: 'A',
      },
    }),
    // Student 13 (1 grade)
    prisma.grade.create({
      data: {
        studentId: students[12].id,
        subject: 'Mathematics',
        midterm: new Decimal('6.5'),
        final: new Decimal('7.0'),
        average: new Decimal('6.8'),
        letterGrade: 'C',
      },
    }),
  ]);

  console.log('✅ Database seeded with 3 classes, 15 students, and 20 grades!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
