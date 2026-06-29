-- ============================================================
-- Bài 4.1 — Library queries. Run schema.sql first, then each query one by one.
-- ============================================================

-- 1. Sách kèm tên tác giả (JOIN)
SELECT b.title, a.full_name AS author, b.genre, b.available_copies
FROM   books b
JOIN   authors a ON b.author_id = a.id
ORDER  BY b.title;

-- 2. Sách đang được mượn (available < total)
SELECT b.title, b.total_copies, b.available_copies,
       b.total_copies - b.available_copies AS borrowed_count
FROM   books b
WHERE  b.available_copies < b.total_copies;

-- 3. Tác giả có nhiều đầu sách nhất (LEFT JOIN + GROUP BY + LIMIT)
SELECT a.full_name, COUNT(b.id) AS total_books
FROM   authors a
LEFT JOIN books b ON b.author_id = a.id
GROUP  BY a.id, a.full_name
ORDER  BY total_books DESC
LIMIT  1;

-- 4. Lượt mượn theo tháng (GROUP BY DATE_TRUNC)
SELECT DATE_TRUNC('month', borrowed_at) AS month, COUNT(*) AS total
FROM   borrows
GROUP  BY DATE_TRUNC('month', borrowed_at)
ORDER  BY month DESC;

-- 5. Sách chưa từng được mượn (LEFT JOIN + IS NULL)
SELECT b.title, a.full_name AS author
FROM   books   b
JOIN   authors a ON b.author_id = a.id
LEFT JOIN borrows br ON br.book_id = b.id
WHERE  br.id IS NULL;

-- 6. Tỉ lệ mượn của từng sách — dùng ::FLOAT để tránh integer division
SELECT b.title,
       b.total_copies,
       b.available_copies,
       ROUND(
         ((b.total_copies - b.available_copies)::FLOAT / b.total_copies * 100)::NUMERIC, 1
       ) AS borrow_rate_pct
FROM   books b
WHERE  b.total_copies > 0
ORDER  BY borrow_rate_pct DESC;

-- 7. Phiếu mượn chưa trả (IS NULL trên returned_at)
SELECT br.id, b.title, br.borrower_name, br.due_date, br.status
FROM   borrows br
JOIN   books b ON b.id = br.book_id
WHERE  br.returned_at IS NULL
ORDER  BY br.due_date;

-- 8. Người mượn nhiều nhất (GROUP BY + HAVING)
SELECT borrower_name, borrower_email, COUNT(*) AS borrow_count
FROM   borrows
GROUP  BY borrower_name, borrower_email
HAVING COUNT(*) >= 2
ORDER  BY borrow_count DESC;
