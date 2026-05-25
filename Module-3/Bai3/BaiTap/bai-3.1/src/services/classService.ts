import fs from "fs";
import path from "path";
import { Class } from "../types";

const FILE = path.join(__dirname, "../../data/classes.json");

function readAll(): Class[] {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8")) as Class[];
}

function writeAll(data: Class[]): void {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function getAll(): Class[] {
  return readAll();
}

export function getById(id: number): Class | undefined {
  return readAll().find((c) => c.id === id);
}

export function create(input: Omit<Class, "id" | "createdAt" | "updatedAt">): Class {
  const all = readAll();
  const now = new Date().toISOString();
  const cls: Class = {
    id: all.length > 0 ? Math.max(...all.map((c) => c.id)) + 1 : 1,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  writeAll([...all, cls]);
  return cls;
}

export function update(id: number, input: Partial<Class>): Class | undefined {
  const all = readAll();
  const index = all.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  all[index] = {
    ...all[index],
    ...input,
    id,
    updatedAt: new Date().toISOString(),
  };
  writeAll(all);
  return all[index];
}

export function remove(id: number): boolean {
  const all = readAll();
  const filtered = all.filter((c) => c.id !== id);
  if (filtered.length === all.length) return false;
  writeAll(filtered);
  return true;
}
