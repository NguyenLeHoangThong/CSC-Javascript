# Production-Ready REST API - Module 3, Bài 8

School management REST API với **Authentication + Authorization** đầy đủ — built với **Prisma ORM**, **PostgreSQL**, **Express.js**, và **TypeScript**. Kế thừa toàn bộ hệ thống đăng nhập JWT từ Bài 7 và bổ sung phân quyền **RBAC** (theo vai trò) + **Ownership** (theo chủ sở hữu) + quản lý user.

## ✨ Key Features

🛡️ **RBAC** - `authorize(...roles)` — chỉ admin được tạo/sửa/xóa students & classes  
🛡️ **Ownership** - `authorizeOwner(getOwnerId)` — chính chủ sửa profile, admin bypass  
🛡️ **Self-protection** - Admin không thể tự đổi role / tự xóa tài khoản mình  
🛡️ **User Management** - GET/PATCH/DELETE users + đổi role (admin only)  
🔐 **JWT Authentication** - Register, Login, Refresh token rotation, Logout  
🔐 **bcrypt Password Hashing** - saltRounds=12, không bao giờ lưu plain text  
🔐 **Access + Refresh Token** - Access ngắn hạn (15m) + Refresh dài hạn (7d)  
✅ **Production Architecture** - Middleware, services, controllers, validators separation  
✅ **Comprehensive Error Handling** - 401 / 403 / 404 / 409 phân biệt rõ ràng  
✅ **Pagination & Filtering** - buildMeta(), buildSkip() utilities  
✅ **Type Safety** - Full TypeScript coverage  
✅ **Seed Data** - 1 admin + 3 users, 3 classes, 6 students, 7 grades  

---

## 📁 Project Structure

```
MiniProject/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── authController.ts   # 🔐 register, login, me, refresh, logout
│   │   ├── userController.ts   # 🛡️ list/get/update/role/delete users
│   │   ├── classController.ts
│   │   ├── studentController.ts
│   │   ├── gradeController.ts
│   │   └── statsController.ts
│   ├── services/             # Business logic
│   │   ├── authService.ts     # 🔐 hash/verify password, ký & verify JWT
│   │   ├── userService.ts     # 🛡️ user CRUD + self-protection
│   │   ├── classService.ts
│   │   ├── studentService.ts
│   │   ├── gradeService.ts
│   │   └── statsService.ts
│   ├── routes/               # API endpoints
│   │   ├── authRoutes.ts      # 🔐 /register /login /me /refresh /logout
│   │   ├── userRoutes.ts      # 🛡️ /users (RBAC + ownership)
│   │   ├── classRoutes.ts     # GET public · POST/PATCH/DELETE admin
│   │   ├── studentRoutes.ts   # GET public · POST/PATCH/DELETE admin
│   │   └── statsRoutes.ts
│   ├── middleware/           # Middleware
│   │   ├── authenticate.ts   # 🔐 Kiểm tra JWT, gắn req.user
│   │   ├── authorize.ts      # 🛡️ RBAC — authorize(...roles)
│   │   ├── authorizeOwner.ts # 🛡️ Ownership — admin bypass
│   │   ├── validate.ts       # Body, query, param validation
│   │   └── errorHandler.ts   # Global error handling
│   ├── schemas/              # Yup validation schemas
│   │   ├── authSchema.ts     # 🔐 registerSchema, loginSchema, refreshSchema
│   │   ├── userSchema.ts     # 🛡️ updateProfile, updateRole, userQuery
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   └── pagination.ts
│   ├── types/                # TypeScript types
│   │   └── api.ts
│   ├── db/                   # Database
│   │   └── prisma.ts
│   └── index.ts              # Express app entry
├── prisma/
│   ├── schema.prisma         # Data model (User + Class + Student + Grade)
│   └── seed.ts               # Sample data (1 admin + 3 users, 3 classes, 6 students, 7 grades)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🚀 Quick Start

### 1. Install & Setup

```bash
npm install
cp .env.example .env           # Update DATABASE_URL + JWT secrets
npx prisma migrate dev --name add_user_model   # Create schema
npx prisma db seed             # Seed 1 admin + 3 users, classes, students, grades
npm run dev                    # Start on localhost:3000
```

> 🔑 Tạo JWT secret an toàn:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```
> Dán kết quả vào `JWT_ACCESS_SECRET` và `JWT_REFRESH_SECRET` trong `.env`.

