import prisma from '../src/db/prisma';
import bcrypt from 'bcrypt';

// Helper: tính điểm trung bình (40% giữa kỳ + 60% cuối kỳ)
function calcAverage(midterm: number, final: number) {
  return Math.round((midterm * 0.4 + final * 0.6) * 100) / 100;
}

function calcLetterGrade(avg: number) {
  if (avg >= 8.5) return 'A';
  if (avg >= 7.0) return 'B';
  if (avg >= 5.5) return 'C';
  if (avg >= 4.0) return 'D';
  return 'F';
}

async function main() {
  console.log('🌱 Bắt đầu seed...');

  // ── Users ──────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin@123456', 12);
  const userHash = await bcrypt.hash('User@123456', 12);

  await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@school.com',
      password: adminHash,
      role: 'admin',
    },
  });

  const users = await Promise.all(
    [1, 2, 3].map((i) =>
      prisma.user.upsert({
        where: { email: `user${i}@school.com` },
        update: {},
        create: {
          name: `User ${i}`,
          email: `user${i}@school.com`,
          password: userHash,
          role: 'user',
        },
      })
    )
  );

  console.log(`✅ Users: 1 admin + ${users.length} users`);

  // ── Reset dữ liệu nghiệp vụ (grades → students → classes) ──
  await prisma.grade.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();

  // ── Classes ────────────────────────────────────────────
  const classes = await Promise.all([
    prisma.class.create({
      data: {
        name: 'Node.js Buổi Tối',
        subject: 'programming',
        teacherName: 'Thầy An',
        maxStudents: 30,
        schedule: 'Thứ 3 & 5, 19:00-21:00',
      },
    }),
    prisma.class.create({
      data: {
        name: 'English Giao Tiếp',
        subject: 'english',
        teacherName: 'Cô Bình',
        maxStudents: 20,
        schedule: 'Thứ 2 & 4, 08:00-10:00',
      },
    }),
    prisma.class.create({
      data: {
        name: 'Toán Cao Cấp',
        subject: 'math',
        teacherName: 'Thầy Minh',
        maxStudents: 25,
        schedule: 'Thứ 6, 13:00-17:00',
      },
    }),
  ]);

  console.log(`✅ Classes: ${classes.length} lớp`);

  // ── Students ───────────────────────────────────────────
  const studentsData = [
    { fullName: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0901111111', gpa: 8.5, classIdx: 0 },
    { fullName: 'Trần Thị B', email: 'b@gmail.com', phone: '0902222222', gpa: 7.2, classIdx: 0 },
    { fullName: 'Lê Văn C', email: 'c@gmail.com', phone: '0903333333', gpa: 9.0, classIdx: 0 },
    { fullName: 'Phạm Thị D', email: 'd@gmail.com', phone: '0904444444', gpa: 6.5, classIdx: 1 },
    { fullName: 'Hoàng Văn E', email: 'e@gmail.com', phone: '0905555555', gpa: 5.8, classIdx: 1 },
    { fullName: 'Đặng Thị F', email: 'f@gmail.com', phone: '0906666666', gpa: 7.8, classIdx: 2 },
  ];

  const students = await Promise.all(
    studentsData.map((s) =>
      prisma.student.create({
        data: {
          fullName: s.fullName,
          email: s.email,
          phone: s.phone,
          gpa: s.gpa,
          classId: classes[s.classIdx].id,
        },
      })
    )
  );

  console.log(`✅ Students: ${students.length} học sinh`);

  // ── Grades ─────────────────────────────────────────────
  const gradesData = [
    { studentIdx: 0, subject: 'programming', midterm: 8.0, final: 9.0 },
    { studentIdx: 0, subject: 'english', midterm: 7.5, final: 8.0 },
    { studentIdx: 1, subject: 'programming', midterm: 7.0, final: 7.5 },
    { studentIdx: 2, subject: 'programming', midterm: 9.0, final: 9.5 },
    { studentIdx: 3, subject: 'english', midterm: 6.5, final: 7.0 },
    { studentIdx: 4, subject: 'english', midterm: 5.5, final: 6.0 },
    { studentIdx: 5, subject: 'math', midterm: 8.0, final: 7.5 },
  ];

  await Promise.all(
    gradesData.map((g) => {
      const average = calcAverage(g.midterm, g.final);
      const letterGrade = calcLetterGrade(average) as any;
      return prisma.grade.create({
        data: {
          studentId: students[g.studentIdx].id,
          subject: g.subject,
          midterm: g.midterm,
          final: g.final,
          average,
          letterGrade,
        },
      });
    })
  );

  console.log(`✅ Grades: ${gradesData.length} bản ghi`);
  console.log('🎉 Seed hoàn thành!');
  console.log('   Admin: admin@school.com / Admin@123456');
  console.log('   User:  user1@school.com / User@123456');
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
