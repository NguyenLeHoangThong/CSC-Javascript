# Bài 6.2 — CSC Shop: Order API với Transaction

**Bài tập CSC Shop** của Bài 6. Tiếp tục `shop-backend` (từ 5.2), thêm `Order` + `OrderItem` và
endpoint đặt hàng dùng **transaction 4 bước**.

## 🎯 Kiến thức — `POST /orders` (4 bước trong 1 transaction)
1. **Kiểm tra stock** từng item (không có → 404, thiếu hàng → 409 kèm tên + số còn lại)
2. **Tính `totalAmount`** = Σ(price × quantity) theo giá snapshot
3. **Tạo `Order` + `OrderItem`** bằng nested write — snapshot `title`/`price`/`thumbnail`
4. **Trừ `stock`** từng sản phẩm (`decrement`)

> Nếu bất kỳ bước nào fail (vd hết hàng) → **toàn bộ rollback**: không tạo order, không trừ stock.

## 🆕 So với 5.2
| Thêm | File |
|------|------|
| `Order`, `OrderItem`, enum `OrderStatus` | `prisma/schema.prisma` |
| Tạo đơn bằng transaction | `services/orderService.ts` |
| Route `/orders` | `routes/orderRoutes.ts` |

## 🚀 Chạy
```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name add_orders
npm run prisma:seed
npm run dev                  # http://localhost:3000
```

## 📡 Endpoints mới
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/orders` | tạo đơn (transaction) |
| GET | `/orders/:id` | chi tiết đơn kèm `items` |

### Thử
```bash
# Đặt hàng thành công
curl -X POST localhost:3000/api/v1/orders -H "Content-Type: application/json" -d '{
  "userName":"Nguyen A","userEmail":"a@gmail.com","userPhone":"0901234567","address":"123 Le Loi",
  "items":[{"productId":1,"title":"iPhone 15 Pro","price":28990000,"quantity":1,"thumbnail":"x"}]
}'
# Đặt vượt stock → 409, KHÔNG trừ stock
curl -X POST localhost:3000/api/v1/orders -H "Content-Type: application/json" -d '{
  "userName":"Test","userEmail":"t@gmail.com","userPhone":"0900000000","address":"Test",
  "items":[{"productId":1,"title":"iPhone 15 Pro","price":28990000,"quantity":9999,"thumbnail":"x"}]
}'
```

## 🔎 Ghi chú
- `OrderItem` lưu snapshot → đơn cũ không đổi dù product sau này đổi giá/tên.
- `throw` trong `$transaction` tự động rollback — không cần rollback thủ công.

## ➡️ Buổi sau
Bài 7.2 — thêm **Authentication** (User + JWT) và guest checkout cho shop-backend.
