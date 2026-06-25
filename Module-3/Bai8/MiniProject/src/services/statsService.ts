import prisma from '../db/prisma';

export async function getStats() {
  const [totalStudents, totalClasses, avgGPA] = await Promise.all([
    prisma.student.count(),
    prisma.class.count(),
    prisma.student.aggregate({
      _avg: { gpa: true },
    }),
  ]);

  const gradeDistribution = await prisma.grade.groupBy({
    by: ['letterGrade'],
    _count: true,
    orderBy: {
      letterGrade: 'asc',
    },
  });

  const statusDistribution = await prisma.student.groupBy({
    by: ['status'],
    _count: true,
    orderBy: {
      status: 'asc',
    },
  });

  const classStats = await prisma.class.findMany({
    include: {
      _count: { select: { students: true } },
      students: {
        select: { gpa: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return {
    summary: {
      totalStudents,
      totalClasses,
      averageGPA: avgGPA._avg.gpa
        ? parseFloat(String(avgGPA._avg.gpa)).toFixed(2)
        : 0,
    },
    gradeDistribution: gradeDistribution.map((g) => ({
      grade: g.letterGrade,
      count: g._count,
    })),
    statusDistribution: statusDistribution.map((s) => ({
      status: s.status,
      count: s._count,
    })),
    classStats: classStats.map((c) => ({
      id: c.id,
      name: c.name,
      subject: c.subject,
      studentCount: c._count.students,
      maxStudents: c.maxStudents,
      averageGPA:
        c.students.length > 0
          ? (
              c.students.reduce((sum, s) => sum + parseFloat(String(s.gpa)), 0) /
              c.students.length
            ).toFixed(2)
          : 0,
    })),
  };
}
