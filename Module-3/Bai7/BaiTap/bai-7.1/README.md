# Bài 7.1 — JWT Auth basics

Bài lẻ luyện luồng xác thực cơ bản: **hash mật khẩu (bcrypt)** + **đăng nhập trả JWT** + **route được bảo vệ**.
Lưu user trong bộ nhớ (array) để tập trung vào auth, không vướng database.

## Chạy
```bash
npm install
cp .env.example .env
npm run dev    # http://localhost:3001
```

## Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/register` | `{ email, password }` → hash & lưu user |
| POST | `/login` | `{ email, password }` → trả `{ token }` |
| GET | `/me` | cần header `Authorization: Bearer <token>` |

## Thử
```bash
curl -X POST localhost:3001/register -H "Content-Type: application/json" -d '{"email":"a@b.c","password":"secret1"}'
TOKEN=$(curl -s -X POST localhost:3001/login -H "Content-Type: application/json" -d '{"email":"a@b.c","password":"secret1"}' | node -pe "JSON.parse(require('fs').readFileSync(0)).token")
curl localhost:3001/me -H "Authorization: Bearer $TOKEN"
```

## Ghi chú
- `bcrypt.hash` tự thêm salt → cùng mật khẩu vẫn ra hash khác nhau.
- Dùng chung 1 message lỗi khi login sai để tránh lộ email tồn tại (user enumeration).
