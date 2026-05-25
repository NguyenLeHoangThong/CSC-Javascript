import fs from "fs";
import path from "path";
import { Post } from "../types/api";

const FILE = path.join(__dirname, "../../data/posts.json");

function readAll(): Post[] {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8")) as Post[];
}

function writeAll(posts: Post[]): void {
  fs.writeFileSync(FILE, JSON.stringify(posts, null, 2), "utf-8");
}

function getAll(): Post[] {
  return readAll();
}

function getById(id: number): Post | undefined {
  return readAll().find((p) => p.id === id);
}

function create(input: Omit<Post, "id" | "createdAt" | "updatedAt">): Post {
  const posts = readAll();
  const now = new Date().toISOString();
  const post: Post = {
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  writeAll([...posts, post]);
  return post;
}

function update(id: number, input: Partial<Post>): Post | undefined {
  const posts = readAll();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  posts[index] = {
    ...posts[index],
    ...input,
    id,
    updatedAt: new Date().toISOString(),
  };
  writeAll(posts);
  return posts[index];
}

function remove(id: number): boolean {
  const posts = readAll();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  writeAll(filtered);
  return true;
}

export { getAll, getById, create, update, remove };
