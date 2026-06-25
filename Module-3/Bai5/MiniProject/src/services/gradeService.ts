import prisma from '../db/prisma';
import { LetterGrade, Prisma } from '@prisma/client';
import Decimal from 'decimal.js';

function calcAverage(midterm: number | Decimal, final: number | Decimal): Decimal {
  const mid = new Decimal(midterm);
  const fin = new Decimal(final);
  return mid.times(0.4).plus(fin.times(0.6)).toDecimalPlaces(2);
}

function calcLetterGrade(average: Decimal | number): LetterGrade {
  const avg = new Decimal(average).toNumber();
  if (avg >= 8.5) return LetterGrade.A;
  if (avg >= 7.0) return LetterGrade.B;
  if (avg >= 5.5) return LetterGrade.C;
  if (avg >= 4.0) return LetterGrade.D;
  return LetterGrade.F;
}

export async function addGrade(
  studentId: number,
  input: { subject: string; midterm: number; final: number }
) {
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

export const getGradesByStudent = (studentId: number) =>
  prisma.grade.findMany({
    where: { studentId },
    orderBy: { recordedAt: 'desc' },
  });

export const deleteGrade = (gradeId: number) =>
  prisma.grade.delete({
    where: { id: gradeId },
  });
