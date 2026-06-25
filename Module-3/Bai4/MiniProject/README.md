# Mini Project - Module 3, Bài 4: SQL Queries Practice

## Mô tả
Dự án này là bài tập thực hành SQL, tập trung vào:
- **Tạo schema cơ sở dữ liệu** với các bảng liên quan (classes, students, grades)
- **Generated Columns** để tự động tính toán điểm trung bình và xếp loại
- **10 câu truy vấn SQL** sử dụng các kỹ thuật khác nhau:
  - LEFT JOIN
  - WHERE + ORDER BY
  - GROUP BY + Aggregation
  - Window Functions (RANK, PARTITION BY)
  - Subqueries
  - HAVING
  - IS NULL

---

## Cấu trúc Files

```
MiniProject/
├── sql/
│   ├── schema.sql      # Tạo bảng và dữ liệu mẫu
│   └── queries.sql     # 10 câu truy vấn
└── README.md           # Tài liệu này
```

---

## Hướng dẫn Chạy

### Yêu cầu
- PostgreSQL (phiên bản 10+)
- TablePlus hoặc psql command-line tool

### Cách 1: Sử dụng psql (Command Line)

```bash
# Tạo database mới (nếu chưa có)
createdb school_db

# Chạy schema.sql (tạo bảng + dữ liệu mẫu)
psql -U postgres -d school_db -f sql/schema.sql

# Chạy queries.sql (xem kết quả 10 câu truy vấn)
psql -U postgres -d school_db -f sql/queries.sql
```

### Cách 2: Sử dụng TablePlus

1. Kết nối tới PostgreSQL trong TablePlus
2. Mở file `sql/schema.sql`
3. Chạy toàn bộ file (Cmd+Enter hoặc Ctrl+Enter)
4. Mở file `sql/queries.sql`
5. Chạy từng câu truy vấn một (highlight + Cmd+Enter)

---

## Schema Cơ sở dữ liệu

### ENUM Types
```sql
-- Student status
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');

-- Grade letter
CREATE TYPE letter_grade AS ENUM ('A', 'B', 'C', 'D', 'F');
```

### Các Bảng

#### 1. **classes** - Thông tin lớp học
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR) - Tên lớp, unique
- `description` (TEXT)
- `max_students` (INTEGER)
- `current_students` (INTEGER) - Số sinh viên hiện tại

#### 2. **students** - Thông tin sinh viên
- `id` (SERIAL PRIMARY KEY)
- `full_name` (VARCHAR)
- `email` (VARCHAR) - Unique
- `phone` (VARCHAR)
- `date_of_birth` (DATE)
- `gpa` (NUMERIC 0-4.0)
- `status` (student_status enum)
- `class_id` (FOREIGN KEY) - Tham chiếu lớp

#### 3. **grades** - Bảng điểm (có Generated Columns)
- `id` (SERIAL PRIMARY KEY)
- `student_id` (FOREIGN KEY)
- `subject` (VARCHAR) - Môn học
- `midterm` (NUMERIC 0-10)
- `final` (NUMERIC 0-10)
- **`average`** (GENERATED) - `midterm * 0.4 + final * 0.6`
- **`letter_grade`** (GENERATED) - A/B/C/D/F dựa trên average
  - A: >= 8.5
  - B: >= 7.0
  - C: >= 5.5
  - D: >= 4.0
  - F: < 4.0

---

## 10 Câu Truy vấn

### Query 1: Danh sách tất cả students kèm tên lớp (LEFT JOIN)
```sql
SELECT s.full_name, s.email, s.gpa, s.status, c.name AS class_name
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
ORDER BY s.full_name;
```
**Học:** LEFT JOIN, ORDER BY

---

### Query 2: Students có gpa >= 8.0
```sql
SELECT full_name, email, gpa, status
FROM students
WHERE gpa >= 8.0
ORDER BY gpa DESC;
```
**Học:** WHERE, ORDER BY

---

### Query 3: Thống kê GPA theo lớp
```sql
SELECT c.name, c.current_students, ROUND(AVG(s.gpa), 2) AS avg_gpa
FROM classes c
LEFT JOIN students s ON c.id = s.class_id
GROUP BY c.id, c.name, c.current_students
ORDER BY avg_gpa DESC;
```
**Học:** GROUP BY, AVG(), Aggregation

---

### Query 4: Lớp còn chỗ trống
```sql
SELECT name, max_students, current_students, 
       (max_students - current_students) AS available_slots
FROM classes
WHERE current_students < max_students
ORDER BY available_slots DESC;
```
**Học:** WHERE, Column Calculation

---

