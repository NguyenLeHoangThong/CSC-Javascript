# CSC Shop — Bài 4: SQL thực hành (PostgreSQL)

Buổi mở màn của chuỗi **CSC Shop** trong Module 3. Trước khi dùng ORM (Prisma từ Bài 5),
học viên viết SQL thuần để hiểu rõ dữ liệu cửa hàng: categories, products, orders, order_items.

## 🎯 Kiến thức buổi này

- Thiết kế bảng + khóa ngoại (1–nhiều) cho mô hình e-commerce
- ENUM type (`order_status`)
- **Generated column** (`line_total = quantity * unit_price` STORED)
- 10 câu truy vấn: JOIN, WHERE/ORDER BY, GROUP BY + aggregate, HAVING, IS NULL,
  Window function (`RANK() OVER PARTITION BY`), subquery

## 🗂️ Files

```
csc-shop-sql/
└── sql/
    ├── schema.sql    # tạo bảng + dữ liệu mẫu (chạy trước)
    └── queries.sql   # 10 câu truy vấn (chạy từng câu)
```

## 🚀 Cách chạy

### psql

```bash
createdb csc_shop_sql
psql -U postgres -d csc_shop_sql -f sql/schema.sql
psql -U postgres -d csc_shop_sql -f sql/queries.sql
```

### TablePlus / DBeaver

1. Kết nối PostgreSQL, mở `schema.sql`, chạy toàn bộ.
2. Mở `queries.sql`, bôi đen từng câu rồi chạy (Cmd/Ctrl + Enter) để xem kết quả.

## 📚 10 câu truy vấn

| # | Mục tiêu | Kỹ thuật |
|---|----------|----------|
| 1 | Sản phẩm + tên category | LEFT JOIN |
| 2 | Sản phẩm giá ≥ 500 | WHERE, ORDER BY |
| 3 | Thống kê theo category | GROUP BY, AVG, COUNT |
| 4 | Tổng tiền mỗi đơn | JOIN, SUM (generated column) |
| 5 | Số đơn theo trạng thái | GROUP BY, COUNT |
| 6 | Sản phẩm bán chạy nhất | JOIN, SUM, ORDER BY, LIMIT |
| 7 | Sản phẩm chưa từng bán | LEFT JOIN, IS NULL |
| 8 | Xếp hạng giá trong từng category | Window function RANK() |
| 9 | Category doanh thu cao nhất | JOIN nhiều bảng, LIMIT 1 |
| 10 | Đơn cao hơn trung bình | HAVING, subquery |

## 🔎 Ghi chú cho học viên

- **Generated column**: không bao giờ `INSERT` giá trị `line_total` — Postgres tự tính & lưu.
- Thử sửa `WHERE`/`HAVING`, đổi `LIMIT`, hay thêm `INSERT` để quan sát kết quả thay đổi.
- Mô hình bảng ở đây chính là mô hình Prisma sẽ tạo lại ở **Bài 5** — so sánh để thấy ORM
  giúp mình bớt viết SQL tay như thế nào.

## ➡️ Buổi sau (Bài 5)

Dựng REST API cho CSC Shop bằng **Prisma + Express**: CRUD products & categories.
