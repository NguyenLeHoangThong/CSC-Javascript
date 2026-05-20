// server.ts
import http, { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import path from "path";

interface Note {
  id: number;
  title: string;
  content: string;
}

const FILE = path.join(__dirname, "../data/notes.json");

const readNotes = (): Note[] => JSON.parse(fs.readFileSync(FILE, "utf-8"));
const writeNotes = (notes: Note[]): void => fs.writeFileSync(FILE, JSON.stringify(notes, null, 2), "utf-8");

function sendJSON(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function readBody(req: IncomingMessage): Promise<Pick<Note, "title" | "content">> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      resolve(JSON.parse(body));
    });
  });
}

http
  .createServer(async (req, res) => {
    const { method, url } = req;

    if (method === "GET" && url === "/notes") {
      return sendJSON(res, 200, readNotes());
    }

    if (method === "POST" && url === "/notes") {
      const notes = readNotes();
      const { title, content } = await readBody(req);
      const newNote: Note = {
        id: notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1,
        title,
        content,
      };
      writeNotes([...notes, newNote]);
      return sendJSON(res, 201, newNote);
    }

    sendJSON(res, 404, { message: "Route không tồn tại" });
  })
  .listen(3000, () => console.log("http://localhost:3000"));
