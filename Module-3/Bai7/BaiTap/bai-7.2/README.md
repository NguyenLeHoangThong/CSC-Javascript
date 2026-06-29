# Bài 7.2 — CSC Shop: Thêm Authentication

**Bài tập CSC Shop** của Bài 7. Tiếp tục `shop-backend` (từ 6.2): thêm `User` + JWT auth (giống 7.1),
và **guest checkout**.

## 🎯 Kiến thức
- `User` model + enum `Role (user|admin)`, `Order.userId` nullable
- Auth: register / login / refresh (rotation) / logout / me — tái dùng logic của 7.1
- **Guest checkout**: `POST /orders` vẫn cho đặt khi không có token; nếu có token hợp lệ thì gắn `userId`
  (verify token trong `try/catch`, sai token vẫn cho đặt, không trả 401)

## 🆕 So với 6.2
| Thêm | File |
|------|------|
| `User` + `Role`, `Order.userId` | `prisma/schema.prisma` |
| Auth service/middleware/routes | `src/services/authService.ts`, `src/middleware/authenticate.ts`, `src/routes/authRoutes.ts` |
| Guest checkout | `src/routes/orderRoutes.ts` |

## 🚀 Chạy
```bash
npm install
cp .env.example .env          # điền JWT secrets
npm run prisma:migrate -- --name add_users_auth
npm run prisma:seed
npm run dev                  # http://localhost:3000
```
Tài khoản seed: `admin@shop.com / Admin@123456`, `customer@shop.com / Customer@123`.

## 📡 Endpoints Auth (`/api/v1/auth`)
| Method | Endpoint | Token? |
|--------|----------|:------:|
| POST | `/register` | ❌ |
| POST | `/login` | ❌ |
| POST | `/refresh` | ❌ |
| GET | `/me` | ✅ |
| POST | `/logout` | ✅ |

`POST /orders` không bắt buộc token (guest). Có token hợp lệ → order gắn `userId`.

## ➡️ Buổi sau
Bài 8.2 — phân quyền **admin** cho products/categories + quản lý user + `/orders/my`.