**Tài khoản mẫu sau khi seed:**
- `admin@school.com` / `Admin@123456` — role **admin**
- `user1@school.com`, `user2@school.com`, `user3@school.com` / `User@123456` — role **user**

### 2. Test API

```bash
# Get all classes
curl http://localhost:3000/api/v1/classes

# Get students with filters
curl "http://localhost:3000/api/v1/students?page=1&limit=10&status=active"

# View statistics
curl http://localhost:3000/api/v1/stats
```

### 3. Database GUI

```bash
npm run prisma:studio         # Opens http://localhost:5555
```

---

## 📊 Database Schema

### User 🔐
- `id` (Int) - Primary key
- `name` (String) - Tên hiển thị
- `email` (String) - Unique email (dùng để đăng nhập)
- `password` (String) - **bcrypt hash** (không bao giờ lưu plain text)
- `role` (Enum) - user | admin (mặc định user — chuẩn bị cho Bài 8)
- `refreshToken` (String?) - Refresh token hiện tại, dùng để revoke khi logout
- `createdAt` / `updatedAt` (DateTime)

### Class
- `id` (Int) - Primary key
- `name` (String) - Unique class name
- `subject` (String) - Subject taught
- `teacherName` (String) - Teacher name
- `maxStudents` (Int) - Max capacity
- `schedule` (String) - Class schedule
- **Relations**: 1→many Students

### Student
- `id` (Int) - Primary key
- `fullName` (String) - Full name
- `email` (String) - Unique email
- `phone` (String) - Optional phone
- `classId` (Int, FK) - Class reference
- `gpa` (Decimal 3.2) - GPA score
- `status` (Enum) - active | inactive | graduated
- `enrolledAt` (DateTime) - Enrollment date
- `updatedAt` (DateTime) - Last update
- **Relations**: many→1 Class, 1→many Grades

### Grade
- `id` (Int) - Primary key
- `studentId` (Int, FK) - Student reference
- `subject` (String) - Subject name
- `midterm` (Decimal 4.1) - Midterm score (0-10)
- `final` (Decimal 4.1) - Final score (0-10)
- `average` (Decimal 4.2) - Auto-calculated (40% midterm + 60% final)
- `letterGrade` (Enum) - Auto-calculated (A/B/C/D/F)
- `recordedAt` (DateTime) - Recording date
- **Unique constraint**: [studentId, subject]
- **Relations**: many→1 Student (CASCADE delete)

---

## 📡 API Endpoints

**Base URL:** `/api/v1`

> 🔐 Route có biểu tượng khóa yêu cầu header `Authorization: Bearer <accessToken>`.

### Auth 🔐

| Method | Endpoint | Mô tả | Cần token |
|--------|----------|-------|-----------|
| POST | `/auth/register` | Đăng ký tài khoản mới | ❌ |
| POST | `/auth/login` | Đăng nhập, lấy access + refresh token | ❌ |
| POST | `/auth/refresh` | Lấy access token mới (rotation) | ❌ |
| GET  | `/auth/me` | Thông tin user hiện tại | 🔐 |
| POST | `/auth/logout` | Đăng xuất, revoke refresh token | 🔐 |

#### POST `/auth/register`
```json
{
  "name": "Nguyễn Văn A",
  "email": "a@gmail.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```
**Validation:** name (≥2), email hợp lệ, password (≥8, có chữ hoa + số), confirmPassword khớp.
**Response 201:** thông tin user (không có password). 409 nếu email đã tồn tại.

