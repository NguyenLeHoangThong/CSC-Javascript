import fs from "fs";
import path from "path";
import { Grade } from "../types";

const FILE = path.join(__dirname, "../../data/grades.json");

function readAll(): Grade[] {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8")) as Grade[];
}

function writeAll(data: Grade[]): void {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function calcGrade(average: number): string {
  if (average >= 8.5) return "A";
  if (average >= 7) return "B";
  if (average >= 5.5) return "C";
  if (average >= 4) return "D";
  return "F";
}

export function getAll(): Grade[] {
  return readAll();
}

export function getById(id: number): Grade | undefined {
  return readAll().find((g) => g.id === id);
}

export function findDuplicate(
  studentId: number,
  classId: number,
  subject: string
): Grade | undefined {
  return readAll().find(
    (g) => g.studentId === studentId && g.classId === classId && g.subject === subject
  );
}

export function create(input: {
  studentId: number;
  classId: number;
  subject: string;
  midterm: number;
  final: number;
}): Grade {
  const all = readAll();
  const now = new Date().toISOString();
  const average = +(input.midterm * 0.4 + input.final * 0.6).toFixed(2);
  const grade: Grade = {
    id: all.length > 0 ? Math.max(...all.map((g) => g.id)) + 1 : 1,
    ...input,
    average,
    grade: calcGrade(average),
    recordedAt: now,
    updatedAt: now,
  };
  writeAll([...all, grade]);
  return grade;
}

export function update(
  id: number,
  input: { midterm?: number; final?: number }
): Grade | undefined {
  const all = readAll();
  const index = all.findIndex((g) => g.id === id);
  if (index === -1) return undefined;
  const merged = { ...all[index], ...input };
  merged.average = +(merged.midterm * 0.4 + merged.final * 0.6).toFixed(2);
  merged.grade = calcGrade(merged.average);
  merged.updatedAt = new Date().toISOString();
  all[index] = merged;
  writeAll(all);
  return merged;
}

export function remove(id: number): boolean {
  const all = readAll();
  const filtered = all.filter((g) => g.id !== id);
  if (filtered.length === all.length) return false;
  writeAll(filtered);
  return true;
}
