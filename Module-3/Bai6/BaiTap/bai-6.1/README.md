# Bài 6.1 — API Quản lý Nhân viên (Prisma, production-ready)

**Bài tập độc lập** của Bài 6. Luyện middleware validate query, transaction khi xóa, và thống kê
bằng `groupBy`.

## 🎯 Kiến thức
- `validateQuery` (Yup) cho `GET /employees`: tự cast `"1"` → `1`, áp default
- `validateId` → lưu `res.locals.id`, handler không tự `parseInt` lại
- `buildMeta` (kèm `hasNext`/`hasPrev`) dùng chung cho list response
- Transaction xóa department: còn nhân viên → 409 (tự rollback)
- `GET /stats`: `count` + `aggregate` (avg/min/max salary) + `groupBy(departmentId)`

## 🚀 Chạy
```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev                  # http://localhost:3000
```

## 📡 Endpoints (`/api/v1`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/employees?departmentId=&status=&search=&sort=&order=&page=&limit=` | list + filter + sort + paginate |
| GET | `/employees/:id` | chi tiết (kèm department) |
| POST | `/employees` | tạo |
| PATCH | `/employees/:id` | cập nhật |
| DELETE | `/employees/:id` | xóa |
| GET | `/employees/stats` | thống kê (count/aggregate/groupBy) |
| GET | `/departments` | list (kèm `_count.employees`) |
| POST | `/departments` | tạo |
| DELETE | `/departments/:id` | chặn nếu còn nhân viên → 409 |

Filter `sort` ∈ `fullName|salary|startDate`, `order` ∈ `asc|desc`.

## ✅ Tự kiểm tra
```bash
curl "localhost:3000/api/v1/employees?sort=salary&order=desc&status=active"
curl localhost:3000/api/v1/employees/stats
curl -X DELETE localhost:3000/api/v1/departments/1   # còn nhân viên → 409
```

## ➡️ Buổi sau
Bài 6.2 — thêm **Order API** vào shop-backend với transaction (kiểm tra + trừ stock).
