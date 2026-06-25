-- ============================================================
-- Bài 4.1 — Library database (PostgreSQL)
-- Practice: foreign keys, JOIN, GROUP BY, IS NULL, generated column.
-- Run this file first, then run queries.sql.
-- ============================================================

DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

CREATE TABLE authors (
  id      SERIAL PRIMARY KEY,
  name    VARCHAR(120) NOT NULL,
  country VARCHAR(60)
);

CREATE TABLE books (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  author_id   INTEGER REFERENCES authors(id),
  published   INTEGER,                       -- publication year
  copies      INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE loans (
  id          SERIAL PRIMARY KEY,
  book_id     INTEGER NOT NULL REFERENCES books(id),
  borrower    VARCHAR(120) NOT NULL,
  borrowed_on DATE NOT NULL,
  due_on      DATE NOT NULL,
  returned_on DATE,                          -- NULL = still borrowed
  -- Generated column: how many days this loan lasts (or lasted)
  loan_days   INTEGER GENERATED ALWAYS AS (due_on - borrowed_on) STORED
);

-- ── Sample data ──
INSERT INTO authors (name, country) VALUES
  ('Robert C. Martin', 'USA'),
  ('Kyle Simpson', 'USA'),
  ('Marijn Haverbeke', 'Netherlands'),
  ('Unpublished Author', 'Vietnam');   -- author with no books (for IS NULL practice)

INSERT INTO books (title, author_id, published, copies) VALUES
  ('Clean Code', 1, 2008, 3),
  ('Clean Architecture', 1, 2017, 2),
  ('You Dont Know JS', 2, 2015, 4),
  ('Eloquent JavaScript', 3, 2018, 5),
  ('Orphan Book', NULL, 2000, 1);      -- book with no author

INSERT INTO loans (book_id, borrower, borrowed_on, due_on, returned_on) VALUES
  (1, 'An',  '2026-05-01', '2026-05-15', '2026-05-10'),
  (1, 'Binh','2026-05-20', '2026-06-03', NULL),         -- not returned
  (3, 'Chi', '2026-05-22', '2026-06-05', NULL),         -- not returned
  (4, 'Dung','2026-04-01', '2026-04-15', '2026-04-30'), -- returned late
  (3, 'An',  '2026-03-01', '2026-03-15', '2026-03-14');
