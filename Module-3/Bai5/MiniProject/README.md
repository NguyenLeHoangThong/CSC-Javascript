# Mini Project - Module 3, Bài 5: REST API with Prisma + PostgreSQL

REST API for managing students and classes using Prisma ORM with PostgreSQL database.

## Features

✅ **Prisma ORM** - Type-safe database access  
✅ **PostgreSQL** - Robust relational database  
✅ **Express.js** - Lightweight web framework  
✅ **TypeScript** - Static typing for safety  
✅ **Yup Validation** - Schema validation  
✅ **Auto-calculated grades** - Average & letter grade computed in service layer  
✅ **Pagination & filtering** - Query students with multiple filters  

---

## Project Structure

```
MiniProject/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── classController.ts
│   │   ├── studentController.ts
│   │   └── gradeController.ts
│   ├── services/          # Business logic
│   │   ├── classService.ts
│   │   ├── studentService.ts
│   │   └── gradeService.ts
│   ├── routes/            # API endpoints
│   │   ├── classRoutes.ts
│   │   └── studentRoutes.ts
│   ├── validators/        # Input validation (Yup)
│   │   └── index.ts
│   ├── db/                # Database configuration
│   │   └── prisma.ts
│   └── index.ts           # Express app entry
├── prisma/
│   ├── schema.prisma      # Prisma data model
│   └── seed.ts            # Sample data
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

**Example .env:**
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/school_db"
NODE_ENV="development"
PORT=3000
```

### 3. Setup Prisma

Generate Prisma client:

```bash
npm run prisma:generate
```

Run migrations (creates tables):

```bash
npm run prisma:migrate
```

### 4. Seed Sample Data

```bash
npm run prisma:seed
```

---

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

Server will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

---

## Database Schema (Prisma Models)

### Class
- `id` (Int) - Primary key, auto-increment
- `name` (String) - Class name
- `subject` (String) - Subject taught
- `teacherName` (String) - Teacher name
- `maxStudents` (Int) - Maximum capacity (default: 30)
- `schedule` (String, optional) - Class schedule
- `createdAt` (DateTime) - Creation timestamp
- **Relations**: 1→many Students

### Student
- `id` (Int) - Primary key, auto-increment
- `fullName` (String) - Student full name
- `email` (String) - Unique email
- `phone` (String, optional) - Phone number
- `classId` (Int, optional) - Class ID (FK)
- `gpa` (Decimal 3.2) - GPA score
- `status` (Enum) - 'active' | 'inactive' | 'graduated'
- `enrolledAt` (DateTime) - Enrollment date
- `updatedAt` (DateTime) - Last update
- **Relations**: many→1 Class, 1→many Grades

### Grade
- `id` (Int) - Primary key, auto-increment
- `studentId` (Int) - Student ID (FK, CASCADE)
- `subject` (String) - Subject name
- `midterm` (Decimal 4.1) - Midterm score (0-10)
- `final` (Decimal 4.1) - Final score (0-10)
- `average` (Decimal 4.2) - **Auto-calculated** (40% midterm + 60% final)
- `letterGrade` (Enum) - **Auto-calculated** (A/B/C/D/F)
- `recordedAt` (DateTime) - Recording date
- **Unique constraint**: [studentId, subject] per record
- **Relations**: many→1 Student (with CASCADE delete)

---

## API Endpoints

### Base URL: `/api/v1`

---

### Classes

#### GET `/api/v1/classes`
List all classes with student count

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "10A1",
      "subject": "Mathematics",
      "teacherName": "Nguyễn Văn A",
      "maxStudents": 40,
      "schedule": "Monday 08:00",
      "createdAt": "2024-01-15T10:00:00Z",
      "_count": { "students": 25 }
    }
  ]
}
```

---

#### GET `/api/v1/classes/:id`
Get class details with active students

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "10A1",
    "subject": "Mathematics",
    "teacherName": "Nguyễn Văn A",
    "maxStudents": 40,
    "_count": { "students": 25 },
    "students": [
      {
        "id": 1,
        "fullName": "Nguyễn Văn A",
        "email": "van.a@school.edu",
        "gpa": 8.5,
        "status": "active"
      }
    ]
  }
}
```

---

#### POST `/api/v1/classes`
Create new class

**Request Body:**
```json
{
  "name": "10A1",
  "subject": "Mathematics",
  "teacherName": "Nguyễn Văn A",
  "maxStudents": 40,
  "schedule": "Monday 08:00-09:30"
}
```

**Validation Rules:**
- `name`: required, 2-100 chars, unique
- `subject`: required, 2-50 chars
- `teacherName`: required, 2-100 chars
- `maxStudents`: required, 1-100

---

#### PATCH `/api/v1/classes/:id`
Update class information

#### DELETE `/api/v1/classes/:id`
Delete class

---

### Students

#### GET `/api/v1/students`
List students with pagination and filtering

**Query Parameters:**
- `classId` (number) - Filter by class
- `status` (string) - Filter by status: active|inactive|graduated
- `search` (string) - Search by name or email
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Example:**
```
GET /api/v1/students?classId=1&status=active&search=Nguyễn&page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "fullName": "Nguyễn Văn A",
      "email": "van.a@school.edu",
      "gpa": 8.5,
      "status": "active",
      "class": { "name": "10A1" },
      "grades": []
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

#### GET `/api/v1/students/:id`
Get student details with class and grades

**Response:**
```json
{
  "data": {
    "id": 1,
    "fullName": "Nguyễn Văn A",
    "email": "van.a@school.edu",
    "phone": "0912345678",
    "gpa": 8.5,
    "status": "active",
    "enrolledAt": "2024-01-15T10:00:00Z",
    "class": {
      "id": 1,
      "name": "10A1",
      "subject": "Mathematics",
      "teacherName": "Nguyễn Văn A"
    },
    "grades": [
      {
        "id": 1,
        "subject": "Mathematics",
        "midterm": 8.5,
        "final": 8.8,
        "average": 8.68,
        "letterGrade": "A",
        "recordedAt": "2024-01-20T10:00:00Z"
      }
    ]
  }
}
```

---

#### POST `/api/v1/students`
Create new student

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "van.a@school.edu",
  "phone": "0912345678",
  "classId": 1,
  "gpa": 8.5,
  "status": "active"
}
```

