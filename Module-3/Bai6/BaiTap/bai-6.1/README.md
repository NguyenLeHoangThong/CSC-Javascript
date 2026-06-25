# Bài 6.1 — Blog pagination / filter / search / sort

Bài lẻ luyện **phân trang + lọc + tìm kiếm + sắp xếp** ngay trong DB bằng Prisma.

## Chạy
```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name init
npm run prisma:seed          # 25 bài post
npm run dev                  # http://localhost:3001
```

## Endpoint
`GET /posts?search=&published=&sort=views&order=desc&page=1&limit=10`

Trả về:
```json
{ "data": [...], "meta": { "total": 25, "page": 1, "limit": 10, "pages": 3, "hasNext": true, "hasPrev": false } }
```

## Thử
```bash
curl "localhost:3001/posts?published=true&sort=views&order=desc&page=2&limit=5"
curl "localhost:3001/posts?search=number%201"
```

## Ghi chú
- `skip = (page-1)*limit`, `take = limit` → phân trang.
- `where` ghép động: chỉ thêm điều kiện khi filter có giá trị.
- `$transaction([findMany, count])` lấy data + tổng số trong 1 lần.
