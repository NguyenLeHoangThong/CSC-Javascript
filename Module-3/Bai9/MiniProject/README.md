# Production-Ready REST API — Module 3, Bài 9 (Hardening)

School management REST API hoàn thiện cho **production**. Kế thừa **toàn bộ** Bài 8
(JWT auth + RBAC + ownership + user management) và bổ sung lớp bảo vệ & vận hành:
security headers, request logging, rate limiting, API docs (Swagger), health/readiness probes.

> Chi tiết về Auth, RBAC/Ownership, transaction, aggregate… xem README của Bài 7 & Bài 8.
> Bài 9 chỉ tập trung vào phần **production hardening**.

## 🆕 Điểm mới của Bài 9

| Tính năng | File | Mục đích |
|-----------|------|----------|
| **Helmet** | `src/index.ts` | Đặt secure HTTP headers (CSP, HSTS, X-Frame-Options…) |
| **Request logging** | `src/middleware/requestLogger.ts` | Log mọi request bằng morgan (`dev` / `combined`) |
| **Rate limiting** | `src/middleware/rateLimiter.ts` | `authLimiter` (10/15m) cho `/auth`, `apiLimiter` (100/15m) cho phần còn lại |
| **Swagger UI** | `src/docs/swagger.ts` | API docs tương tác tại `GET /api-docs` |
| **Readiness probe** | `src/index.ts` | `GET /ready` kiểm tra DB (`SELECT 1`) → 503 nếu DB chết |

## 🚀 Chạy

```bash
npm install
cp .env.example .env          # cập nhật DATABASE_URL + JWT secrets
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

- API docs:  http://localhost:3000/api-docs
- Liveness:  http://localhost:3000/health  → `{ status: "up" }`
- Readiness: http://localhost:3000/ready   → `{ status: "ready" }` (hoặc 503 nếu DB lỗi)

Tài khoản mẫu: `admin@school.com / Admin@123456`, `user1@school.com / User@123456`.

## 🧪 Thử các tính năng mới

```bash
# 1) Security headers (helmet) — xem header trả về
curl -I http://localhost:3000/health

# 2) Rate limit auth — gọi /login 11 lần, lần thứ 11 sẽ bị 429
for i in $(seq 1 11); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/v1/auth/login \
    -H "Content-Type: application/json" -d '{"email":"x@y.z","password":"wrong"}'
done

# 3) Readiness
curl http://localhost:3000/ready
```

## 🔎 Ghi chú cho học viên

- **Liveness vs Readiness**: `/health` chỉ báo process còn sống; `/ready` mới kiểm tra phụ thuộc
  (DB) — orchestrator (K8s) dùng readiness để quyết định có gửi traffic vào pod hay không.
- **Thứ tự middleware quan trọng**: `helmet` → `cors` → `logger` → body parser → rate limit → routes
  → `notFoundHandler` → `errorHandler` (error handler luôn cuối cùng).
- **authLimiter đặt trước apiLimiter** trên cùng path `/api/v1/auth` để áp giới hạn chặt hơn cho login.

## 📋 Production checklist (đã đạt)

- ✅ JWT auth (register/login/refresh/logout) + RBAC + ownership (kế thừa Bài 7–8)
- ✅ Helmet security headers
- ✅ HTTP request logging (morgan)
- ✅ Rate limiting (auth + general)
- ✅ Swagger / OpenAPI docs tại `/api-docs`
- ✅ Health + readiness probes
- ✅ Error handling tập trung (401/403/404/409 + Prisma codes)
- ✅ Full TypeScript
