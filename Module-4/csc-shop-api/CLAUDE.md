# CLAUDE.md — csc-shop-api

Hướng dẫn cho AI coding assistant khi làm việc trong repo này.

---

## Stack

Express 4 · TypeScript (strict) · Prisma 5 + PostgreSQL · Yup · JWT (access + refresh)
· bcrypt · helmet · express-rate-limit · `@google/genai` (Gemini) · Vitest + Supertest.

---

## Kiến trúc — 4 tầng, không được trộn

```
routes/       khai báo path + middleware, KHÔNG chứa business logic
controllers/  đọc req -> gọi service -> res.json(); mọi lỗi đi qua next(err)
services/     toàn bộ business logic + truy vấn Prisma; ném AppError khi sai
db/prisma.ts  MỘT PrismaClient duy nhất cho cả app
```

Route không được gọi thẳng `prisma`. Service không được biết đến `req`/`res`.

---

## Quy tắc BẮT BUỘC

### 1. Response format cố định

```jsonc
{ "success": true,  "data": ..., "meta": { ... } }   // meta chỉ có ở endpoint list
{ "success": false, "message": "..." }               // mọi lỗi
```

Frontend đang phụ thuộc đúng shape này. Đổi là breaking change.

### 2. Lỗi: `throw new AppError(status, message)` rồi `next(err)`

Controller **không** tự `res.status(500).json(...)`. `middleware/errorHandler.ts` là nơi
duy nhất format lỗi, và nó cũng map sẵn mã Prisma: `P2002` → 409, `P2025` → 404,
`P2003` → 409.

```ts
// ❌
catch (e) { res.status(500).json({ error: e.message }); }
// ✅
catch (err) { next(err); }
```

Không bao giờ echo message gốc của lỗi 500 ra client — nó có thể chứa SQL, đường dẫn
file, hoặc API key.

### 3. Query trả về `User` phải dùng `USER_SELECT`

`src/constants/userSelect.ts` là allow-list. `password` và `refreshToken` không có
trong đó — và không được thêm vào.

### 4. Validate ở biên, không ở giữa

Mọi input đi qua Yup schema trong `src/schemas/`:
`validate(bodySchema)` · `validateQuery(querySchema)` · `validateId`.

Endpoint list **bắt buộc** có query schema với `page`/`limit` có `.default()`. Thiếu nó
thì `buildSkip(undefined, undefined)` = `NaN` và Prisma trả về rác.

### 5. Filter/sort/paginate ở DATABASE

```ts
// ❌ N+1 và load cả bảng
const all = await prisma.product.findMany();
const filtered = all.filter(p => p.price > min);

// ✅
await prisma.product.findMany({ where, orderBy, skip, take });
```

Không đặt `await prisma.*` bên trong vòng lặp — dùng `include`, hoặc gom thành một
`findMany({ where: { id: { in: ids } } })`.

### 6. Không `new PrismaClient()` ở bất kỳ đâu ngoài `src/db/prisma.ts`

Free tier của Render chỉ cho ~97 connection; mỗi client mở pool riêng.

### 7. `app.ts` build app, `server.ts` mới `.listen()`

Đừng gộp lại — Supertest import `app.ts` để test mà không mở port thật.

### 8. AI: key ở server, luôn có cache + timeout + phân loại lỗi

Xem `src/services/aiService.ts`. Mọi lời gọi Gemini phải:
- đi qua `callGemini()` (đã có `AbortController` timeout 15s),
- check cache trước (`utils/aiCache.ts`),
- phân biệt 429 ngắn hạn (retry được) với hết quota ngày (retry vô ích),
- **không** trả message gốc của provider về client.

---

## Lệnh hay dùng

```bash
npm run dev            # ts-node-dev, http://localhost:3000
npm run typecheck      # tsc --noEmit -p tsconfig.check.json (gồm cả scripts/ và prisma/)
npm test               # vitest run
npm run build          # tsc -> dist/
npm run prisma:push    # đẩy schema xuống DB (dự án chưa dùng migration file)
npm run prisma:seed    # seed idempotent — chạy nhiều lần vẫn an toàn
npm run ai:review -- src/services/orderService.ts   # AI review 1 file
```

---

## Test

- Mock Prisma bằng `vi.hoisted()` + `vi.mock('../../db/prisma', ...)`.
  Dùng `const` thường sẽ lỗi "Cannot access before initialization" vì `vi.mock` bị hoist.
- Test route dùng Supertest với `app` từ `src/app.ts`.
- Không **unit test** nào được cần database thật hoặc `GEMINI_API_KEY` thật.
- E2E (Playwright) nằm ở `../csc-shop-fe/e2e/` và chạy trên backend + PostgreSQL THẬT.
  Nó gọi API này trực tiếp để assert phân quyền, header bảo mật và format response —
  nên đổi status code hay tên field ở đây sẽ làm E2E đỏ. Đó là chủ ý.
- Trần rate limit đọc từ env (`RATE_LIMIT_GENERAL_MAX` / `_AUTH_MAX` / `_AI_MAX`) để E2E
  nới được; **mặc định production là 100 / 10 / 10**, đừng đổi giá trị mặc định.
