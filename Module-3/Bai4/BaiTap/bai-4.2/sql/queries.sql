-- ============================================================
-- Bài 4.2 — Employees queries. Run schema.sql first.
-- Focus: aggregates, HAVING, and window functions.
-- ============================================================

-- Q1: Each employee with department name (LEFT JOIN keeps Heidi)
SELECT e.full_name, d.name AS department, e.salary
FROM employees e
LEFT JOIN departments d ON d.id = e.department_id
ORDER BY e.full_name;

-- Q2: Average / min / max salary per department (GROUP BY + aggregates)
SELECT d.name AS department,
       COUNT(e.id) AS headcount,
       ROUND(AVG(e.salary), 2) AS avg_salary,
       MIN(e.salary) AS min_salary,
       MAX(e.salary) AS max_salary
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
GROUP BY d.id, d.name
ORDER BY avg_salary DESC NULLS LAST;

-- Q3: Departments whose average salary is above 2000 (HAVING)
SELECT d.name, ROUND(AVG(e.salary), 2) AS avg_salary
FROM departments d
JOIN employees e ON e.department_id = d.id
GROUP BY d.id, d.name
HAVING AVG(e.salary) > 2000;

-- Q4: Rank employees by salary WITHIN each department (RANK + PARTITION BY)
SELECT full_name, department, salary, salary_rank
FROM (
  SELECT e.full_name,
         d.name AS department,
         e.salary,
         RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS salary_rank
  FROM employees e
  JOIN departments d ON d.id = e.department_id
) ranked
ORDER BY department, salary_rank;

-- Q5: Each employee's salary vs the department average (window AVG)
SELECT e.full_name,
       d.name AS department,
       e.salary,
       ROUND(AVG(e.salary) OVER (PARTITION BY e.department_id), 2) AS dept_avg,
       ROUND(e.salary - AVG(e.salary) OVER (PARTITION BY e.department_id), 2) AS diff_from_avg
FROM employees e
JOIN departments d ON d.id = e.department_id
ORDER BY d.name, e.salary DESC;

-- Q6: Top earner of EACH department (window + filter via subquery)
SELECT full_name, department, salary
FROM (
  SELECT e.full_name,
         d.name AS department,
         e.salary,
         ROW_NUMBER() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS rn
  FROM employees e
  JOIN departments d ON d.id = e.department_id
) t
WHERE rn = 1;

-- Q7: Running total of salaries ordered by hire date (window SUM)
SELECT full_name, hired_on, salary,
       SUM(salary) OVER (ORDER BY hired_on) AS running_payroll
FROM employees
ORDER BY hired_on;