#### POST `/auth/login`
```json
{ "email": "a@gmail.com", "password": "Password123" }
```
**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1Ni...",
    "refreshToken": "eyJhbGciOiJIUzI1Ni...",
    "user": { "id": 1, "name": "Nguyễn Văn A", "email": "a@gmail.com", "role": "user" }
  }
}
```
> Dùng chung 1 message lỗi `Email hoặc mật khẩu không đúng` cho cả sai email lẫn sai password → tránh user enumeration.

#### POST `/auth/refresh`
```json
{ "refreshToken": "eyJhbGciOiJIUzI1Ni..." }
```
Verify chữ ký + đối chiếu DB → cấp **cặp token mới** (refresh token rotation). Token cũ bị vô hiệu.

#### GET `/auth/me` 🔐
Trả thông tin user từ `req.user.id` (do middleware `authenticate` gắn).

#### POST `/auth/logout` 🔐
Xóa `refreshToken` trong DB. Access token cũ vẫn hợp lệ đến khi hết hạn (giới hạn của stateless JWT).

---

## 🛡️ Bảng phân quyền (Authorization Matrix)

| Endpoint | Public | User (đăng nhập) | Admin |
|----------|:------:|:----------------:|:-----:|
| GET `/students`, `/classes`, `/students/:id/grades` | ✅ | ✅ | ✅ |
| POST/PATCH/DELETE `/students`, `/classes` | ❌ | ❌ 403 | ✅ |
| POST/PATCH/DELETE `/students/:id/grades` | ❌ | ❌ 403 | ✅ |
| GET `/users`, GET `/users/:id` | ❌ | ❌ 403 | ✅ |
| PATCH `/users/:id` (name, email) | ❌ | ✅ **chính chủ** | ✅ |
| PATCH `/users/:id/role` | ❌ | ❌ 403 | ✅ (trừ chính mình) |
| DELETE `/users/:id` | ❌ | ❌ 403 | ✅ (trừ chính mình) |

**2 cơ chế phân quyền:**
- **RBAC** (`authorize('admin')`): kiểm tra `req.user.role` — sai role → **403**.
- **Ownership** (`authorizeOwner(getOwnerId)`): so sánh `req.user.id` với chủ tài nguyên — không phải chủ → **403**. **Admin luôn bypass.**

> Thứ tự middleware: `authenticate` (401 nếu chưa đăng nhập) → `authorize`/`authorizeOwner` (403 nếu sai quyền) → `validate` → controller.

---

### Users 🛡️

| Method | Endpoint | Quyền |
|--------|----------|-------|
| GET | `/users?role=&search=&page=&limit=` | admin |
| GET | `/users/:id` | admin |
| PATCH | `/users/:id` | chính chủ **hoặc** admin |
| PATCH | `/users/:id/role` | admin (không tự đổi role mình → 400) |
| DELETE | `/users/:id` | admin (không tự xóa mình → 400) |

#### PATCH `/users/:id` — update profile
```json
{ "name": "Tên Mới", "email": "moi@gmail.com" }
```
- User thường: chỉ sửa được **chính mình** (id khác → 403).
- Admin: sửa được bất kỳ ai.
- Email trùng tài khoản khác → 409.

#### PATCH `/users/:id/role` — đổi vai trò (admin only)
```json
{ "role": "admin" }
```
Admin **không thể tự đổi role của mình** → 400 (tránh tự khóa quyền quản trị).

#### DELETE `/users/:id` — xóa user (admin only)
Admin **không thể tự xóa tài khoản mình** → 400.

---

### Classes

> GET là public. POST / PATCH / DELETE / transfer-student **chỉ admin** (401 nếu chưa đăng nhập, 403 nếu là user thường).

#### GET `/classes`
List all classes with student count

**Query Params:**
```
?subject=Math&hasSlot=true&sort=name&order=asc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "10A1",
      "subject": "Mathematics",
      "teacherName": "Nguyễn Văn A",
      "maxStudents": 30,
      "_count": { "students": 5 }
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "pages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### GET `/classes/:id`
Get class with active students (sorted by GPA desc)

#### POST `/classes`
Create new class (validate name, subject, teacherName, maxStudents 10-50)

#### PATCH `/classes/:id`
Update class

#### DELETE `/classes/:id`
Delete class

#### POST `/classes/:id/transfer-student`
Transfer student to class (checks max capacity)

**Request:**
```json
{ "studentId": 5 }
```

---

### Students

> GET (kể cả GET `/students/:id/grades`) là public. POST / PATCH / DELETE và mọi thao tác ghi điểm **chỉ admin**.

#### GET `/students`
List students with filtering

**Query Params:**
```
?classId=1&status=active&search=Nguyễn&sort=gpa&order=desc&page=1&limit=10
```

**Features:**
- Filter by classId, status, search (fullName or email)
- Sort by: fullName, email, gpa, enrolledAt
- Pagination with hasNext/hasPrev flags

#### GET `/students/:id`
Get student details with class and all grades

#### POST `/students`
Create new student (transaction: check class has slot)

**Validation:**
- fullName (required, 2-100 chars)
- email (required, unique, valid email)
- phone (optional)
- classId (optional, check slot availability)
- gpa (optional, 0-4 range)
- status (optional, default: active)

#### PATCH `/students/:id`
Update student (partial, validate classId capacity if changing)

#### DELETE `/students/:id`
Delete student (transaction: remove grades first)

