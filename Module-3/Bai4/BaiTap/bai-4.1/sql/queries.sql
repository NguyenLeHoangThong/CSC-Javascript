-- ============================================================
-- Bài 4.1 — Library queries. Run schema.sql first.
-- ============================================================

-- Q1: Every book with its author name (LEFT JOIN keeps the orphan book)
SELECT b.title, b.published, a.name AS author
FROM books b
LEFT JOIN authors a ON a.id = b.author_id
ORDER BY b.title;

-- Q2: Books published in 2015 or later (WHERE + ORDER BY)
SELECT title, published, copies
FROM books
WHERE published >= 2015
ORDER BY published DESC;

-- Q3: Number of books per author (GROUP BY + COUNT)
SELECT a.name, COUNT(b.id) AS book_count
FROM authors a
LEFT JOIN books b ON b.author_id = a.id
GROUP BY a.id, a.name
ORDER BY book_count DESC;

-- Q4: Loans not yet returned (IS NULL)
SELECT l.id, b.title, l.borrower, l.due_on, l.loan_days
FROM loans l
JOIN books b ON b.id = l.book_id
WHERE l.returned_on IS NULL
ORDER BY l.due_on;

-- Q5: Books returned LATE (returned_on > due_on)
SELECT b.title, l.borrower, l.due_on, l.returned_on
FROM loans l
JOIN books b ON b.id = l.book_id
WHERE l.returned_on IS NOT NULL AND l.returned_on > l.due_on;

-- Q6: Most borrowed books (GROUP BY + COUNT + LIMIT)
SELECT b.title, COUNT(l.id) AS times_borrowed
FROM books b
JOIN loans l ON l.book_id = b.id
GROUP BY b.id, b.title
ORDER BY times_borrowed DESC
LIMIT 3;

-- Q7: Authors with more than 1 book (HAVING)
SELECT a.name, COUNT(b.id) AS book_count
FROM authors a
JOIN books b ON b.author_id = a.id
GROUP BY a.id, a.name
HAVING COUNT(b.id) > 1;

-- Q8: Books that were never borrowed (LEFT JOIN + IS NULL)
SELECT b.title
FROM books b
LEFT JOIN loans l ON l.book_id = b.id
WHERE l.id IS NULL
ORDER BY b.title;
