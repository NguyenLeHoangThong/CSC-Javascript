# Bài 5.1 — Task Manager (Prisma CRUD)

Bài lẻ luyện **CRUD cơ bản với Prisma** trên 1 model `Task`.

## Chạy
```bash
npm install
cp .env.example .env          # sửa DATABASE_URL
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev                   # http://localhost:3001
```

## Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/tasks?status=todo` | danh sách (lọc theo status) |
| GET | `/tasks/:id` | chi tiết |
| POST | `/tasks` | tạo `{ title, description?, status?, priority? }` |
| PATCH | `/tasks/:id` | cập nhật |
| DELETE | `/tasks/:id` | xóa |

## Ghi chú
- `findMany / findUnique / create / update / delete` là 5 hàm CRUD lõi của Prisma.
- `status` là enum (`todo|doing|done`); `priority` 1–5.
