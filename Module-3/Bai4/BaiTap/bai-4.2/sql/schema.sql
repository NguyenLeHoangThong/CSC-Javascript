-- ============================================================
-- Bài 4.2 — Employees & Departments (PostgreSQL)
-- Practice: aggregates, HAVING, and WINDOW functions.
-- Run this file first, then run queries.sql.
-- ============================================================

DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

CREATE TABLE departments (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL
);

CREATE TABLE employees (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  salary        NUMERIC(10, 2) NOT NULL,
  hired_on      DATE NOT NULL
);

INSERT INTO departments (name) VALUES
  ('Engineering'), ('Sales'), ('Marketing'), ('Operations'); -- Operations has no employees

INSERT INTO employees (full_name, department_id, salary, hired_on) VALUES
  ('Alice',  1, 2500, '2022-01-10'),
  ('Bob',    1, 1800, '2023-03-15'),
  ('Carol',  1, 3200, '2021-06-01'),
  ('Dave',   2, 1500, '2023-07-20'),
  ('Erin',   2, 2100, '2022-11-05'),
  ('Frank',  3, 1700, '2024-02-12'),
  ('Grace',  3, 1700, '2023-09-30'),
  ('Heidi',  NULL, 1900, '2024-05-01');  -- no department
