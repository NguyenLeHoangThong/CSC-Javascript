-- ============================================================
-- CSC Shop — Bài 4: 10 practice queries
-- Run schema.sql first. Then run each query one at a time and read the result.
-- ============================================================

-- Query 1: All products with their category name (LEFT JOIN)
-- Học: LEFT JOIN, ORDER BY
SELECT p.title, p.price, p.stock, c.name AS category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.title;

-- Query 2: Products priced 500 or more (WHERE + ORDER BY)
-- Học: WHERE, ORDER BY DESC
SELECT title, price, stock
FROM products
WHERE price >= 500
ORDER BY price DESC;

-- Query 3: Per-category statistics (GROUP BY + aggregates)
-- Học: GROUP BY, COUNT, AVG, ROUND
SELECT c.name AS category,
       COUNT(p.id) AS product_count,
       ROUND(AVG(p.price), 2) AS avg_price
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name
ORDER BY avg_price DESC NULLS LAST;

-- Query 4: Total amount of each order (JOIN + SUM of the generated column)
-- Học: JOIN, GROUP BY, SUM
SELECT o.id AS order_id, o.customer_name, o.status,
       SUM(oi.line_total) AS order_total
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.customer_name, o.status
ORDER BY order_total DESC;

-- Query 5: How many orders are in each status (GROUP BY + COUNT)
-- Học: GROUP BY, COUNT
SELECT status, COUNT(*) AS total_orders
FROM orders
GROUP BY status
ORDER BY total_orders DESC;

-- Query 6: Best-selling products by total quantity sold (JOIN + GROUP BY + LIMIT)
-- Học: JOIN, SUM, GROUP BY, ORDER BY, LIMIT
SELECT p.title,
       SUM(oi.quantity) AS units_sold,
       SUM(oi.line_total) AS revenue
FROM products p
JOIN order_items oi ON oi.product_id = p.id
GROUP BY p.id, p.title
ORDER BY units_sold DESC
LIMIT 5;

-- Query 7: Products that have NEVER been ordered (LEFT JOIN + IS NULL)
-- Học: LEFT JOIN, IS NULL
SELECT p.title, p.price
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
WHERE oi.id IS NULL
ORDER BY p.title;

-- Query 8: Rank products by price inside each category (Window function)
-- Học: RANK() OVER (PARTITION BY ... ORDER BY ...)
SELECT title, category, price, price_rank
FROM (
  SELECT p.title,
         c.name AS category,
         p.price,
         RANK() OVER (PARTITION BY p.category_id ORDER BY p.price DESC) AS price_rank
  FROM products p
  JOIN categories c ON c.id = p.category_id
) ranked
WHERE price_rank <= 2          -- top 2 most expensive per category
ORDER BY category, price_rank;

-- Query 9: The category that generated the most revenue (subquery chain + LIMIT 1)
-- Học: multi-table JOIN, GROUP BY, ORDER BY, LIMIT
SELECT c.name AS category, SUM(oi.line_total) AS revenue
FROM categories c
JOIN products p   ON p.category_id = c.id
JOIN order_items oi ON oi.product_id = p.id
GROUP BY c.id, c.name
ORDER BY revenue DESC
LIMIT 1;

-- Query 10: Orders whose total is above the average order total (HAVING + subquery)
-- Học: GROUP BY, HAVING, scalar subquery
SELECT o.id AS order_id, o.customer_name, SUM(oi.line_total) AS order_total
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.customer_name
HAVING SUM(oi.line_total) > (
  -- average total across all orders
  SELECT AVG(t.total) FROM (
    SELECT SUM(line_total) AS total
    FROM order_items
    GROUP BY order_id
  ) t
)
ORDER BY order_total DESC;
