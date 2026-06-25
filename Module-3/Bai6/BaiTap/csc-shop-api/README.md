# CSC Shop API — Bài 6: Transaction, Aggregate & Query nâng cao

Kế thừa toàn bộ Bài 5 và bổ sung các kỹ thuật query nâng cao + đặt hàng an toàn bằng transaction.

## 🎯 Kiến thức buổi này

- **Pagination / Filter / Search / Sort** ngay trong database cho `GET /products`
- **Transaction** (`prisma.$transaction`) khi tạo đơn hàng: tạo order + trừ tồn kho phải "all-or-nothing"
- **Aggregate**: `count()`, `aggregate({ _sum })`, `groupBy()` cho trang thống kê
- Quan hệ nhiều cấp: `Order` 1 ──< `OrderItem` >── 1 `Product`
- Nested write: tạo `Order` kèm `items` trong 1 câu lệnh

## 🆕 So với Bài 5

| Thêm mới | File |
|----------|------|
| Model `Order`, `OrderItem`, enum `OrderStatus` | `prisma/schema.prisma` |
| Lọc/sort/phân trang sản phẩm | `services/productService.ts` |
| Tạo đơn bằng transaction + trừ kho | `services/orderService.ts` |
| Thống kê (aggregate) | `services/statsService.ts` |
| Routes `/orders`, `/stats` | `routes/orderRoutes.ts`, `routes/statsRoutes.ts` |

## 🚀 Chạy thử

```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name add_orders
npm run prisma:seed
npm run dev
```

## 📡 Endpoints mới

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/products?search=&category=&minPrice=&maxPrice=&sortBy=&order=&page=&limit=` | Lọc + phân trang |
| POST | `/orders` | Tạo đơn (transaction: kiểm tra & trừ tồn kho) |
| GET | `/orders?status=&page=&limit=` | Danh sách đơn |
| GET | `/orders/:id` | Chi tiết đơn kèm items |
| PATCH | `/orders/:id/status` | Đổi trạng thái đơn |
| GET | `/stats` | Thống kê (counts, revenue, group by status) |

### Ví dụ: tạo đơn hàng

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Nguyen Van A",
    "email": "a@gmail.com",
    "phone": "0901234567",
    "address": "123 Le Loi, Q1",
    "items": [{ "productId": 1, "quantity": 2 }, { "productId": 9, "quantity": 1 }]
  }'
```

Response trả về order + items, đồng thời `stock` của sản phẩm đã bị trừ.
Nếu 1 sản phẩm không đủ tồn kho → **toàn bộ** transaction rollback (không tạo order, không trừ kho).

## 🔎 Ghi chú cho học viên

- Vì sao dùng transaction? Nếu trừ kho thành công nhưng tạo order lỗi (hoặc ngược lại), dữ liệu sẽ
  sai lệch. `$transaction` đảm bảo hai việc luôn xảy ra cùng nhau.
- `price` trong `OrderItem` lưu **giá tại thời điểm mua** — về sau giá sản phẩm đổi cũng không ảnh hưởng đơn cũ.
- List response giờ có `meta` (total, page, pages, hasNext, hasPrev) — frontend dùng để phân trang.

## ➡️ Buổi sau (Bài 7)

Thêm **User** + Authentication (JWT): register / login / refresh / logout, và bảo vệ các route ghi dữ liệu.