**Error 409:** Cannot delete if status=active

---

### Grades

#### POST `/students/:id/grades`
Add grade (auto-calculates average & letterGrade)

**Request:**
```json
{
  "subject": "Mathematics",
  "midterm": 8.5,
  "final": 8.8
}
```

**Validation:**
- subject (required, 2-50 chars)
- midterm (0-10)
- final (0-10)

**Unique Constraint:** Cannot have 2 grades for same subject

**Calculation:**
- average = midterm × 0.4 + final × 0.6
- letterGrade: A(≥8.5), B(≥7.0), C(≥5.5), D(≥4.0), F(<4.0)

#### PATCH `/students/:id/grades/:gradeId`
Update grade (recalculates average & letterGrade)

**Request:**
```json
{
  "midterm": 8.0,
  "final": 9.0
}
```

#### GET `/students/:id/grades`
List all grades for student (newest first)

#### DELETE `/students/:id/grades/:gradeId`
Delete grade

---

### Stats

#### GET `/stats`
Get comprehensive statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalStudents": 15,
      "totalClasses": 3,
      "averageGPA": "7.85"
    },
    "gradeDistribution": [
      { "grade": "A", "count": 12 },
      { "grade": "B", "count": 5 },
      { "grade": "C", "count": 2 },
      { "grade": "D", "count": 1 },
      { "grade": "F", "count": 0 }
    ],
    "statusDistribution": [
      { "status": "active", "count": 13 },
      { "status": "inactive", "count": 1 },
      { "status": "graduated", "count": 1 }
    ],
    "classStats": [
      {
        "id": 1,
        "name": "10A1",
        "subject": "Mathematics",
        "studentCount": 5,
        "maxStudents": 30,
        "averageGPA": "8.00"
      }
    ]
  }
}
```

---

## 🛡️ Error Handling

All errors return consistent JSON format:

```json
{
  "success": false,
  "message": "Error description"
}
```

| Status | Scenario | Prisma Code |
|--------|----------|-------------|
| 400 | Validation failed | - |
| 401 | Chưa đăng nhập / token sai / hết hạn | - |
| 403 | Không đủ quyền (authorize) | - |
| 404 | Record not found | P2025 |
| 409 | Duplicate entry / email đã đăng ký | P2002 |
| 409 | Class full | - |
| 409 | Active student delete | - |
| 500 | Server error | - |

---

## 🔧 Advanced Features

### Transactions

**Transfer Student (ensures class has slot):**
```typescript
export async function transferStudent(studentId: number, newClassId: number) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({ where: { id: studentId } });
    const newClass = await tx.class.findUnique({
      where: { id: newClassId },
      include: { _count: { select: { students: true } } },
    });
    if (newClass._count.students >= newClass.maxStudents)
      throw new AppError(409, `Lớp đã đủ học sinh`);
    
    return tx.student.update({
      where: { id: studentId },
      data: { classId: newClassId },
    });
  });
}
```

**Delete Student (remove grades first):**
```typescript
export async function remove(id: number) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({ where: { id } });
    if (student.status === 'active')
      throw new AppError(409, 'Cannot delete active student');
    
    await tx.grade.deleteMany({ where: { studentId: id } });
    return tx.student.delete({ where: { id } });
  });
}
```

### Aggregates

**Statistics with groupBy():**
```typescript
const gradeDistribution = await prisma.grade.groupBy({
  by: ['letterGrade'],
  _count: true,
});

const statusDistribution = await prisma.student.groupBy({
  by: ['status'],
  _count: true,
});
```

### Query Validation

**Middleware validates all query params:**
```typescript
const schema = yup.object().shape({
  page: yup.number().positive().default(1),
  limit: yup.number().positive().max(100).default(10),
  sort: yup.string().oneOf(['fullName', 'gpa']).default('fullName'),
  order: yup.string().oneOf(['asc', 'desc']).default('asc'),
});
```

---

## 📝 Sample Data

After `npx prisma db seed`:

**4 Users:**
- admin@school.com / `Admin@123456` (role **admin**)
- user1@school.com, user2@school.com, user3@school.com / `User@123456` (role **user**)

**3 Classes:**
- Node.js Buổi Tối (programming, 30 max)
- English Giao Tiếp (english, 20 max)
- Toán Cao Cấp (math, 25 max)

**6 Students:** GPA range 5.8 - 9.0, phân vào 3 lớp.

**7 Grades:** auto-calc average (40% midterm + 60% final) + letterGrade A/B/C/D/F.

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Lấy 2 token (admin + user)
```bash
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"Admin@123456"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).data.accessToken")

