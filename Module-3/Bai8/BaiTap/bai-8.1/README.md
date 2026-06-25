# Bài 8.1 — RBAC (Role-Based Access Control)

Bài lẻ luyện middleware `authorize(...roles)` chạy **sau** `authenticate`.

## Chạy
```bash
npm install
cp .env.example .env
npm run dev    # http://localhost:3003
```

Tài khoản seed: `admin@demo.com / admin123` (admin), `user@demo.com / user123` (user).

## Endpoints
| Method | Endpoint | Quyền |
|--------|----------|-------|
| POST | `/login` | công khai → `{ token, role }` |
| GET | `/posts` | công khai |
| POST | `/posts` | **admin** (user → 403) |
| DELETE | `/posts/:id` | **admin** |

## Ghi chú
- `role` được nhúng trong JWT → `authorize()` đọc trực tiếp, không cần truy DB.
- Phân biệt **401** (chưa đăng nhập) vs **403** (sai quyền).
