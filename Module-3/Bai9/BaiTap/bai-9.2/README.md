# Bài 9.2 — API docs với Swagger UI

Bài lẻ luyện viết **OpenAPI 3 spec** và phục vụ tài liệu tương tác bằng `swagger-ui-express`.

## Chạy
```bash
npm install
cp .env.example .env
npm run dev    # http://localhost:3006
```

Mở **http://localhost:3006/api-docs** để xem & thử API ngay trên trình duyệt.

## Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/items` | danh sách item |
| POST | `/items` | tạo item `{ name }` |
| GET | `/api-docs` | Swagger UI |

## Ghi chú
- `swaggerSpec` là object OpenAPI 3 — khai báo `paths`, `components.schemas`, rồi `swaggerUi.setup(spec)`.
- Nút **Try it out** trong Swagger UI gọi thẳng API thật → tiện test không cần Postman.
