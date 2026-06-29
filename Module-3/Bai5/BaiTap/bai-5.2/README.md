# Bài 5.2 — CSC Shop: Chuyển sang Prisma (shop-backend)

**Bài tập CSC Shop** của Bài 5. Khai báo lại schema Bài 4.2 bằng **Prisma**, migrate + seed, và
chuyển service layer từ file JSON sang Prisma. Đây là điểm bắt đầu của `shop-backend` (TypeScript) —
các buổi 6.2 → 8.2 sẽ bồi đắp tiếp.

## 🎯 Kiến thức
- Prisma schema cho `Category` 1──< `Product`; `@updatedAt` thay trigger SQL của Bài 4.2
- `toShape()`: chuẩn hoá row Prisma về đúng shape FE cần (`price`/`rating` → number, `category` → slug)
- Filter theo category slug + search + pagination; response `{ success, data, meta }`

## 🚀 Chạy
```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name init
npm run prisma:seed          # 5 categories + 20 products
npm run dev                  # http://localhost:3000
```

## 📡 Endpoints (`/api/v1`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/products?category=&search=&page=&limit=` | danh sách + filter + phân trang |
| GET | `/products/:id` | chi tiết |
| POST | `/products` | tạo (`category` = slug) |
| PATCH | `/products/:id` | cập nhật |
| DELETE | `/products/:id` | xóa |
| GET | `/categories` | danh sách category (kèm `productCount`) |

> Mọi route hiện **mở** (chưa cần đăng nhập). Bài 7.2 thêm auth, Bài 8.2 khóa write về admin.

## 🔎 Ghi chú
- `toShape` trả `category` là slug (string) đúng như FE Module 2 đang dùng → không cần đổi FE.
- `POST /products` nhận `category` (slug) rồi tự tra ra `categoryId` — khớp form admin ở Bài 10.

## ➡️ Buổi sau
Bài 6.2 — thêm **Order API** với transaction (kiểm tra & trừ stock).
