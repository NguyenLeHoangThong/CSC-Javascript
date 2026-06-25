# Setup Guide - REST API with Prisma + PostgreSQL

**Yêu cầu**: Node.js 16+, PostgreSQL 12+, npm/yarn

---

## Bước 1: Chuẩn bị Database

### MacOS / Linux

```bash
# Khởi động PostgreSQL (nếu dùng Homebrew)
brew services start postgresql

# Hoặc khởi động server PostgreSQL service
```

### Windows

- Mở pgAdmin hoặc SQL Shell (psql)
- Đảm bảo PostgreSQL service đang chạy

### Tạo Database

```bash
# Kết nối PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE school_db;

# Xem danh sách database
\l

# Thoát
\q
```

---

## Bước 2: Cấu hình Project

### Clone/Navigate vào project

```bash
cd Module-3/Bai5/MiniProject
```

### Cài đặt Dependencies

```bash
npm install
```

### Cấu hình .env

```bash
cp .env.example .env
```

**Sửa file `.env`:**
```
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/school_db"
NODE_ENV="development"
PORT=3000
```

**Ghi chú:**
- Thay `PASSWORD` bằng password PostgreSQL của bạn
- Nếu PostgreSQL mặc định không có password: `postgresql://postgres@localhost:5432/school_db`

### Kiểm tra kết nối

```bash
npm run prisma:generate
```

Nếu thấy lỗi kết nối, kiểm tra:
1. PostgreSQL đã chạy chưa?
2. DATABASE_URL đúng chưa?
3. Username/password đúng chưa?

---

## Bước 3: Tạo Database Schema

```bash
# Tạo bảng (migrate)
npm run prisma:migrate

# Hoặc push schema (không migration history)
npx prisma db push
```

**Output mong đợi:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
✔ Introspection completed in 234ms
✔ Database introspection completed in 234ms
```

---

## Bước 4: Seeding Sample Data

```bash
npm run prisma:seed
```

**Output mong đợi:**
```
🌱 Seeding database...
✅ Database seeded successfully!
```

Bây giờ database đã có 6 students, 3 classes, và 7 grades!

---

## Bước 5: Chạy Server

### Development (auto-reload)

```bash
npm run dev
```

**Output mong đợi:**
```
Server running on http://localhost:3000
Health check: http://localhost:3000/health
```

### Production Build

```bash
npm run build
npm start
```

---

## Bước 6: Test API

### Kiểm tra Server

```bash
# Trong terminal khác
curl http://localhost:3000/health
```

**Response:**
```json
{"status":"ok"}
```

### Test GET Classes

```bash
curl http://localhost:3000/api/v1/classes
```

### Test GET Students

```bash
curl "http://localhost:3000/api/v1/students?page=1&limit=10"
```

### Test POST Create Student

```bash
curl -X POST http://localhost:3000/api/v1/students \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Phạm Thái Long",
    "email": "long.pt@school.edu",
    "classId": 1,
    "gpa": 8.0,
    "status": "active"
  }'
```

---

## Troubleshooting

### Lỗi: Could not connect to database

**Nguyên nhân:** PostgreSQL không chạy hoặc DATABASE_URL sai

**Giải pháp:**
```bash
# Kiểm tra PostgreSQL status
sudo systemctl status postgresql  # Linux
pg_isready                         # Mac
```

### Lỗi: "role 'postgres' does not exist"

```bash
# Tạo role mới
createuser -P your_username

# Cập nhật .env
DATABASE_URL="postgresql://your_username:password@localhost:5432/school_db"
```

### Lỗi: "database 'school_db' does not exist"

```bash
# Tạo database
createdb -U postgres school_db
```

### Lỗi: EADDRINUSE (Port already in use)

```bash
# Thay đổi PORT trong .env
PORT=3001
```

---

## Xem Database với Prisma Studio

```bash
npm run prisma:studio
```

Mở browser → `http://localhost:5555`

Tại đây bạn có thể:
- Xem toàn bộ data
- Thêm/sửa/xóa records
- Filter & sort data
- Xem relationships

---

## Rebuild Database

Nếu muốn xóa toàn bộ data và tạo lại từ đầu:

```bash
# ⚠️ Xóa tất cả data
npx prisma migrate reset

# Sau đó tự động seed lại sample data
```

---

## Summary Commands

```bash
# Cài dependencies
npm install

# Setup database
npm run prisma:migrate
npm run prisma:seed

# Chạy development
npm run dev

# Chạy production
npm run build
npm start

# Xem database trực quan
npm run prisma:studio

# Tạo lại từ đầu
npx prisma migrate reset
```

---

## API Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/classes` | Danh sách lớp |
| POST | `/api/v1/classes` | Tạo lớp |
| GET | `/api/v1/classes/:id` | Chi tiết lớp |
| GET | `/api/v1/students` | Danh sách sinh viên |
| POST | `/api/v1/students` | Tạo sinh viên |
| GET | `/api/v1/students/:id` | Chi tiết sinh viên |
| POST | `/api/v1/students/:id/grades` | Thêm điểm |
| GET | `/api/v1/students/:id/grades` | Danh sách điểm |

---

## Testing Tools

### Postman
- Import API endpoints vào Postman
- Test requests và responses

### VS Code REST Client
```bash
npm install -D rest-client
```

Tạo file `test.http`:
```http
### Get Classes
GET http://localhost:3000/api/v1/classes

### Create Student
POST http://localhost:3000/api/v1/students
Content-Type: application/json

{
  "fullName": "Test Student",
  "email": "test@school.edu",
  "classId": 1
}
```

Click "Send Request" để test

### curl (Command Line)
```bash
curl http://localhost:3000/api/v1/classes
curl -X POST http://localhost:3000/api/v1/classes \
  -H "Content-Type: application/json" \
  -d '{"name":"10A1","subject":"Math","teacherName":"Mr X","maxStudents":40}'
```

---

## Xem Logs

### Prisma Logs
Tự động được bật trong `.env` với `NODE_ENV=development`

### Express Logs
Server sẽ log tất cả requests:
```
GET /api/v1/classes 200 45ms
POST /api/v1/students 201 120ms
```

---

## Tiếp theo

Sau khi setup thành công, có thể:
1. ✅ Test tất cả API endpoints
2. ✅ Thêm/sửa/xóa data
3. ✅ Kiểm tra validation
4. ✅ Xem calculated fields (average, letterGrade)
5. ✅ Test pagination & filtering
6. ✅ Học cách Prisma hoạt động

---

**Chúc bạn thành công! 🚀**
