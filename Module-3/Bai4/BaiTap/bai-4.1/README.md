# Bài 4.1 — Thư viện sách (SQL)

**Bài tập độc lập** của Bài 4 (PostgreSQL + SQL thuần). Luyện thiết kế bảng, constraint và truy vấn
trước khi chuyển sang ORM ở Bài 5.

## 🎯 Kiến thức
- Khóa ngoại + `ON DELETE RESTRICT`, `CHECK`, `ENUM` (`borrow_status`)
- JOIN / LEFT JOIN, GROUP BY + aggregate, `HAVING`, `IS NULL`
- `DATE_TRUNC`, ép kiểu `::FLOAT` tránh integer division

## 🗂️ Cấu trúc
```
bai-4.1/
└── sql/
    ├── schema.sql    # 3 bảng authors → books → borrows + dữ liệu mẫu
    └── queries.sql   # 8 câu truy vấn
```

## 🚀 Cách chạy
```bash
createdb library_db
psql -U postgres -d library_db -f sql/schema.sql
psql -U postgres -d library_db -f sql/queries.sql
```
> TablePlus/DBeaver: mở `schema.sql` chạy hết, rồi mở `queries.sql` bôi đen từng câu chạy.

## 📚 8 câu truy vấn
| # | Mục tiêu | Kỹ thuật |
|---|----------|----------|
| 1 | Sách + tác giả | JOIN |
| 2 | Sách đang được mượn | WHERE phép tính cột |
| 3 | Tác giả nhiều sách nhất | LEFT JOIN + GROUP BY + LIMIT |
| 4 | Lượt mượn theo tháng | DATE_TRUNC + GROUP BY |
| 5 | Sách chưa từng mượn | LEFT JOIN + IS NULL |
| 6 | Tỉ lệ mượn | `::FLOAT` + ROUND |
| 7 | Phiếu chưa trả | IS NULL |
| 8 | Người mượn nhiều | GROUP BY + HAVING |

## ✅ Tự kiểm tra
- Thử `DELETE FROM authors WHERE id = 1;` → bị chặn bởi `ON DELETE RESTRICT` (còn sách tham chiếu).
- Thử chèn `available_copies` > `total_copies` → vi phạm `CHECK`.

## ➡️ Buổi sau
Bài 4.2 — thiết kế database cho **CSC Shop** (categories/products/orders/order_items).
