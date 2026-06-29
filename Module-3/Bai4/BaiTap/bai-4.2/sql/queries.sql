-- ============================================================
-- Bài 4.2 — CSC Shop sample queries. Run schema.sql + seed.sql first.
-- ============================================================

-- 1. Sản phẩm kèm tên category
SELECT p.title, p.price, p.stock, c.name AS category
FROM   products p
JOIN   categories c ON c.id = p.category_id
ORDER  BY p.price DESC;

-- 2. Số sản phẩm + giá trung bình theo category
SELECT c.name, COUNT(p.id) AS product_count, ROUND(AVG(p.price)) AS avg_price
FROM   categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP  BY c.id, c.name
ORDER  BY product_count DESC;

-- 3. Tổng tiền mỗi đơn (JOIN order_items, dùng snapshot price)
SELECT o.id, o.user_name, o.status, SUM(oi.price * oi.quantity) AS items_total
FROM   orders o
JOIN   order_items oi ON oi.order_id = o.id
GROUP  BY o.id, o.user_name, o.status
ORDER  BY items_total DESC;

-- 4. Sản phẩm bán chạy (tổng quantity)
SELECT p.title, SUM(oi.quantity) AS sold
FROM   products p
JOIN   order_items oi ON oi.product_id = p.id
GROUP  BY p.id, p.title
ORDER  BY sold DESC
LIMIT  5;

-- 5. Sản phẩm chưa từng bán (LEFT JOIN + IS NULL)
SELECT p.title
FROM   products p
LEFT JOIN order_items oi ON oi.product_id = p.id
WHERE  oi.id IS NULL
ORDER  BY p.title;

-- 6. Test trigger updated_at: UPDATE rồi xem updated_at đổi
UPDATE products SET stock = stock - 1 WHERE id = 1;
SELECT id, title, created_at, updated_at FROM products WHERE id = 1;
