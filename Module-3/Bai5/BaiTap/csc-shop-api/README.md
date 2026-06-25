# CSC Shop API — Bài 5: Prisma ORM + CRUD

Khởi tạo backend cho **CSC Shop** (cửa hàng điện thoại/laptop). Đây là buổi đầu tiên của
chuỗi bài tập CSC Shop xuyên suốt Module 3 — các buổi sau sẽ bổ sung dần: query nâng cao
(Bài 6), authentication (Bài 7), authorization (Bài 8) và frontend đầy đủ (Bài 9).

## 🎯 Kiến thức buổi này

- Khởi tạo Prisma + PostgreSQL, viết `schema.prisma`
- Quan hệ 1–nhiều: `Category` 1 ──< `Product` nhiều
- CRUD đầy đủ với Prisma Client (`findMany`, `findUnique`, `create`, `update`, `delete`)
- Kiến trúc tách lớp: **routes → middleware → controllers → services → db**
- Validation bằng Yup, error handling tập trung
- Kiểu `Decimal` cho tiền tệ (không bao giờ dùng Float cho giá)

## 📁 Cấu trúc

```
csc-shop-api/
├── prisma/
│   ├── schema.prisma        # Category + Product
│   └── seed.ts              # 4 categories + 12 products
├── src/
│   ├── controllers/         # categoryController, productController
│   ├── services/            # business logic + Prisma queries
│   ├── routes/              # categoryRoutes, productRoutes
│   ├── middleware/          # validate, errorHandler
│   ├── schemas/             # Yup validation schemas
│   ├── utils/               # pagination, slug helpers
│   ├── types/               # ApiResponse, AppError
│   ├── db/prisma.ts         # shared PrismaClient
│   └── index.ts             # Express app
└── .env.example
```

## 🚀 Chạy thử

```bash
npm install
cp .env.example .env          # sửa DATABASE_URL cho đúng máy bạn
npm run prisma:migrate -- --name init   # tạo bảng
npm run prisma:seed           # nạp dữ liệu mẫu
npm run dev                   # http://localhost:3000
```

## 📡 Endpoints

Base URL: `/api/v1`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/categories` | Danh sách category (kèm số product) |
| GET | `/categories/:id` | Chi tiết 1 category |
| POST | `/categories` | Tạo category (slug tự sinh từ name) |
| PATCH | `/categories/:id` | Cập nhật category |
| DELETE | `/categories/:id` | Xóa (chặn nếu còn product → 409) |
| GET | `/products` | Danh sách product |
| GET | `/products/:id` | Chi tiết product |
| POST | `/products` | Tạo product |
| PATCH | `/products/:id` | Cập nhật product |
| DELETE | `/products/:id` | Xóa product |

### Ví dụ tạo product

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 16 Pro",
    "description": "Newest flagship",
    "price": 1099,
    "thumbnail": "https://picsum.photos/seed/ip16/400",
    "brand": "Apple",
    "stock": 50,
    "categoryId": 1
  }'
```

## 🔎 Ghi chú cho học viên

- `serialize()` trong `productService` chuyển `Decimal` → `number` để frontend dùng trực tiếp.
- `slugify()` sinh slug từ title — đảm bảo URL đẹp và unique.
- Mọi route hiện đang **mở** (chưa cần đăng nhập). Bài 7 & 8 sẽ thêm bảo mật.

## ➡️ Buổi sau (Bài 6)

Thêm phân trang / lọc / tìm kiếm / sắp xếp cho `/products`, thống kê (aggregate), và
tạo đơn hàng bằng **transaction** (trừ tồn kho an toàn).
