# Bài 8.2 — CSC Shop: Phân quyền Admin

**Bài tập CSC Shop** của Bài 8. Tiếp tục `shop-backend` (từ 7.2): thêm `authorize`/`authorizeOwner`,
khóa write products về **admin**, quản lý user, và `/orders/my`.

## 🛡️ Permission Matrix
| Endpoint | Khách | user | admin |
|----------|:-----:|:----:|:-----:|
| GET `/products`, `/categories` | ✅ | ✅ | ✅ |
| POST/PATCH/DELETE `/products` | ❌ 401 | ❌ 403 | ✅ |
| POST `/orders` | ✅ (guest) | ✅ | ✅ |
| GET `/orders/my` | ❌ 401 | ✅ (đơn mình) | ✅ |
| GET `/orders/:id` | ❌ 401 | ✅ nếu là chủ đơn | ✅ (bypass) |
| GET `/users`, `/users/:id` | ❌ | ❌ 403 | ✅ |
| PATCH `/users/:id` | ❌ | ✅ chính chủ | ✅ |
| PATCH `/users/:id/role` | ❌ | ❌ 403 | ✅ (trừ tự đổi mình → 400) |
| DELETE `/users/:id` | ❌ | ❌ 403 | ✅ (trừ tự xóa mình → 400) |

## 🆕 So với 7.2
| Thêm | File |
|------|------|
| `authorize`, `authorizeOwner` | `src/middleware/authorize.ts`, `authorizeOwner.ts` |
| Khóa write products về admin | `src/routes/productRoutes.ts` |
| `/orders/my` + ownership `/orders/:id` | `src/routes/orderRoutes.ts`, `src/services/orderService.ts` |
| User management + self-protection | `src/services/userService.ts`, `routes/userRoutes.ts` |

## 🚀 Chạy
```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name add_authz
npm run prisma:seed
npm run dev                  # http://localhost:3000
```
Tài khoản: `admin@shop.com / Admin@123456`, `customer@shop.com / Customer@123`.

## 🧪 Test phân quyền
```bash
ADMIN=$(curl -s -X POST localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"admin@shop.com","password":"Admin@123456"}' | node -pe "JSON.parse(require('fs').readFileSync(0)).data.accessToken")
CUST=$(curl -s -X POST localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"customer@shop.com","password":"Customer@123"}' | node -pe "JSON.parse(require('fs').readFileSync(0)).data.accessToken")
# customer tạo product → 403
curl -X POST localhost:3000/api/v1/products -H "Authorization: Bearer $CUST" -H "Content-Type: application/json" -d '{"title":"x","price":1,"thumbnail":"http://x/y.jpg","category":"phone","stock":1}'
# customer xem /users → 403 ; admin xem → 200
curl localhost:3000/api/v1/users -H "Authorization: Bearer $CUST"
curl localhost:3000/api/v1/users -H "Authorization: Bearer $ADMIN"
```

## ➡️ Buổi sau
Bài 9.1 — nối **frontend** (shop-frontend) vào `shop-backend` này.
