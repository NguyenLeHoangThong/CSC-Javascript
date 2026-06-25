import prisma from '../src/db/prisma';

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.grade.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();

  // Create classes
  const classes = await Promise.all([
    prisma.class.create({
      data: {
        name: '10A1',
        subject: 'Mathematics',
        teacherName: 'Nguyễn Văn A',
        maxStudents: 40,
        schedule: 'Monday 08:00-09:30',
      },
    }),
    prisma.class.create({
      data: {
        name: '10A2',
        subject: 'English',
        teacherName: 'Trần Thị B',
        maxStudents: 40,
        schedule: 'Tuesday 10:00-11:30',
      },
    }),
    prisma.class.create({
      data: {
        name: '10B1',
        subject: 'Physics',
        teacherName: 'Phạm Đức C',
        maxStudents: 35,
        schedule: 'Wednesday 14:00-15:30',
      },
    }),
  ]);

  // Create students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        fullName: 'Nguyễn Văn A',
        email: 'van.a@school.edu',
        phone: '0912345678',
        classId: classes[0].id,
        gpa: 8.5,
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Trần Thị B',
        email: 'thi.b@school.edu',
        phone: '0923456789',
        classId: classes[0].id,
        gpa: 9.0,
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Phạm Đức C',
        email: 'duc.c@school.edu',
        phone: '0934567890',
        classId: classes[1].id,
        gpa: 7.8,
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Hoàng Minh D',
        email: 'minh.d@school.edu',
        phone: '0945678901',
        classId: classes[1].id,
        gpa: 6.5,
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Vũ Ngọc E',
        email: 'ngoc.e@school.edu',
        phone: '0956789012',
        classId: classes[2].id,
        gpa: 8.2,
        status: 'active',
      },
    }),
    prisma.student.create({
      data: {
        fullName: 'Lê Quang F',
        email: 'quang.f@school.edu',
        phone: '0967890123',
        classId: classes[2].id,
        gpa: 7.0,
        status: 'inactive',
      },
    }),
  ]);

  // Create grades
  await Promise.all([
    // Student 1 grades
    prisma.grade.create({
      data: {
        studentId: students[0].id,
        subject: 'Mathematics',
        midterm: 8.5,
        final: 8.8,
        average: 8.68,
        letterGrade: 'A',
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[0].id,
        subject: 'English',
        midterm: 7.5,
        final: 8.0,
        average: 7.8,
        letterGrade: 'B',
      },
    }),
    // Student 2 grades
    prisma.grade.create({
      data: {
        studentId: students[1].id,
        subject: 'Mathematics',
        midterm: 9.0,
        final: 9.2,
        average: 9.12,
        letterGrade: 'A',
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[1].id,
        subject: 'Physics',
        midterm: 8.5,
        final: 9.0,
        average: 8.8,
        letterGrade: 'A',
      },
    }),
    // Student 3 grades
    prisma.grade.create({
      data: {
        studentId: students[2].id,
        subject: 'English',
        midterm: 7.5,
        final: 8.0,
        average: 7.8,
        letterGrade: 'B',
      },
    }),
    // Student 4 grades
    prisma.grade.create({
      data: {
        studentId: students[3].id,
        subject: 'Mathematics',
        midterm: 6.0,
        final: 6.5,
        average: 6.3,
        letterGrade: 'C',
      },
    }),
    // Student 5 grades
    prisma.grade.create({
      data: {
        studentId: students[4].id,
        subject: 'Physics',
        midterm: 8.0,
        final: 8.5,
        average: 8.3,
        letterGrade: 'A',
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
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