**Validation Rules:**
- `fullName`: required, 2-100 chars
- `email`: required, valid email, unique
- `phone`: optional, max 15 chars
- `classId`: optional, positive number
- `gpa`: optional, 0-4 range, default 0
- `status`: optional, active|inactive|graduated, default 'active'

---

#### PATCH `/api/v1/students/:id`
Update student information (partial update)

**Request Body (any field):**
```json
{
  "fullName": "Nguyễn Văn A",
  "gpa": 8.8,
  "status": "inactive"
}
```

---

#### DELETE `/api/v1/students/:id`
Delete student (only if status ≠ active)

**Error Response (409):**
```json
{
  "error": "Cannot delete active student"
}
```

---

### Grades

#### POST `/api/v1/students/:id/grades`
Add grade for student (auto-calculates average & letter grade)

**Request Body:**
```json
{
  "subject": "Mathematics",
  "midterm": 8.5,
  "final": 8.8
}
```

**Calculation:**
- `average` = midterm × 0.4 + final × 0.6 = 8.68
- `letterGrade` = A (if average >= 8.5)

**Validation Rules:**
- `subject`: required, 2-50 chars
- `midterm`: required, 0-10 range
- `final`: required, 0-10 range

**Response:**
```json
{
  "data": {
    "id": 1,
    "studentId": 1,
    "subject": "Mathematics",
    "midterm": 8.5,
    "final": 8.8,
    "average": 8.68,
    "letterGrade": "A",
    "recordedAt": "2024-01-25T10:00:00Z"
  }
}
```

---

#### GET `/api/v1/students/:id/grades`
List student's grades (sorted by date, newest first)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "subject": "Mathematics",
      "midterm": 8.5,
      "final": 8.8,
      "average": 8.68,
      "letterGrade": "A",
      "recordedAt": "2024-01-25T10:00:00Z"
    }
  ]
}
```

---

#### DELETE `/api/v1/students/:id/grades/:gradeId`
Delete a specific grade record

---

## Letter Grade Calculation

| Average | Grade |
|---------|-------|
| >= 8.5  | A     |
| >= 7.0  | B     |
| >= 5.5  | C     |
| >= 4.0  | D     |
| < 4.0   | F     |

---

## Error Responses

### 400 Bad Request
```json
{ "error": "Validation error message" }
```

### 404 Not Found
```json
{ "error": "Student not found" }
```

### 409 Conflict
```json
{ "error": "Cannot delete active student" }
```
or
```json
{ "error": "Email already exists" }
```

### 500 Internal Server Error
```json
{ "error": "Failed to create student" }
```

---

## Key Concepts Demonstrated

1. **Prisma ORM** - Type-safe queries with auto-generated client
2. **Relations** - One-to-many (Class→Students, Student→Grades)
3. **Generated Fields** - Average & letter grade auto-calculated
4. **Validation** - Yup schema validation at controller layer
5. **Business Logic** - Service layer separation
6. **Pagination** - Offset-based pagination with page/limit
7. **Filtering** - Multiple filter criteria support
8. **Error Handling** - Prisma error codes (P2002, P2025, etc.)
9. **Cascade Delete** - Grades deleted when student is deleted
10. **Type Safety** - Full TypeScript coverage

---

## Testing with curl

### Create a Class
```bash
curl -X POST http://localhost:3000/api/v1/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "10A1",
    "subject": "Mathematics",
    "teacherName": "Nguyễn Văn A",
    "maxStudents": 40
  }'
```

### Create a Student
```bash
curl -X POST http://localhost:3000/api/v1/students \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn A",
    "email": "van.a@school.edu",
    "classId": 1,
    "gpa": 8.5
  }'
```

### Add a Grade
```bash
curl -X POST http://localhost:3000/api/v1/students/1/grades \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "midterm": 8.5,
    "final": 8.8
  }'
```

### Get Students with Filters
```bash
curl "http://localhost:3000/api/v1/students?classId=1&status=active&page=1&limit=10"
```

---

## Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create/update database schema
npm run prisma:migrate

# Open Prisma Studio GUI
npm run prisma:studio

# Seed database with sample data
npm run prisma:seed
```

---

## Environment Variables

| Variable    | Default | Description           |
|-------------|---------|----------------------|
| DATABASE_URL | -       | PostgreSQL connection |
| NODE_ENV    | development | Environment mode      |
| PORT        | 3000    | Server port           |

---

## Requirements Met

✅ Prisma schema with Class, Student, Grade models  
✅ Relationships: 1→n Student, 1→n Grade with CASCADE delete  
✅ Unique constraint: [studentId, subject] on Grade  
✅ All 10 API endpoints as specified  
✅ Query filtering with page/limit pagination  
✅ Input validation using Yup  
✅ Auto-calculate average & letter grade  
✅ 409 error for deleting active students  
✅ TypeScript for type safety  
✅ Service layer for business logic  

---

## Next Steps

- Add authentication (JWT)
- Add authorization (role-based access)
- Add logging
- Add request rate limiting
- Add comprehensive error handling
- Add unit tests with Jest
- Add API documentation with Swagger

