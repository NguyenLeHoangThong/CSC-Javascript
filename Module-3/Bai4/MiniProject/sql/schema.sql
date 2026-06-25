-- ============================================
-- MINI PROJECT - Module 3, Bai 4
-- School Management Database Schema
-- ============================================

-- Drop existing objects (if any)
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TYPE IF EXISTS student_status CASCADE;
DROP TYPE IF EXISTS letter_grade CASCADE;

-- ============================================
-- ENUM Types
-- ============================================
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
CREATE TYPE letter_grade AS ENUM ('A', 'B', 'C', 'D', 'F');

-- ============================================
-- Classes Table
-- ============================================
CREATE TABLE classes (
  id                  SERIAL          PRIMARY KEY,
  name                VARCHAR(100)    NOT NULL UNIQUE,
  description         TEXT,
  max_students        INTEGER         NOT NULL CHECK (max_students > 0),
  current_students    INTEGER         NOT NULL DEFAULT 0 CHECK (current_students >= 0),
  created_at          TIMESTAMPTZ     DEFAULT NOW()
);

-- ============================================
-- Students Table
-- ============================================
CREATE TABLE students (
  id                  SERIAL          PRIMARY KEY,
  full_name           VARCHAR(150)    NOT NULL,
  email               VARCHAR(100)    NOT NULL UNIQUE,
  phone               VARCHAR(20),
  date_of_birth       DATE,
  gpa                 NUMERIC(3,2)    NOT NULL CHECK (gpa >= 0 AND gpa <= 4.0),
  status              student_status  NOT NULL DEFAULT 'active',
  class_id            INTEGER         NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
  enrolled_at         TIMESTAMPTZ     DEFAULT NOW()
);

-- ============================================
-- Grades Table (with Generated Columns)
-- ============================================
CREATE TABLE grades (
  id                  SERIAL          PRIMARY KEY,
  student_id          INTEGER         NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject             VARCHAR(50)     NOT NULL,
  midterm             NUMERIC(4,1)    NOT NULL CHECK (midterm >= 0 AND midterm <= 10),
  final               NUMERIC(4,1)    NOT NULL CHECK (final >= 0 AND final <= 10),

  -- Generated Column: average score
  average             NUMERIC(4,2)    GENERATED ALWAYS AS
    (ROUND(midterm * 0.4 + final * 0.6, 2)) STORED,

  -- Generated Column: letter grade
  letter_grade        letter_grade    GENERATED ALWAYS AS (
    CASE
      WHEN midterm * 0.4 + final * 0.6 >= 8.5 THEN 'A'::letter_grade
      WHEN midterm * 0.4 + final * 0.6 >= 7.0 THEN 'B'::letter_grade
      WHEN midterm * 0.4 + final * 0.6 >= 5.5 THEN 'C'::letter_grade
      WHEN midterm * 0.4 + final * 0.6 >= 4.0 THEN 'D'::letter_grade
      ELSE 'F'::letter_grade
    END
  ) STORED,

  UNIQUE (student_id, subject),
  recorded_at         TIMESTAMPTZ     DEFAULT NOW()
);

-- ============================================
-- Sample Data
-- ============================================

-- Insert Classes
INSERT INTO classes (name, description, max_students) VALUES
('10A1', 'Lớp 10 Khối A - Khóa 2025', 40),
('10A2', 'Lớp 10 Khối A - Khóa 2025', 40),
('10B1', 'Lớp 10 Khối B - Khóa 2025', 35),
('11A1', 'Lớp 11 Khối A - Khóa 2024', 38);

-- Insert Students
INSERT INTO students (full_name, email, phone, date_of_birth, gpa, status, class_id) VALUES
('Nguyễn Văn A', 'van.a@school.edu', '0912345678', '2008-03-15', 8.5, 'active', 1),
('Trần Thị B', 'thi.b@school.edu', '0923456789', '2008-06-20', 9.0, 'active', 1),
('Phạm Đức C', 'duc.c@school.edu', '0934567890', '2008-01-10', 7.8, 'active', 1),
('Hoàng Minh D', 'minh.d@school.edu', '0945678901', '2008-11-05', 6.5, 'active', 1),
('Vũ Ngọc E', 'ngoc.e@school.edu', '0956789012', '2008-07-22', 8.2, 'active', 2),
('Lê Quang F', 'quang.f@school.edu', '0967890123', '2008-05-18', 7.0, 'active', 2),
('Đặng Hương G', 'huong.g@school.edu', '0978901234', '2008-09-30', 8.8, 'active', 2),
('Bùi Thanh H', 'thanh.h@school.edu', '0989012345', '2008-02-14', 5.5, 'inactive', 3),
('Cao Văn I', 'van.i@school.edu', '0990123456', '2008-04-28', 9.2, 'active', 3),
('Nông Xuân K', 'xuan.k@school.edu', '0901234567', '2007-10-12', 8.0, 'active', 4);

-- Insert Grades
INSERT INTO grades (student_id, subject, midterm, final) VALUES
-- Student 1 (Nguyễn Văn A)
(1, 'Mathematics', 8.5, 8.8),
(1, 'English', 7.5, 8.0),
(1, 'Programming', 9.0, 8.5),

-- Student 2 (Trần Thị B)
(2, 'Mathematics', 9.0, 9.2),
(2, 'English', 8.5, 9.0),
(2, 'Programming', 8.8, 9.5),

-- Student 3 (Phạm Đức C)
(3, 'Mathematics', 7.5, 8.0),
(3, 'English', 6.5, 7.5),
(3, 'Programming', 8.0, 8.5),

-- Student 4 (Hoàng Minh D)
(4, 'Mathematics', 6.0, 6.5),
(4, 'English', 5.0, 6.0),
(4, 'Programming', 7.0, 7.5),

-- Student 5 (Vũ Ngọc E)
(5, 'Mathematics', 8.0, 8.5),
(5, 'English', 7.5, 7.8),

-- Student 6 (Lê Quang F)
(6, 'Mathematics', 6.5, 7.0),
(6, 'English', 6.0, 7.5),
(6, 'Programming', 7.0, 7.0),

-- Student 7 (Đặng Hương G)
(7, 'Mathematics', 9.0, 8.8),
(7, 'English', 8.5, 9.0),
(7, 'Programming', 9.0, 9.2),

-- Student 8 (Bùi Thanh H)
(8, 'Mathematics', 5.0, 5.5),
(8, 'English', 4.5, 5.0),

-- Student 9 (Cao Văn I)
(9, 'Mathematics', 9.5, 9.0),
(9, 'English', 9.0, 9.5),
(9, 'Programming', 9.2, 9.8),

-- Student 10 (Nông Xuân K)
(10, 'Mathematics', 8.0, 8.2),
(10, 'English', 7.5, 8.0),
(10, 'Programming', 8.5, 8.0);

-- Update current_students for each class
UPDATE classes SET current_students = 4 WHERE id = 1;
UPDATE classes SET current_students = 3 WHERE id = 2;
UPDATE classes SET current_students = 2 WHERE id = 3;
UPDATE classes SET current_students = 1 WHERE id = 4;
