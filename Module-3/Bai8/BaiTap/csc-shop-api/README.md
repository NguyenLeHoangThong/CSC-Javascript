# CSC Shop API — Bài 8: Authorization (RBAC + Ownership)

Kế thừa Bài 7 (đã có đăng nhập) và thêm **phân quyền**: ai được làm gì.

## 🎯 Kiến thức buổi này

- **RBAC** (`authorize(...roles)`): kiểm tra `req.user.role` — sai role → **403**
- **Ownership** (`authorizeOwner(getOwnerId)`): chỉ chủ tài nguyên thao tác được — **admin luôn bypass**
- Thứ tự middleware: `authenticate` (401) → `authorize`/`authorizeOwner` (403) → `validate` → controller
- Phân biệt rõ **401 (chưa đăng nhập)** vs **403 (không đủ quyền)**

## 🆕 So với Bài 7

| Thêm mới | File |
|----------|------|
| `authorize(...roles)` | `middleware/authorize.ts` |
| `authorizeOwner(getOwnerId)` | `middleware/authorizeOwner.ts` |
| `findOwnerId()` cho order | `services/orderService.ts` |
| Khóa write products/categories về admin | `routes/productRoutes.ts`, `routes/categoryRoutes.ts` |
| Order: admin xem tất cả, customer xem đơn mình | `routes/orderRoutes.ts` |

## 🛡️ Bảng phân quyền

| Endpoint | Khách | Customer | Admin |
|----------|:-----:|:--------:|:-----:|
| GET products / categories | ✅ | ✅ | ✅ |
| POST/PATCH/DELETE products / categories | ❌ 401 | ❌ 403 | ✅ |
| POST `/orders` | ❌ 401 | ✅ | ✅ |
| GET `/orders/me` | ❌ 401 | ✅ (đơn của mình) | ✅ |
| GET `/orders/:id` | ❌ 401 | ✅ **nếu là chủ đơn** | ✅ (mọi đơn) |
| GET `/orders` (tất cả) | ❌ 401 | ❌ 403 | ✅ |
| PATCH `/orders/:id/status` | ❌ 401 | ❌ 403 | ✅ |

## 🚀 Chạy thử

```bash
npm install
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Tài khoản mẫu: `admin@cscshop.com / Admin@123456`, `customer@cscshop.com / Customer@123`.

## 🧪 Test phân quyền

```bash
# Lấy 2 token
ADMIN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@cscshop.com","password":"Admin@123456"}' | node -pe "JSON.parse(require('fs').readFileSync(0)).data.accessToken")
CUST=$(curl -s -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" \
  -d '{"email":"customer@cscshop.com","password":"Customer@123"}' | node -pe "JSON.parse(require('fs').readFileSync(0)).data.accessToken")

# Customer tạo product → 403
curl -X POST http://localhost:3000/api/v1/products -H "Authorization: Bearer $CUST" \
  -H "Content-Type: application/json" -d '{"title":"x","description":"xxxxx","price":1,"thumbnail":"u","categoryId":1}'

# Admin xem tất cả đơn → 200
curl http://localhost:3000/api/v1/orders -H "Authorization: Bearer $ADMIN"

# Customer xem tất cả đơn → 403
curl http://localhost:3000/api/v1/orders -H "Authorization: Bearer $CUST"
```

## ➡️ Buổi sau (Bài 9)

Hoàn thiện backend và xây **frontend React đầy đủ** (CSC Shop) kết nối trực tiếp API này:
duyệt sản phẩm, giỏ hàng, đăng nhập, đặt hàng, xem đơn của tôi.
