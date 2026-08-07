# csc-shop-api — Module 4

Backend của CSC Shop: Express 4 + TypeScript + Prisma 5 + PostgreSQL.
Kế thừa nguyên trạng từ `Module-3/Bai9/BaiTap/csc-shop-api`, được nâng cấp qua Bài 31→40.

> Bản đồ đầy đủ "bài học → file" nằm ở [../README.md](../README.md).
> Convention bắt buộc khi viết code mới: [CLAUDE.md](CLAUDE.md).

---

## Chạy local

```bash
cp .env.example .env          # sửa DATABASE_URL, thêm GEMINI_API_KEY nếu muốn dùng AI
npm install
npx prisma generate
npm run prisma:push           # tạo bảng
npm run prisma:seed           # idempotent — chạy lại bao nhiêu lần cũng an toàn
npm run dev                   # http://localhost:3000
```

Tài khoản seed: `admin@cscshop.com / Admin@123456` · `customer@cscshop.com / Customer@123`.

### Chạy bằng Docker

```bash
docker compose up -d --build
docker compose exec backend npx prisma db push
curl http://localhost:3000/health
```

---

## Scripts

| Lệnh | Việc |
|---|---|
| `npm run dev` | ts-node-dev, reload khi sửa file |
| `npm run typecheck` | `tsc --noEmit -p tsconfig.check.json` — check cả `scripts/`, `prisma/`, test |
| `npm test` | Vitest (33 test, không cần DB thật) |
| `npm run build` | `tsc` → `dist/` |
| `npm start` | `node dist/server.js` |
| `npm run prisma:push` / `:seed` / `:studio` | Prisma |
| `npm run ai:review -- <file>` | AI review 1 file bằng Gemini (Bài 33) |

---

## API

Base: `/api/v1`

| Method | Path | Quyền |
|---|---|---|
| `POST` | `/auth/register`, `/auth/login`, `/auth/refresh` | public *(rate limit 10 req/15 phút)* |
| `GET` | `/auth/me` · `POST /auth/logout` | đăng nhập |
| `GET` | `/categories`, `/categories/:id` | public *(cache 10 phút)* |
| `POST/PATCH/DELETE` | `/categories/:id` | admin |
| `GET` | `/products`, `/products/:id` | public |
| `POST/PATCH/DELETE` | `/products/:id` | admin |
| `POST` | `/orders` | public *(guest checkout được; có token thì gắn vào tài khoản)* |
| `GET` | `/orders/me` | đăng nhập |
| `GET` | `/orders` · `PATCH /orders/:id/status` | admin |
| `GET` | `/orders/:id` | chủ đơn hoặc admin |
| `GET` | `/products/:id/reviews` | public |
| `POST` | `/products/:id/reviews` | đăng nhập *(1 review / user / sản phẩm)* |
| `DELETE` | `/reviews/:id` | tác giả hoặc admin |
| `PATCH` | `/reviews/:id/visibility` | admin |
| `GET` | `/users`, `/users/:id` · `PATCH /users/:id/role` · `DELETE /users/:id` | admin |
| `GET` | `/stats` | admin |
| `GET` | `/ai/suggest?q=...` | public *(rate limit 10 req/phút)* |
| `GET` | `/health` | public — kiểm tra cả kết nối DB |

Response luôn có dạng `{ success, data, meta? }` hoặc `{ success: false, message }`.

---

## Biến môi trường

Xem [.env.example](.env.example). Bắt buộc: `DATABASE_URL`, `JWT_ACCESS_SECRET`,
`JWT_REFRESH_SECRET`. `CORS_ORIGINS` là whitelist origin (mặc định
`http://localhost:5173`) — nhớ thêm domain Vercel sau khi deploy FE.

`GEMINI_API_KEY` là tuỳ chọn: để trống thì `/ai/suggest` trả 503, phần còn lại của API
vẫn chạy bình thường.
