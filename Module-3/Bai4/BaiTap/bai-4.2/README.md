# Bài 4.2 — CSC Shop: Thiết kế Database (SQL)

**Bài tập CSC Shop** của Bài 4. Đây là buổi đầu tiên của chuỗi `shop-backend` — thiết kế CSDL nền tảng
bằng SQL thuần. Từ Bài 5.2 trở đi sẽ khai báo lại bằng Prisma và build API.

## 🎯 Kiến thức
- Thiết kế 4 bảng e-commerce: `categories` → `products`, `orders` → `order_items`
- `ENUM` (`order_status`), `CHECK`, `ON DELETE CASCADE` vs `RESTRICT`
- **Snapshot** `title`/`price`/`thumbnail` trong `order_items` (giá tại thời điểm mua, không đổi khi product đổi giá)
- **Trigger** `updated_at` bằng PL/pgSQL (Bài 5 thay bằng `@updatedAt`)

## 🗂️ Cấu trúc
```
bai-4.2/
└── sql/
    ├── schema.sql    # 4 bảng + ENUM + trigger updated_at
    ├── seed.sql      # 5 categories, 20 products, 3 orders
    └── queries.sql   # 6 câu truy vấn mẫu + test trigger
```

## 🚀 Cách chạy
```bash
createdb shop_db
psql -U postgres -d shop_db -f sql/schema.sql
psql -U postgres -d shop_db -f sql/seed.sql
psql -U postgres -d shop_db -f sql/queries.sql
```

## 🔎 Ghi chú cho học viên
- `order_items.title/price/thumbnail` là **snapshot** — vì sau này product có thể đổi giá/đổi tên,
  nhưng đơn hàng cũ phải giữ nguyên thông tin lúc mua.
- `ON DELETE CASCADE` trên `order_items.order_id`: xóa order → tự xóa item của nó.
- `ON DELETE RESTRICT` trên `order_items.product_id`: không cho xóa product đang nằm trong đơn.
- Trigger `set_updated_at()` chạy `BEFORE UPDATE` để tự cập nhật `updated_at` — query #6 minh hoạ.

## ➡️ Buổi sau
Bài 5.2 — khai báo lại schema này bằng **Prisma**, migrate + seed, và build CRUD API cho products.