USER_TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@school.com","password":"User@123456"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).data.accessToken")
```

### RBAC — tạo student
```bash
# Admin tạo student → 201
curl -X POST http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"fullName":"Nguyễn A","email":"newa@gmail.com","classId":1}'

# User thường tạo student → 403
curl -X POST http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" \
  -d '{"fullName":"Nguyễn B","email":"newb@gmail.com","classId":1}'

# Không token → 401
curl -X POST http://localhost:3000/api/v1/students \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Nguyễn C","email":"newc@gmail.com","classId":1}'
```

### Ownership — sửa profile
```bash
# User sửa profile CHÍNH MÌNH (id=2) → 200
curl -X PATCH http://localhost:3000/api/v1/users/2 \
  -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Tên Mới"}'

# User sửa profile NGƯỜI KHÁC (id=3) → 403
curl -X PATCH http://localhost:3000/api/v1/users/3 \
  -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Hack Người Khác"}'
```

### Self-protection — admin tự thao tác chính mình
```bash
# Admin tự xóa (id=1) → 400
curl -X DELETE http://localhost:3000/api/v1/users/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Admin tự đổi role (id=1) → 400
curl -X PATCH http://localhost:3000/api/v1/users/1/role \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"role":"user"}'
```

> Lưu ý: id của admin/user phụ thuộc thứ tự seed. Dùng `GET /users` (admin token) để xác nhận id thực tế.

---

## 🔐 Security Features

- ✅ **RBAC** — phân quyền theo vai trò, sai role → 403
- ✅ **Ownership** — chỉ chủ tài nguyên thao tác được, admin bypass
- ✅ **Self-protection** — admin không thể tự đổi role / tự xóa mình (→ 400)
- ✅ **Password hashing với bcrypt** (saltRounds=12, tự thêm salt chống rainbow table)
- ✅ **JWT stateless authentication** (access + refresh token tách biệt)
- ✅ **Refresh token rotation** + revoke qua DB khi logout
- ✅ **Chống user enumeration** (chung 1 message lỗi khi login sai)
- ✅ **Không trả password / refreshToken** ra response (dùng Prisma `select`)
- ✅ Type-safe Prisma queries
- ✅ Input validation with Yup
- ✅ SQL injection protection (ORM)
- ✅ CORS enabled
- ✅ Unique email constraint
- ✅ Proper error messages (no stack traces exposed)

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "express": "^4.18.2",
    "yup": "^1.3.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "decimal.js": "^10.4.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "typescript": "^5.1.6",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "prisma": "^5.0.0"
  }
}
```

---

## 🛠️ Commands

```bash
# Development
npm run dev                 # Auto-reload server

# Production
npm run build
npm start

# Database
npm run prisma:migrate     # Create/update schema
npm run prisma:push        # Push schema without migration
npm run prisma:studio      # GUI viewer (port 5555)
npm run prisma:seed        # Seed sample data

# Code
npm run build              # Compile TypeScript
```

---

## 📋 Production Checklist

- ✅ RBAC authorization (authorize) + Ownership (authorizeOwner)
- ✅ User management (list/get/update/role/delete) — admin only
- ✅ Self-protection (admin không tự đổi role / tự xóa)
- ✅ JWT authentication (register, login, refresh, logout)
- ✅ bcrypt password hashing (saltRounds=12)
- ✅ Refresh token rotation + revoke
- ✅ Service / Controller / Middleware separation
- ✅ Comprehensive error handling (401/403/404/409 + Prisma codes)
- ✅ Query param validation with Yup
- ✅ Pagination with meta (hasNext, hasPrev)
- ✅ Auto-calculated fields (average, letterGrade)
- ✅ Seed data (1 admin + 3 users, 3 classes, 6 students, 7 grades)
- ✅ Full TypeScript coverage

---

## 🎯 Next Steps

- ✅ ~~Add authentication (JWT)~~ — **Bài 7 (đã hoàn thành)**
- ✅ ~~Add authorization (RBAC + ownership)~~ — **Bài 8 (đã hoàn thành)**
- Add request logging
- Add rate limiting
- Add API documentation (Swagger/OpenAPI)
- Add unit & integration tests
- Add performance monitoring
- Deploy to production

---

**Built with ❤️ using production-grade patterns**
