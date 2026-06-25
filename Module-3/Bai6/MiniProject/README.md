# Production-Ready REST API - Module 3, Bài 6

Complete school management REST API built with **Prisma ORM**, **PostgreSQL**, **Express.js**, and **TypeScript**, following production-grade architectural patterns.

## ✨ Key Features

✅ **Production Architecture** - Middleware, services, controllers, validators separation  
✅ **Advanced Validation** - Query params validation with Yup  
✅ **Comprehensive Error Handling** - Prisma error codes mapped to HTTP responses  
✅ **Transactions** - ACID compliance for multi-step operations  
✅ **Aggregate Queries** - Statistics with groupBy() and aggregates  
✅ **Pagination & Filtering** - buildMeta(), buildSkip() utilities  
✅ **Type Safety** - Full TypeScript coverage  
✅ **Seed Data** - 3 classes, 15 students, 20 grades  

---

## 📁 Project Structure

```
MiniProject/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── classController.ts
│   │   ├── studentController.ts
│   │   ├── gradeController.ts
│   │   └── statsController.ts
│   ├── services/             # Business logic
│   │   ├── classService.ts
│   │   ├── studentService.ts
│   │   ├── gradeService.ts
│   │   └── statsService.ts
│   ├── routes/               # API endpoints
│   │   ├── classRoutes.ts
│   │   ├── studentRoutes.ts
│   │   └── statsRoutes.ts
│   ├── middleware/           # Middleware
│   │   ├── validate.ts       # Body, query, param validation
│   │   └── errorHandler.ts   # Global error handling
│   ├── schemas/              # Yup validation schemas
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   └── pagination.ts
│   ├── types/                # TypeScript types
│   │   └── api.ts
│   ├── db/                   # Database
│   │   └── prisma.ts
│   └── index.ts              # Express app entry
├── prisma/
│   ├── schema.prisma         # Data model
│   └── seed.ts               # Sample data (3 classes, 15 students, 20 grades)
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
cp .env.example .env           # Update DATABASE_URL
npm run prisma:migrate         # Create schema
npm run prisma:seed            # Seed 3 classes, 15 students, 20 grades
npm run dev                    # Start on localhost:3000
```

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

### Classes

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
| 404 | Record not found | P2025 |
| 409 | Duplicate entry | P2002 |
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

After `npm run prisma:seed`:

**3 Classes:**
- 10A1 (Mathematics, 30 max, 5 students)
- 10A2 (English, 28 max, 5 students)
- 10B1 (Physics, 25 max, 5 students)

**15 Students:**
- GPA range: 5.5 - 9.2
- Status: 13 active, 1 inactive, 1 graduated

**20 Grades:**
- Distributed across subjects: Math, English, Physics
- Letter grades: A, B, C, D

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Create Class
```bash
curl -X POST http://localhost:3000/api/v1/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "11A1",
    "subject": "Chemistry",
    "teacherName": "Lê Thanh",
    "maxStudents": 40
  }'
```

### Get Filtered Students
```bash
curl "http://localhost:3000/api/v1/students?classId=1&status=active&sort=gpa&order=desc"
```

### Add Grade (auto-calculates)
```bash
curl -X POST http://localhost:3000/api/v1/students/1/grades \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Chemistry",
    "midterm": 8.5,
    "final": 9.0
  }'
```

### View Stats
```bash
curl http://localhost:3000/api/v1/stats
```

---

## 🔐 Security Features

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
    "decimal.js": "^10.4.3"
  },
  "devDependencies": {
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

- ✅ Service layer with business logic
- ✅ Controller layer with request handling
- ✅ Middleware for validation & error handling
- ✅ Comprehensive error handling (Prisma error codes)
- ✅ Transaction for multi-step operations
- ✅ Aggregate queries for statistics
- ✅ Query param validation with Yup
- ✅ Pagination with meta (hasNext, hasPrev)
- ✅ Auto-calculated fields (average, letterGrade)
- ✅ Seed data (3 classes, 15 students, 20 grades)
- ✅ Full TypeScript coverage
- ✅ CORS & security headers

---

## 🎯 Next Steps

- Add authentication (JWT)
- Add authorization (role-based)
- Add request logging
- Add rate limiting
- Add API documentation (Swagger/OpenAPI)
- Add unit & integration tests
- Add performance monitoring
- Deploy to production

---

**Built with ❤️ using production-grade patterns**
