# Bài 5.1 — API Quản lý Khoá học (Prisma)

**Bài tập độc lập** của Bài 5. Luyện Prisma ORM với quan hệ, `include`, `_count`, unique constraint
và kiến trúc tách lớp (routes → middleware → controllers → services → db).

## 🎯 Kiến thức
- Quan hệ: `Category` 1──< `Course` 1──< `Enrollment`
- `include` + `_count` để lấy dữ liệu liên quan trong 1 query
- Unique `@@unique([studentEmail, courseId])` → chặn đăng ký trùng (Prisma `P2002` → 409)
- Chặn xóa khi còn dữ liệu liên kết (đếm enrollment trước khi xóa → 409)
- Validate body + query bằng Yup; error handler tập trung (AppError / ValidationError / Prisma codes)

## 🗂️ Cấu trúc
```
bai-5.1/
├── prisma/{schema.prisma, seed.ts}
└── src/
    ├── db/prisma.ts
    ├── types/api.ts            # ApiResponse, AppError
    ├── utils/pagination.ts     # buildMeta
    ├── middleware/{errorHandler, validate}.ts
    ├── schemas/courseSchema.ts
    ├── services/courseService.ts
    ├── controllers/courseController.ts
    ├── routes/courseRoutes.ts
    └── index.ts
```

## 🚀 Chạy
```bash
npm install
cp .env.example .env          # sửa DATABASE_URL
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev                   # http://localhost:3000
```

## 📡 Endpoints (`/api/v1`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/courses?categoryId=&status=&search=&page=&limit=` | danh sách + filter + phân trang |
| GET | `/courses/:id` | chi tiết (kèm `category`, `_count.enrollments`) |
| POST | `/courses` | tạo (validate Yup) |
| PATCH | `/courses/:id` | cập nhật một phần |
| DELETE | `/courses/:id` | chặn nếu còn enrollment → 409 |
| POST | `/courses/:id/enroll` | đăng ký học viên; trùng email+course → 409 |

## ✅ Tự kiểm tra
```bash
# Đăng ký 2 lần cùng email vào 1 course → lần 2 trả 409
curl -X POST localhost:3000/api/v1/courses/1/enroll -H "Content-Type: application/json" -d '{"studentName":"An","studentEmail":"an@gmail.com"}'
curl -X POST localhost:3000/api/v1/courses/1/enroll -H "Content-Type: application/json" -d '{"studentName":"An","studentEmail":"an@gmail.com"}'
# Xóa course còn học viên → 409
curl -X DELETE localhost:3000/api/v1/courses/1
```

## ➡️ Buổi sau
Bài 5.2 — chuyển **CSC Shop** từ file JSON sang Prisma.
