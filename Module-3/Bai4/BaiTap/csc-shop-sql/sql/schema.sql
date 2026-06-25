-- ============================================================
-- CSC Shop — Bài 4: SQL schema + sample data (PostgreSQL)
-- Run this file FIRST, then run queries.sql.
-- It drops old tables so you can re-run it any time while practising.
-- ============================================================

-- Drop in dependency order (children before parents)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TYPE IF EXISTS order_status;

-- Enum for the order lifecycle
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'completed', 'cancelled');

-- ── Categories ──────────────────────────────────────────────
CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(255)
);

-- ── Products ────────────────────────────────────────────────
CREATE TABLE products (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  slug         VARCHAR(220) UNIQUE NOT NULL,
  price        NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock        INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating       NUMERIC(2, 1) NOT NULL DEFAULT 0,
  category_id  INTEGER NOT NULL REFERENCES categories(id)
);

-- ── Orders ──────────────────────────────────────────────────
CREATE TABLE orders (
  id            SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  status        order_status NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Order items ─────────────────────────────────────────────
-- line_total is a GENERATED column: PostgreSQL computes it automatically
-- from quantity * unit_price and STORES it (you never insert it yourself).
CREATE TABLE order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10, 2) NOT NULL,
  line_total  NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- ============================================================
-- Sample data
-- ============================================================
INSERT INTO categories (slug, name, description) VALUES
  ('smartphones', 'Smartphones', 'Latest phones'),
  ('laptops', 'Laptops', 'Work and gaming laptops'),
  ('tablets', 'Tablets', 'Tablets and 2-in-1s'),
  ('mobile-accessories', 'Mobile Accessories', 'Cases, chargers, audio');

INSERT INTO products (title, slug, price, stock, rating, category_id) VALUES
  ('iPhone 15 Pro',        'iphone-15-pro',        999.00, 40, 4.8, 1),
  ('Samsung Galaxy S24',   'samsung-galaxy-s24',   899.00, 30, 4.7, 1),
  ('Google Pixel 8',       'google-pixel-8',       699.00, 25, 4.5, 1),
  ('MacBook Pro 14',       'macbook-pro-14',      1999.00, 18, 4.9, 2),
  ('Dell XPS 15',          'dell-xps-15',         1499.00, 22, 4.6, 2),
  ('iPad Air',             'ipad-air',             599.00, 35, 4.7, 3),
  ('Galaxy Tab S9',        'galaxy-tab-s9',        799.00, 20, 4.5, 3),
  ('AirPods Pro 2',        'airpods-pro-2',        249.00, 80, 4.8, 4),
  ('Anker 65W Charger',    'anker-65w-charger',     39.00, 120, 4.6, 4),
  ('Spigen Case',          'spigen-case',           19.00, 200, 4.4, 4),
  -- A product that has never been ordered (used by Query 7)
  ('Power Bank 10000',     'power-bank-10000',      49.00, 90, 4.3, 4);

INSERT INTO orders (customer_name, email, status) VALUES
  ('Nguyen Van A', 'a@gmail.com', 'completed'),  -- order 1
  ('Tran Thi B',   'b@gmail.com', 'completed'),  -- order 2
  ('Le Van C',     'c@gmail.com', 'pending'),    -- order 3
  ('Pham Thi D',   'd@gmail.com', 'cancelled');  -- order 4

-- order_items: do NOT insert line_total — it is generated.
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 999.00),   -- iPhone 15 Pro
  (1, 8, 2, 249.00),   -- AirPods Pro 2 x2
  (2, 4, 1, 1999.00),  -- MacBook Pro 14
  (2, 9, 1, 39.00),    -- Anker charger
  (3, 6, 1, 599.00),   -- iPad Air
  (3, 10, 3, 19.00),   -- Spigen case x3
  (4, 2, 1, 899.00);   -- Galaxy S24 (cancelled order)
