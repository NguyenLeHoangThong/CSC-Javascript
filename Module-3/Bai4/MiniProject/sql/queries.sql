-- ============================================
-- MINI PROJECT - Module 3, Bai 4
-- SQL Queries Practice (10 queries)
-- ============================================

-- ============================================
-- QUERY 1: Danh sách tất cả students kèm tên lớp (LEFT JOIN)
-- Hiển thị: full_name, email, gpa, status, class_name
-- ============================================
SELECT
  s.full_name,
  s.email,
  s.gpa,
  s.status,
  c.name AS class_name
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
ORDER BY s.full_name;

-- ============================================
-- QUERY 2: Students có gpa >= 8.0, sắp xếp giảm dần theo gpa
-- ============================================
SELECT
  full_name,
  email,
  gpa,
  status
FROM students
WHERE gpa >= 8.0
ORDER BY gpa DESC;

-- ============================================
-- QUERY 3: Mỗi lớp: tên lớp, số students hiện tại, gpa trung bình
-- ============================================
SELECT
  c.name AS class_name,
  c.current_students,
  ROUND(AVG(s.gpa), 2) AS avg_gpa
FROM classes c
LEFT JOIN students s ON c.id = s.class_id
GROUP BY c.id, c.name, c.current_students
ORDER BY avg_gpa DESC;

-- ============================================
-- QUERY 4: Lớp còn chỗ trống (current_students < max_students)
-- Hiển thị: class_name, max_students, current_students, available_slots
-- ============================================
SELECT
  name AS class_name,
  max_students,
  current_students,
  (max_students - current_students) AS available_slots
FROM classes
WHERE current_students < max_students
ORDER BY available_slots DESC;

-- ============================================
-- QUERY 5: Thống kê letter_grade toàn trường
-- Mỗi loại A/B/C/D/F có bao nhiêu bản ghi
-- ============================================
SELECT
  letter_grade,
  COUNT(*) AS total_count
FROM grades
GROUP BY letter_grade
ORDER BY
  CASE letter_grade
    WHEN 'A' THEN 1
    WHEN 'B' THEN 2
    WHEN 'C' THEN 3
    WHEN 'D' THEN 4
    WHEN 'F' THEN 5
  END;

-- ============================================
-- QUERY 6: Students có điểm môn 'programming' và average >= 7.0
-- ============================================
SELECT
  s.full_name,
  s.email,
  g.subject,
  g.midterm,
  g.final,
  g.average,
  g.letter_grade
FROM students s
JOIN grades g ON s.id = g.student_id
WHERE g.subject = 'Programming' AND g.average >= 7.0
ORDER BY g.average DESC;

-- ============================================
-- QUERY 7: Students chưa có bất kỳ bản ghi điểm nào (LEFT JOIN + IS NULL)
-- ============================================
SELECT
  s.full_name,
  s.email,
  s.gpa,
  c.name AS class_name
FROM students s
LEFT JOIN grades g ON s.id = g.student_id
LEFT JOIN classes c ON s.class_id = c.id
WHERE g.id IS NULL
GROUP BY s.id, s.full_name, s.email, s.gpa, c.id, c.name
ORDER BY s.full_name;

-- ============================================
-- QUERY 8: Top 3 students gpa cao nhất của từng lớp
-- Gợi ý: dùng RANK() OVER (PARTITION BY class_id ORDER BY gpa DESC)
-- ============================================
SELECT
  ranked.full_name,
  ranked.class_name,
  ranked.gpa,
  ranked.rank
FROM (
  SELECT
    s.full_name,
    c.name AS class_name,
    s.gpa,
    RANK() OVER (PARTITION BY s.class_id ORDER BY s.gpa DESC) AS rank
  FROM students s
  JOIN classes c ON s.class_id = c.id
) ranked
WHERE rank <= 3
ORDER BY ranked.class_name, ranked.rank;

-- ============================================
-- QUERY 9: Lớp nào có GPA trung bình cao nhất?
-- ============================================
SELECT
  c.name AS class_name,
  ROUND(AVG(s.gpa), 2) AS avg_class_gpa,
  COUNT(s.id) AS student_count
FROM classes c
JOIN students s ON c.id = s.class_id
GROUP BY c.id, c.name
ORDER BY avg_class_gpa DESC
LIMIT 1;

-- ============================================
-- QUERY 10: Students có tất cả các môn đều đạt (average >= 5.0)
-- ============================================
SELECT
  s.full_name,
  s.email,
  c.name AS class_name,
  COUNT(DISTINCT g.subject) AS total_subjects,
  MIN(g.average) AS min_average
FROM students s
JOIN classes c ON s.class_id = c.id
JOIN grades g ON s.id = g.student_id
GROUP BY s.id, s.full_name, s.email, c.id, c.name
HAVING MIN(g.average) >= 5.0
ORDER BY min_average DESC;