### Query 5: Thống kê letter_grade
```sql
SELECT letter_grade, COUNT(*) AS total_count
FROM grades
GROUP BY letter_grade
ORDER BY letter_grade;
```
**Học:** GROUP BY, COUNT()

---

### Query 6: Students có điểm 'Programming' >= 7.0
```sql
SELECT s.full_name, s.email, g.subject, g.average, g.letter_grade
FROM students s
JOIN grades g ON s.id = g.student_id
WHERE g.subject = 'Programming' AND g.average >= 7.0
ORDER BY g.average DESC;
```
**Học:** INNER JOIN, WHERE

---

### Query 7: Students chưa có bất kỳ bản ghi điểm nào
```sql
SELECT s.full_name, s.email, s.gpa, c.name
FROM students s
LEFT JOIN grades g ON s.id = g.student_id
LEFT JOIN classes c ON s.class_id = c.id
WHERE g.id IS NULL
GROUP BY s.id, s.full_name, s.email, s.gpa, c.id, c.name
ORDER BY s.full_name;
```
**Học:** LEFT JOIN, IS NULL, GROUP BY

---

### Query 8: Top 3 students GPA cao nhất của từng lớp
```sql
SELECT ranked.full_name, ranked.class_name, ranked.gpa, ranked.rank
FROM (
  SELECT s.full_name, c.name AS class_name, s.gpa,
         RANK() OVER (PARTITION BY s.class_id ORDER BY s.gpa DESC) AS rank
  FROM students s
  JOIN classes c ON s.class_id = c.id
) ranked
WHERE rank <= 3
ORDER BY ranked.class_name, ranked.rank;
```
**Học:** Window Function, RANK(), PARTITION BY, Subquery

---

### Query 9: Lớp nào có GPA trung bình cao nhất?
```sql
SELECT c.name, ROUND(AVG(s.gpa), 2) AS avg_class_gpa, COUNT(s.id)
FROM classes c
JOIN students s ON c.id = s.class_id
GROUP BY c.id, c.name
ORDER BY avg_class_gpa DESC
LIMIT 1;
```
**Học:** GROUP BY, LIMIT 1

---

### Query 10: Students có tất cả các môn đều đạt (average >= 5.0)
```sql
SELECT s.full_name, s.email, c.name, COUNT(DISTINCT g.subject) AS total_subjects,
       MIN(g.average) AS min_average
FROM students s
JOIN classes c ON s.class_id = c.id
JOIN grades g ON s.id = g.student_id
GROUP BY s.id, s.full_name, s.email, c.id, c.name
HAVING MIN(g.average) >= 5.0
ORDER BY min_average DESC;
```
**Học:** GROUP BY, HAVING, MIN(), COUNT(DISTINCT)

---

## Dữ liệu Mẫu

### Classes
- **10A1** - Lớp 10 Khối A, max 40 sinh viên, 4 hiện tại
- **10A2** - Lớp 10 Khối A, max 40 sinh viên, 3 hiện tại
- **10B1** - Lớp 10 Khối B, max 35 sinh viên, 2 hiện tại
- **11A1** - Lớp 11 Khối A, max 38 sinh viên, 1 hiện tại

### Students (10 học sinh)
- 10 sinh viên với GPA từ 5.5 đến 9.2
- Trạng thái: active, inactive, graduated

### Grades (28 bản ghi)
- Các môn: Mathematics, English, Programming
- Midterm + Final → Average (tính tự động) → Letter Grade (tính tự động)
- Một số sinh viên không có bản ghi điểm

---

## Tips Khi Chạy Queries

1. **Chạy từng query một** trong TablePlus để dễ xem kết quả
2. **Kiểm tra Generated Columns**: Những cột `average` và `letter_grade` được tính tự động
3. **Thử sửa WHERE clause**: Ví dụ thay `>= 8.0` thành `>= 7.0` để xem kết quả thay đổi
4. **Thêm dữ liệu mới**: 
   ```sql
   INSERT INTO students (full_name, email, gpa, status, class_id)
   VALUES ('Tên học sinh', 'email@school.edu', 8.5, 'active', 1);
   ```
5. **Xem kết quả DESC**: Dữ liệu được sắp xếp từ cao xuống thấp (descending)

---

## Lưu ý

- File `schema.sql` **DROP các bảng cũ** trước khi tạo mới (cho mục đích test)
- Generated Columns là **STORED**, nghĩa là giá trị được lưu trong database
- Constraint `UNIQUE (student_id, subject)` đảm bảo mỗi học sinh chỉ có 1 bản ghi điểm/môn

---

## References

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Generated Columns: https://www.postgresql.org/docs/current/ddl-generated-columns.html
- Window Functions: https://www.postgresql.org/docs/current/functions-window.html
