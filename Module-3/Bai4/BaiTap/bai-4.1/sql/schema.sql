-- ============================================================
-- Bài 4.1 — Thư viện sách (PostgreSQL)
-- Run this file FIRST, then run queries.sql.
-- Practice: FK, CHECK, ENUM, JOIN, GROUP BY, LEFT JOIN ... IS NULL.
-- ============================================================

DROP TABLE IF EXISTS borrows CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TYPE  IF EXISTS borrow_status;

-- ENUM must be created BEFORE the table that uses it
CREATE TYPE borrow_status AS ENUM ('borrowing', 'returned', 'overdue');

CREATE TABLE authors (
  id          SERIAL       PRIMARY KEY,
  full_name   VARCHAR(100) NOT NULL,
  nationality VARCHAR(50),
  birth_year  INTEGER      CHECK (birth_year > 1800 AND birth_year < 2010),
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE books (
  id               SERIAL       PRIMARY KEY,
  title            VARCHAR(200) NOT NULL,
  author_id        INTEGER      REFERENCES authors(id) ON DELETE RESTRICT,
  genre            VARCHAR(50),
  published_year   INTEGER,
  total_copies     INTEGER      NOT NULL DEFAULT 1 CHECK (total_copies > 0),
  available_copies INTEGER      NOT NULL DEFAULT 1
    CHECK (available_copies >= 0 AND available_copies <= total_copies),
  created_at       TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE borrows (
  id             SERIAL        PRIMARY KEY,
  borrower_name  VARCHAR(100)  NOT NULL,
  borrower_email VARCHAR(150)  NOT NULL CHECK (borrower_email LIKE '%@%.%'),
  book_id        INTEGER       NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  borrowed_at    TIMESTAMPTZ   DEFAULT NOW(),
  due_date       TIMESTAMPTZ   NOT NULL CHECK (due_date > borrowed_at),
  returned_at    TIMESTAMPTZ,
  status         borrow_status DEFAULT 'borrowing'
);

-- ============================================================
-- Sample data
-- ============================================================
INSERT INTO authors (full_name, nationality, birth_year) VALUES
  ('Robert C. Martin',  'USA',         1952),
  ('Kyle Simpson',      'USA',         1977),
  ('Marijn Haverbeke',  'Netherlands', 1982),
  ('Chưa xuất bản',     'Vietnam',     1990); -- author with no books (LEFT JOIN demo)

INSERT INTO books (title, author_id, genre, published_year, total_copies, available_copies) VALUES
  ('Clean Code',          1, 'tech', 2008, 5, 3),
  ('Clean Architecture',  1, 'tech', 2017, 3, 3), -- never borrowed
  ('You Dont Know JS',    2, 'tech', 2015, 4, 2),
  ('Eloquent JavaScript', 3, 'tech', 2018, 6, 5);

INSERT INTO borrows (borrower_name, borrower_email, book_id, borrowed_at, due_date, returned_at, status) VALUES
  ('An',   'an@gmail.com',  1, '2026-05-01', '2026-05-15', '2026-05-10', 'returned'),
  ('Binh', 'binh@gmail.com',1, '2026-05-20', '2026-06-03', NULL,         'borrowing'),
  ('Chi',  'chi@gmail.com', 3, '2026-05-22', '2026-06-05', NULL,         'borrowing'),
  ('Dung', 'dung@gmail.com',4, '2026-04-01', '2026-04-15', '2026-04-30', 'overdue'),
  ('An',   'an@gmail.com',  3, '2026-03-01', '2026-03-15', '2026-03-14', 'returned');
