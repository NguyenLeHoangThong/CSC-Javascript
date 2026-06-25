# Bài 4.1 — Library (SQL)

Bài lẻ luyện SQL với CSDL thư viện (authors → books → loans).

## Yêu cầu / Kiến thức
- Khóa ngoại 1–nhiều, generated column (`loan_days = due_on - borrowed_on`)
- JOIN / LEFT JOIN, WHERE, GROUP BY + COUNT, HAVING, IS NULL

## Chạy
```bash
createdb library_db
psql -U postgres -d library_db -f sql/schema.sql
psql -U postgres -d library_db -f sql/queries.sql
```

## 8 câu truy vấn
1. Sách + tên tác giả (LEFT JOIN, giữ sách mồ côi)
2. Sách xuất bản từ 2015 (WHERE/ORDER BY)
3. Số sách mỗi tác giả (GROUP BY/COUNT)
4. Phiếu mượn chưa trả (IS NULL)
5. Sách trả trễ (returned_on > due_on)
6. Sách được mượn nhiều nhất (COUNT/LIMIT)
7. Tác giả có > 1 sách (HAVING)
8. Sách chưa từng được mượn (LEFT JOIN + IS NULL)
