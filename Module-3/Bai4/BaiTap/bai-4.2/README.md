# Bài 4.2 — Employees & Departments (SQL)

Bài lẻ luyện **aggregate** và **window function** với CSDL nhân sự.

## Yêu cầu / Kiến thức
- GROUP BY + AVG/MIN/MAX/COUNT, HAVING
- Window functions: `RANK()`, `ROW_NUMBER()`, `AVG() OVER`, `SUM() OVER` + `PARTITION BY`

## Chạy
```bash
createdb hr_db
psql -U postgres -d hr_db -f sql/schema.sql
psql -U postgres -d hr_db -f sql/queries.sql
```

## 7 câu truy vấn
1. Nhân viên + phòng ban (LEFT JOIN)
2. Lương trung bình/min/max theo phòng (aggregate)
3. Phòng có lương TB > 2000 (HAVING)
4. Xếp hạng lương trong từng phòng (RANK + PARTITION BY)
5. So sánh lương với TB phòng (AVG OVER)
6. Người lương cao nhất mỗi phòng (ROW_NUMBER)
7. Lũy kế quỹ lương theo ngày tuyển (SUM OVER)
