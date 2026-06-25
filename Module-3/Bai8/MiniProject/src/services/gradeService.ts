import prisma from '../db/prisma';
import { LetterGrade } from '@prisma/client';
import { AppError } from '../types/api';
import Decimal from 'decimal.js';

function calcAverage(midterm: number | Decimal, final: number | Decimal): Decimal {
  const mid = new Decimal(midterm);
  const fin = new Decimal(final);
  return mid.times(0.4).plus(fin.times(0.6)).toDecimalPlaces(2);
}

function calcLetterGrade(avg: number | Decimal): LetterGrade {
  const average = new Decimal(avg).toNumber();
  if (average >= 8.5) return LetterGrade.A;
  if (average >= 7.0) return LetterGrade.B;
  if (average >= 5.5) return LetterGrade.C;
  if (average >= 4.0) return LetterGrade.D;
  return LetterGrade.F;
}

export async function addGrade(
  studentId: number,
  input: { subject: string; midterm: number; final: number }
) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });
  if (!student) throw new AppError(404, 'Không tìm thấy học sinh');

  const average = calcAverage(input.midterm, input.final);
  const letterGrade = calcLetterGrade(average);

  return prisma.grade.create({
    data: {
      studentId,
      subject: input.subject,
      midterm: new Decimal(input.midterm),
      final: new Decimal(input.final),
      average,
      letterGrade,
    },
  });
}

export async function updateGrade(
  gradeId: number,
  input: { midterm?: number; final?: number }
) {
  const grade = await prisma.grade.findUnique({
    where: { id: gradeId },
  });
  if (!grade) throw new AppError(404, 'Không tìm thấy bản ghi điểm');

  const midterm = input.midterm ?? Number(grade.midterm);
  const final = input.final ?? Number(grade.final);
  const average = calcAverage(midterm, final);
  const letterGrade = calcLetterGrade(average);

  return prisma.grade.update({
    where: { id: gradeId },
    data: {
      midterm: new Decimal(midterm),
      final: new Decimal(final),
      average,
      letterGrade,
    },
  });
}

export async function getByStudent(studentId: number) {
  return prisma.grade.findMany({
    where: { studentId },
    orderBy: { recordedAt: 'desc' },
  });
}

export async function deleteGrade(gradeId: number) {
  return prisma.grade.delete({
    where: { id: gradeId },
  });
}
