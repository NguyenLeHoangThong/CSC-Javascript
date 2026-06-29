-- ============================================================
-- Bài 4.2 — CSC Shop: thiết kế Database (PostgreSQL)
-- 4 bảng: categories, products, orders, order_items + trigger updated_at.
-- Đây là nền tảng SQL; Bài 5.2 sẽ khai báo lại bằng Prisma.
-- ============================================================

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TYPE  IF EXISTS order_status;

CREATE TYPE order_status AS ENUM ('pending','confirmed','shipping','delivered','cancelled');

CREATE TABLE categories (
  id         SERIAL       PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE products (
  id           SERIAL        PRIMARY KEY,
  title        VARCHAR(200)  NOT NULL,
  price        NUMERIC(15,2) NOT NULL CHECK (price > 0),
  thumbnail    TEXT          NOT NULL,
  description  TEXT,
  brand        VARCHAR(100),
  stock        INTEGER       NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating       NUMERIC(3,2)  DEFAULT 0,
  rating_count INTEGER       DEFAULT 0,
  category_id  INTEGER       NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at   TIMESTAMPTZ   DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE orders (
  id            SERIAL        PRIMARY KEY,
  user_name     VARCHAR(100)  NOT NULL,
  user_email    VARCHAR(150)  NOT NULL,
  user_phone    VARCHAR(15)   NOT NULL,
  address       TEXT          NOT NULL,
  province_code VARCHAR(20),
  ward_code     VARCHAR(20),
  delivery_date TIMESTAMPTZ,
  note          TEXT,
  total_amount  NUMERIC(15,2) NOT NULL,
  status        order_status  DEFAULT 'pending',
  created_at    TIMESTAMPTZ   DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE order_items (
  id         SERIAL        PRIMARY KEY,
  order_id   INTEGER       NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  product_id INTEGER       NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  title      VARCHAR(200)  NOT NULL,  -- snapshot: tên tại thời điểm đặt
  price      NUMERIC(15,2) NOT NULL,  -- snapshot: giá tại thời điểm đặt
  quantity   INTEGER       NOT NULL CHECK (quantity > 0),
  thumbnail  TEXT          NOT NULL
);

-- Trigger updated_at cho products (SQL thuần — Bài 5 sẽ thay bằng @updatedAt của Prisma)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
