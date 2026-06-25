# CSC Shop API — Bài 7: Authentication (JWT)

Kế thừa Bài 6 và thêm hệ thống tài khoản: đăng ký, đăng nhập, refresh token, đăng xuất.
Các route ghi dữ liệu giờ yêu cầu **đăng nhập**.

## 🎯 Kiến thức buổi này

- Hash mật khẩu bằng **bcrypt** (saltRounds=12) — không bao giờ lưu plain text
- **JWT**: access token ngắn hạn (15m) + refresh token dài hạn (7d)
- **Refresh token rotation** + revoke (lưu refresh token trong DB)
- Middleware `authenticate` đọc header `Authorization: Bearer <token>` → gắn `req.user`
- `optionalAuthenticate`: cho phép khách vãng lai vẫn mua, user đăng nhập thì đơn được gắn `userId`
- Chống **user enumeration**: dùng chung 1 message lỗi khi đăng nhập sai

## 🆕 So với Bài 6

| Thêm mới | File |
|----------|------|
| Model `User` + enum `Role`, `Order.userId` | `prisma/schema.prisma` |
| Hash & JWT logic | `services/authService.ts` |
| `authenticate`, `optionalAuthenticate` | `middleware/authenticate.ts` |
| Routes `/auth/*` | `routes/authRoutes.ts` |
| Bảo vệ route ghi (products, categories, orders) | các file `routes/*` |
| `GET /orders/me` | `routes/orderRoutes.ts` |

## 🚀 Chạy thử

```bash
npm install
cp .env.example .env          # điền JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
npm run prisma:migrate -- --name add_users_auth
npm run prisma:seed
npm run dev
```

**Tài khoản mẫu sau khi seed:**
- `admin@cscshop.com` / `Admin@123456` — role **admin**
- `customer@cscshop.com` / `Customer@123` — role **customer**

> Bài 7 chưa phân quyền theo role (mọi user đăng nhập đều ghi được). Bài 8 mới khóa theo admin/customer.

## 📡 Endpoints Auth

| Method | Endpoint | Cần token |
|--------|----------|-----------|
| POST | `/auth/register` | ❌ |
| POST | `/auth/login` | ❌ |
| POST | `/auth/refresh` | ❌ |
| GET | `/auth/me` | 🔐 |
| POST | `/auth/logout` | 🔐 |

### Đăng nhập rồi gọi route được bảo vệ

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cscshop.com","password":"Admin@123456"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).data.accessToken")

# Tạo sản phẩm (route được bảo vệ)
curl -X POST http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"New Phone","description":"demo","price":500,"thumbnail":"https://x/y.jpg","categoryId":1}'
```

## 🔐 Bảng quyền (tạm thời ở Bài 7)

| Endpoint | Khách | Đã đăng nhập |
|----------|:-----:|:------------:|
| GET products/categories | ✅ | ✅ |
| POST/PATCH/DELETE products/categories | ❌ 401 | ✅ |
| POST orders | ✅ (khách) | ✅ (gắn userId) |
| GET /orders/me | ❌ 401 | ✅ |

## ➡️ Buổi sau (Bài 8)

Phân quyền **RBAC**: chỉ **admin** quản lý products/categories và mọi đơn hàng;
**customer** chỉ xem đơn của chính mình (ownership).
