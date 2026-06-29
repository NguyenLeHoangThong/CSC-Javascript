# Bài 7.1 — API Quản lý Blog (JWT Authentication)

**Bài tập độc lập** của Bài 7. Luyện luồng auth đầy đủ: register, login, **refresh token rotation**,
logout, và bảo vệ bài viết theo tác giả.

## 🎯 Kiến thức
- Hash mật khẩu **bcrypt** (saltRounds=12) — không lưu plain text
- **JWT**: access (15m) + refresh (7d); payload `{ id, email, role }` (không chứa password)
- **Refresh Token Rotation**: mỗi lần `/refresh` cấp **cặp token mới**, token cũ bị vô hiệu (so với DB)
- Chống **user enumeration**: dùng chung message khi login sai
- Ownership: chỉ tác giả mới `PATCH/DELETE` được bài của mình (→ 403)

## 🚀 Chạy
```bash
npm install
cp .env.example .env          # điền JWT secrets
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev                  # http://localhost:3000
```
Tài khoản seed: `alice@blog.com` / `bob@blog.com`, mật khẩu `Password123`.

## 📡 Endpoints (`/api/v1`)
| Method | Endpoint | Token? | Mô tả |
|--------|----------|:------:|-------|
| POST | `/auth/register` | ❌ | đăng ký |
| POST | `/auth/login` | ❌ | trả `accessToken` + `refreshToken` |
| POST | `/auth/refresh` | ❌ | cặp token mới (rotation) |
| GET | `/auth/me` | ✅ | thông tin user |
| POST | `/auth/logout` | ✅ | revoke refresh token |
| GET | `/posts` | ❌ | bài đã published |
| GET | `/posts/:id` | ❌ | chi tiết |
| POST | `/posts` | ✅ | tạo (authorId lấy từ token) |
| PATCH | `/posts/:id` | ✅ | chỉ tác giả |
| DELETE | `/posts/:id` | ✅ | chỉ tác giả |

## ✅ Tự kiểm tra
```bash
TOKEN=$(curl -s -X POST localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"alice@blog.com","password":"Password123"}' | node -pe "JSON.parse(require('fs').readFileSync(0)).data.accessToken")
curl localhost:3000/api/v1/auth/me -H "Authorization: Bearer $TOKEN"
# Alice sửa bài của Bob → 403
```

## ➡️ Buổi sau
Bài 7.2 — thêm Authentication vào **shop-backend** + guest checkout.
