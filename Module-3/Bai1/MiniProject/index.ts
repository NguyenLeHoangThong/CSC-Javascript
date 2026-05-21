import http, { IncomingMessage, ServerResponse } from "http";
import { Todo, CreateTodoInput } from "./types";

let todos: Todo[] = [
  { id: 1, title: "Học Node.js", done: false },
  { id: 2, title: "Cài TypeScript", done: true },
];
let nextId = 3;

function sendJSON(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function readBody(req: IncomingMessage): Promise<CreateTodoInput> {
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

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // GET /todos -> trả về toàn bộ danh sách
  if (method === "GET" && url === "/todos") {
    return sendJSON(res, 200, todos);
  }

  // GET /todos/:id -> tìm 1 todo theo id
  if (method === "GET" && url?.startsWith("/todos/") && !url.endsWith("/done")) {
    const id = Number(url.split("/")[2]);
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return sendJSON(res, 404, { message: "Không tìm thấy todo" });
    }
    return sendJSON(res, 200, todo);
  }

  // POST /todos -> tạo mới todo từ body { title }
  if (method === "POST" && url === "/todos") {
    const body = await readBody(req);
    const newTodo: Todo = {
      id: nextId++,
      title: body.title,
      done: false,
    };
    todos.push(newTodo);
    return sendJSON(res, 201, newTodo);
  }

  // PATCH /todos/:id/done -> đánh dấu todo đã hoàn thành
  if (method === "PATCH" && url?.startsWith("/todos/") && url.endsWith("/done")) {
    const id = Number(url.split("/")[2]);
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return sendJSON(res, 404, { message: "Không tìm thấy todo" });
    }
    todo.done = true;
    return sendJSON(res, 200, todo);
  }

  // DELETE /todos/:id -> xoá todo theo id
  if (method === "DELETE" && url?.startsWith("/todos/")) {
    const id = Number(url.split("/")[2]);
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return sendJSON(res, 404, { message: "Không tìm thấy todo" });
    }
    todos.splice(index, 1);
    return sendJSON(res, 200, { message: "Đã xoá thành công" });
  }

  sendJSON(res, 404, { message: "Route không tồn tại" });
});

server.listen(3000, () => console.log("http://localhost:3000"));
