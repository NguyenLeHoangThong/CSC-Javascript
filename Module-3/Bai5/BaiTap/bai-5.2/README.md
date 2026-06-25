# Bài 5.2 — Movie Catalog (Prisma relation)

Bài lẻ luyện **quan hệ 1–nhiều** với Prisma: `Genre` 1 ──< `Movie`, dùng `include` để join.

## Chạy
```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev                   # http://localhost:3002
```

## Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/genres` | thể loại + số phim (`_count`) |
| GET | `/movies?genreId=1` | phim (kèm `genre`), lọc theo thể loại |
| POST | `/movies` | tạo `{ title, year, rating?, genreId }` |
| DELETE | `/movies/:id` | xóa phim |

## Ghi chú
- `include: { genre: true }` → mỗi movie kèm object genre liên quan (JOIN).
- `_count: { select: { movies: true } }` → đếm số phim trong mỗi genre.
- Kiểm tra `genreId` tồn tại trước khi tạo → trả 404 rõ ràng thay vì lỗi khóa ngoại thô.
