-- ============================================================
-- Bài 4.2 — CSC Shop seed: 5 categories, 20 products, 3 orders.
-- Run AFTER schema.sql.
-- ============================================================

INSERT INTO categories (name, slug) VALUES
  ('Điện thoại',    'phone'),
  ('Laptop',        'laptop'),
  ('Máy tính bảng', 'tablet'),
  ('Âm thanh',      'audio'),
  ('Phụ kiện',      'accessory');

-- 20 products, ~4 per category. category_id 1..5 theo thứ tự insert ở trên.
INSERT INTO products (title, price, thumbnail, brand, stock, rating, rating_count, category_id) VALUES
  -- phone (1)
  ('iPhone 15 Pro',       28990000, 'https://picsum.photos/seed/p1/400',  'Apple',   50, 4.8, 320, 1),
  ('Samsung Galaxy S24',  22990000, 'https://picsum.photos/seed/p2/400',  'Samsung', 30, 4.7, 210, 1),
  ('Google Pixel 8',      18990000, 'https://picsum.photos/seed/p3/400',  'Google',  25, 4.5, 150, 1),
  ('Xiaomi 14',           16990000, 'https://picsum.photos/seed/p4/400',  'Xiaomi',  40, 4.4, 180, 1),
  -- laptop (2)
  ('MacBook Air M2',      27990000, 'https://picsum.photos/seed/p5/400',  'Apple',   20, 4.9, 180, 2),
  ('Dell XPS 13',         22990000, 'https://picsum.photos/seed/p6/400',  'Dell',    15, 4.6, 140, 2),
  ('ASUS ROG Zephyrus',   35990000, 'https://picsum.photos/seed/p7/400',  'ASUS',    12, 4.5,  95, 2),
  ('Lenovo ThinkPad X1',  31990000, 'https://picsum.photos/seed/p8/400',  'Lenovo',  18, 4.6, 110, 2),
  -- tablet (3)
  ('iPad Pro 12.9',       23990000, 'https://picsum.photos/seed/p9/400',  'Apple',   25, 4.7, 260, 3),
  ('iPad Air',            16990000, 'https://picsum.photos/seed/p10/400', 'Apple',   35, 4.7, 240, 3),
  ('Galaxy Tab S9',       19990000, 'https://picsum.photos/seed/p11/400', 'Samsung', 20, 4.5, 120, 3),
  ('Xiaomi Pad 6',         8990000, 'https://picsum.photos/seed/p12/400', 'Xiaomi',  30, 4.3, 140, 3),
  -- audio (4)
  ('AirPods Pro 2',        5990000, 'https://picsum.photos/seed/p13/400', 'Apple',   80, 4.8, 540, 4),
  ('Sony WH-1000XM5',      8490000, 'https://picsum.photos/seed/p14/400', 'Sony',    45, 4.8, 410, 4),
  ('Bose QC Ultra',        9290000, 'https://picsum.photos/seed/p15/400', 'Bose',    30, 4.7, 200, 4),
  ('JBL Flip 6',           2490000, 'https://picsum.photos/seed/p16/400', 'JBL',    100, 4.5, 350, 4),
  -- accessory (5)
  ('Anker 65W Charger',     890000, 'https://picsum.photos/seed/p17/400', 'Anker',  120, 4.6, 410, 5),
  ('Spigen Tough Case',     390000, 'https://picsum.photos/seed/p18/400', 'Spigen', 200, 4.4, 300, 5),
  ('Samsung 25W PowerBank',1190000, 'https://picsum.photos/seed/p19/400', 'Samsung', 90, 4.3, 175, 5),
  ('Logitech MX Master 3', 2390000, 'https://picsum.photos/seed/p20/400', 'Logitech',60, 4.8, 220, 5);

-- 3 orders
INSERT INTO orders (user_name, user_email, user_phone, address, total_amount, status) VALUES
  ('Nguyễn Văn A', 'a@gmail.com', '0901234567', '123 Lê Lợi, Q1',        34980000, 'delivered'),
  ('Trần Thị B',   'b@gmail.com', '0912345678', '45 Hai Bà Trưng, Q3',   22990000, 'pending'),
  ('Lê Văn C',     'c@gmail.com', '0923456789', '67 Nguyễn Huệ, Q1',     27990000, 'confirmed');

-- order_items (snapshot title/price/thumbnail)
INSERT INTO order_items (order_id, product_id, title, price, quantity, thumbnail) VALUES
  (1, 1,  'iPhone 15 Pro',  28990000, 1, 'https://picsum.photos/seed/p1/400'),
  (1, 13, 'AirPods Pro 2',   5990000, 1, 'https://picsum.photos/seed/p13/400'),
  (2, 2,  'Samsung Galaxy S24', 22990000, 1, 'https://picsum.photos/seed/p2/400'),
  (3, 5,  'MacBook Air M2', 27990000, 1, 'https://picsum.photos/seed/p5/400');
