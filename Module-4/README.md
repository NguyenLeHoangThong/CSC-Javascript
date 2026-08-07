# Module 4 — CSC Shop (Bài 31 → 40)

Module 4 **không tạo project mới**. Toàn bộ 10 bài được áp dụng lên đúng dự án CSC Shop
đã build xong ở Module 3, copy nguyên trạng sang đây rồi nâng cấp dần:

| Nguồn (Module 3) | Đích (Module 4) |
|---|---|
| `Module-3/Bai9/BaiTap/csc-shop-api` | `Module-4/csc-shop-api` |
| `Module-3/Bai10/BaiTap/bai-10.1` | `Module-4/csc-shop-fe` |

Đó cũng chính là điểm của module này: 9 bài đầu là **viết tính năng**, module 4 là
**làm cho tính năng đó sống được ở production** — sạch, có test, có AI, an toàn, nhanh,
deploy được, và tự động hoá.

```
Module-4/
├── README.md          ← file này: bản đồ bài học → file
├── csc-shop-api/      ← backend (Express + Prisma + PostgreSQL)
│   └── CLAUDE.md      ← convention thật của backend
└── csc-shop-fe/       ← frontend (React 19 + Vite 8 + MUI)
    └── CLAUDE.md      ← convention thật của frontend
```

---

## Chạy thử nhanh

```bash
# 1. Backend
cd csc-shop-api
cp .env.example .env            # sửa DATABASE_URL cho máy bạn
npm install
npx prisma generate
npm run prisma:push             # tạo bảng (gồm cả product_reviews của Bài 35)
npm run prisma:seed             # seed idempotent — chạy lại bao nhiêu lần cũng được
npm run dev                     # http://localhost:3000/health

# 2. Frontend (terminal khác)
cd csc-shop-fe
cp .env.example .env            # VITE_API_URL=http://localhost:3000/api/v1
npm install
npm run dev                     # http://localhost:5173
```

Tài khoản seed: `admin@cscshop.com / Admin@123456` · `customer@cscshop.com / Customer@123`.

Muốn dùng tính năng AI (Bài 34 + 35): lấy key ở <https://aistudio.google.com/apikey>
rồi điền `GEMINI_API_KEY` trong `csc-shop-api/.env`. **Không điền key vào FE** — để
trống thì widget AI trả 503 còn mọi tính năng khác vẫn chạy bình thường.

Hoặc chạy backend + Postgres bằng Docker (Bài 40):

```bash
cd csc-shop-api
docker compose up -d --build
docker compose exec backend npx prisma db push
curl http://localhost:3000/health     # {"status":"ok","database":"connected",...}
```

---

## Trạng thái kiểm chứng

| Lệnh | Kết quả |
|---|---|
| `csc-shop-api` → `npm run typecheck` | ✅ pass (gồm cả `scripts/`, `prisma/`) |
| `csc-shop-api` → `npm run build` | ✅ pass |
| `csc-shop-api` → `npm test` | ✅ **33 unit test** pass (4 file) |
| `csc-shop-fe` → `npm run build` | ✅ pass (`tsc -b && vite build`) |
| `csc-shop-fe` → `npm run test:unit` | ✅ **18 unit test** pass (3 file) |
| `csc-shop-fe` → `npm run test:e2e` | ✅ **64 E2E test** pass (6 file) — Chromium thật + API thật + PostgreSQL thật, xanh qua nhiều lần chạy liên tiếp |
| `docker build` / `docker compose up` | ⚠️ **chưa chạy thử** — Docker Desktop không bật trên máy khi implement. Cần tự verify (xem lệnh ở trên). |

**Tổng: 115 test tự động** (51 unit + 64 E2E).

Việc **không** làm được bằng code, phải tự tay làm trên dashboard: tạo tài khoản
Vercel/Render, set environment variable, lấy Deploy Hook, thêm GitHub Secret. Xem mục
Bài 38/39/40 bên dưới.

---

# Bài 31 — Clean Code & Refactor

> Mục tiêu: tìm code "viết ẩu" có thật trong dự án và sửa, chứ không phải tự tạo code
> xấu rồi sửa lại.

Module 3 để lại **13 lỗi thật**, tất cả đều thuộc loại "chạy được trên máy mình".
6 lỗi đầu tìm được khi đọc code; 7 lỗi còn lại chỉ lộ ra khi **E2E chạy app thật**
(xem mục [Bài 32+ — E2E](#bài-32-mở-rộng--e2e-với-playwright) ở cuối).

### Nhóm A — tìm được khi đọc code

| # | Vấn đề ở Module 3 | Hậu quả | File sửa |
|---|---|---|---|
| 1 | `GET /orders` không validate query | `page`/`limit` = `undefined` → `buildSkip` ra `NaN` → Prisma trả rác | [csc-shop-api/src/schemas/index.ts](csc-shop-api/src/schemas/index.ts) — thêm `ORDER_STATUSES` + `orderQuerySchema` |
| 2 | `status as any` ở 3 chỗ | gõ sai status là lỗi runtime Postgres, không phải lỗi compile | [csc-shop-api/src/services/orderService.ts](csc-shop-api/src/services/orderService.ts) — dùng enum `OrderStatus` của Prisma |
| 3 | `POST /orders` dùng `authenticate` | guest checkout bị 401 dù storefront quảng cáo là mua được | [csc-shop-api/src/routes/orderRoutes.ts](csc-shop-api/src/routes/orderRoutes.ts) — đổi sang `optionalAuthenticate` |
| 4 | FE gọi `GET /orders/my` | BE chỉ có `/orders/me` → Express match vào `/:id` → 400 | [csc-shop-fe/src/api/orderApi.ts](csc-shop-fe/src/api/orderApi.ts) |
| 5 | FE dùng status `confirmed/shipping/delivered` | BE enum là `pending/paid/shipped/completed/cancelled` → đổi status luôn 400 | [csc-shop-fe/src/pages/admin/AdminOrdersPage.tsx](csc-shop-fe/src/pages/admin/AdminOrdersPage.tsx), [csc-shop-fe/src/pages/MyOrdersPage.tsx](csc-shop-fe/src/pages/MyOrdersPage.tsx) |
| 6 | FE dùng role `"user"` | BE enum là `customer` → đổi vai trò luôn 400 | [csc-shop-fe/src/context/AuthContext.tsx](csc-shop-fe/src/context/AuthContext.tsx), [csc-shop-fe/src/pages/admin/AdminUsersPage.tsx](csc-shop-fe/src/pages/admin/AdminUsersPage.tsx) |

### Nhóm B — chỉ E2E mới bắt được

Điểm chung của cả 7 lỗi: **FE và BE mỗi bên tự nó đều đúng**, chỉ sai khi ghép lại.
Unit test mock đầu bên kia nên vĩnh viễn xanh.

| # | Vấn đề | Hậu quả | File sửa |
|---|---|---|---|
| 7 | Checkout gửi `userName/userEmail/userPhone` + item kèm `title/price/thumbnail` | BE cần `customerName/email/phone` + item `{productId, quantity}` → **mọi lần đặt hàng đều 400** | [CheckoutPage.tsx](csc-shop-fe/src/pages/CheckoutPage.tsx), [types/order.ts](csc-shop-fe/src/types/order.ts) |
| 8 | `authApi.register` không gửi `confirmPassword` | BE `registerSchema` bắt buộc → **không ai đăng ký được** | [api/authApi.ts](csc-shop-fe/src/api/authApi.ts), [RegisterPage.tsx](csc-shop-fe/src/pages/RegisterPage.tsx) |
| 9 | Admin sản phẩm gửi `category` (slug) | BE cần `categoryId` (số) → tạo/sửa sản phẩm luôn 400, **lỗi bị nuốt im lặng**, dialog vẫn đóng như đã lưu | [AdminProductsPage.tsx](csc-shop-fe/src/pages/admin/AdminProductsPage.tsx) |
| 10 | Admin đơn hàng đọc `o.userName` | BE trả `customerName` → cột "Khách" trống trơn | [AdminOrdersPage.tsx](csc-shop-fe/src/pages/admin/AdminOrdersPage.tsx) |
| 11 | "Đơn hàng của tôi" đọc `item.title` | BE `include` product → phải là `item.product.title` → tên sản phẩm trống | [MyOrdersPage.tsx](csc-shop-fe/src/pages/MyOrdersPage.tsx) |
| 12 | Đặt hàng xong, `CLEAR_CART` làm `cartItems.length === 0` → nhánh "giỏ trống" render trước, unmount luôn Snackbar | Khách vừa mua xong **thấy "Chưa có sản phẩm trong giỏ"**, không hề có xác nhận | [CheckoutPage.tsx](csc-shop-fe/src/pages/CheckoutPage.tsx) — thêm màn hình thành công |
| 13 | `npm run prisma:seed` chạy `ts-node` thẳng, không nạp `.env` | Seed chết với "Environment variable not found: DATABASE_URL" (chỉ `npx prisma db seed` mới tự nạp) | [prisma/seed.ts](csc-shop-api/prisma/seed.ts) — thêm `import "dotenv/config"` |

Ngoài ra E2E buộc phải sửa 2 vấn đề **accessibility** có thật (Playwright ưu tiên
`getByRole`/`getByLabel` — đúng thứ screen reader dùng, nên "test không tìm thấy phần tử"
thường là dấu hiệu người khiếm thị cũng không tìm thấy):

- `<InputLabel>` không nối với `<Select>` → combobox **không có tên khả truy cập**.
  Thêm `id` + `labelId`: [HomePage.tsx](csc-shop-fe/src/pages/HomePage.tsx),
  [CheckoutPage.tsx](csc-shop-fe/src/pages/CheckoutPage.tsx).
- IconButton chỉ có icon (giỏ hàng, avatar, đổi theme) **không có `aria-label`** → screen
  reader chỉ đọc "button": [Header.tsx](csc-shop-fe/src/components/layout/Header.tsx),
  [ThemeToggle.tsx](csc-shop-fe/src/components/common/ThemeToggle.tsx).

Refactor thêm:

- [csc-shop-api/src/services/orderService.ts](csc-shop-api/src/services/orderService.ts) —
  vòng lặp `findUnique` từng sản phẩm (N+1) → **một** `findMany({ id: { in: [...] } })`;
  gộp dòng trùng trong giỏ trước khi check tồn kho (2 lần "iPhone × 2" từng qua mặt được
  check stock và bán vượt kho); tách `ORDER_INCLUDE` dùng chung.
- [csc-shop-api/src/middleware/errorHandler.ts](csc-shop-api/src/middleware/errorHandler.ts) —
  `err: any` → `err: unknown` + type guard `isPrismaError`.
- [csc-shop-api/src/controllers/orderController.ts](csc-shop-api/src/controllers/orderController.ts) —
  `req.query as any` → `as unknown as OrderQuery` (interface export từ service).

**Test chốt contract** (đúng yêu cầu "response format `{ success, data, meta }` không đổi sau refactor"):
[csc-shop-api/src/routes/\_\_tests\_\_/productRoutes.test.ts](csc-shop-api/src/routes/__tests__/productRoutes.test.ts)

---

# Bài 32 — Testing & Debug

> Mục tiêu: dự án Module 3 **chưa có test nào**. Dựng hạ tầng test cho cả 2 phía.

### Backend

| File | Vai trò |
|---|---|
| [csc-shop-api/src/app.ts](csc-shop-api/src/app.ts) | Express app, **không** `.listen()` |
| [csc-shop-api/src/server.ts](csc-shop-api/src/server.ts) | chỉ `.listen()` + graceful shutdown |
| [csc-shop-api/vitest.config.mts](csc-shop-api/vitest.config.mts) | `environment: "node"`, inject env test |
| [csc-shop-api/tsconfig.check.json](csc-shop-api/tsconfig.check.json) | typecheck cả `scripts/` + `prisma/` + test (tsconfig build bỏ qua) |

> ⚠️ Việc tách `app.ts` / `server.ts` là **bắt buộc** và là điều kiện của Bài 39 + 40:
> Supertest cần import app mà không được mở port thật.

| Test | Nội dung |
|---|---|
| [src/utils/\_\_tests\_\_/pagination.test.ts](csc-shop-api/src/utils/__tests__/pagination.test.ts) | 9 case cho `buildSkip`/`buildMeta`, gồm edge case: 0 dòng → vẫn 1 trang, bội số chẵn không sinh trang rỗng, xin trang vượt cuối |
| [src/services/\_\_tests\_\_/authService.test.ts](csc-shop-api/src/services/__tests__/authService.test.ts) | mock Prisma: email trùng → 409, password được hash trước khi lưu (`/^\$2[aby]\$/`, 60 ký tự), `select` không chứa `password`/`refreshToken`, sai email và sai mật khẩu trả **cùng một** message |
| [src/routes/\_\_tests\_\_/productRoutes.test.ts](csc-shop-api/src/routes/__tests__/productRoutes.test.ts) | Supertest: format response, Decimal → number, `sortBy` bậy → 400, filter đẩy xuống SQL, header helmet, 401 cho route admin, `/health` ok/503 |

Kỹ thuật đáng nhớ: mock Prisma phải dùng `vi.hoisted()`, vì `vi.mock` bị hoist lên trên
mọi `import` — khai báo `const prismaMock = {...}` thường sẽ lỗi
*"Cannot access 'prismaMock' before initialization"*.

### Frontend

| File | Vai trò |
|---|---|
| [csc-shop-fe/vitest.config.ts](csc-shop-fe/vitest.config.ts) | `environment: "jsdom"` |
| [csc-shop-fe/src/test/setup.ts](csc-shop-fe/src/test/setup.ts) | jest-dom matchers, `cleanup()`, stub `window.matchMedia` (jsdom không có, MUI thì gọi) |
| [src/components/product/\_\_tests\_\_/ProductCard.test.tsx](csc-shop-fe/src/components/product/__tests__/ProductCard.test.tsx) | render đúng data, link đúng, **cả 2 nhánh** còn hàng / hết hàng, thiếu `stock` → coi như hết hàng, thêm vào giỏ, wishlist |
| [src/hooks/\_\_tests\_\_/useDebounce.test.ts](csc-shop-fe/src/hooks/__tests__/useDebounce.test.ts) | fake timers: gõ 5 phím chỉ emit 1 giá trị cuối |

---

# Bài 32 (mở rộng) — E2E với Playwright

> Unit test mock đầu bên kia nên FE và BE có thể **cùng xanh mà vẫn không nói chuyện
> được với nhau**. E2E chạy Chromium thật trên frontend thật + backend thật +
> PostgreSQL thật, và đó là lý do nó tìm ra 7 lỗi tích hợp mà 51 unit test bỏ sót.

### Cấu trúc

```
csc-shop-fe/
├── playwright.config.ts     # 1 lệnh khởi động CẢ backend lẫn frontend rồi chờ /health
├── tsconfig.e2e.json        # e2e cần cả types Node lẫn lib DOM
└── e2e/
    ├── fixtures/
    │   └── test-fixtures.ts # customerPage / adminPage đăng nhập sẵn, mock API tỉnh/thành
    ├── pages/               # Page Object Model
    │   ├── HomePage.ts  LoginPage.ts  CartPage.ts
    │   ├── CheckoutPage.ts  MyOrdersPage.ts  AdminProductsPage.ts
    └── specs/
        ├── home.spec.ts        (7)  — smoke, tìm kiếm, debounce, lọc danh mục
        ├── auth.spec.ts       (15)  — đăng nhập/ký, phiên, phân quyền route
        ├── shopping.spec.ts   (10)  — giỏ hàng + thanh toán end-to-end
        ├── admin.spec.ts       (6)  — CRUD sản phẩm, đổi trạng thái đơn, quản lý user
        ├── ai-suggest.spec.ts (10)  — 3 trạng thái của widget AI
        └── security.spec.ts   (16)  — header, phân quyền, validate, cache trên HTTP thật
```

### Chạy

```bash
cd csc-shop-fe
npx playwright install chromium     # một lần

npm run test:e2e            # headless, song song
npm run test:e2e:headed     # xem trình duyệt chạy
npm run test:e2e:ui         # UI mode — tua lại từng bước, xem DOM snapshot
npm run test:e2e:report     # mở report HTML của lần chạy trước
```

Playwright **tự khởi động** backend + frontend, không cần mở sẵn terminal nào. Chỉ cần
PostgreSQL đang chạy và đã `npm run prisma:push && npm run prisma:seed`.

### Những quyết định đáng chú ý

| Quyết định | Lý do |
|---|---|
| `getByRole` / `getByLabel`, gần như không dùng class CSS | Đó là thứ người dùng thật và screen reader thấy. Đổi style không được làm đỏ test — mà nếu test không tìm ra phần tử thì thường **đúng là lỗi a11y** (xem Bài 31 nhóm B) |
| Page Object Model | Selector của MUI DatePicker/Select nằm ở **một** chỗ. Khi MUI đổi cấu trúc, sửa 1 file thay vì 10 spec |
| Đăng nhập qua **API** trong fixture, không qua UI | Nhanh hơn ~2s mỗi test, và login hỏng không làm 20 test đỏ cùng lúc che mất lỗi thật. Luồng login qua UI vẫn có test riêng |
| Mock `provinces.open-api.vn` | API bên thứ ba down là suite đỏ dù code mình đúng |
| Mock `/ai/suggest` ở hầu hết test AI | Gọi Gemini thật thì chậm, tốn quota, và trả chữ khác nhau mỗi lần nên không assert nổi. Cái đang test là **hành vi UI trước từng loại phản hồi** |
| Nhưng có **1 test cố tình KHÔNG mock** | Xác nhận đường dây thật FE→BE: server chưa có key thì trả 503 kèm message tử tế, UI không kẹt ở "Đang nghĩ" |
| `RATE_LIMIT_*` đọc từ env | E2E bắn hàng trăm request từ 1 IP trong ~2 phút, sẽ đụng trần `generalLimiter` giữa chừng và trông như app hỏng. Mặc định production vẫn 100/10/10 |
| Không có test nào cố tình lĩnh 429 | Sẽ khoá IP 15 phút và làm đỏ mọi spec sau đó. Thay vào đó assert **header `RateLimit-*` có mặt** — chứng minh limiter đã mount mà không đốt hạn mức |
| `retries: 0` ở local, `2` trên CI | Local phải để test flaky lộ ra ngay; CI thì nhiễu hơn thật |
| Mỗi test tự tạo dữ liệu riêng (timestamp) | Chạy song song không giẫm chân nhau, và chạy lại lần 2, lần 3 vẫn xanh |

### Hai cái bẫy của MUI mà E2E dạy được

```ts
// ❌ MUI X DatePicker KHÔNG phải <input>: nó là role="group" gồm 3 section
//    contenteditable + 1 input ẩn -> getByLabel khớp 2 phần tử, .fill() vô tác dụng
await page.getByLabel("Ngày giao").fill("08/08/2026");

// ✅ Click đúng section đầu rồi gõ số; field tự nhảy sang section kế
await group.getByRole("spinbutton", { name: "Month" }).click();
await page.keyboard.type("08082026");
```

```ts
// ❌ Phụ thuộc thứ tự DOM — bắt nhầm nút giỏ hàng khi phiên chưa hydrate xong
await page.locator("header").getByRole("button").last().click();

// ✅ Có aria-label rồi thì Playwright tự chờ đúng nút xuất hiện
await page.getByRole("button", { name: "Tài khoản" }).click();
```

---

# Bài 33 — AI for JavaScript

> Mục tiêu: dùng Gemini như một công cụ dev, chưa phải tính năng cho người dùng.

| File | Nội dung |
|---|---|
| [csc-shop-api/src/lib/gemini.ts](csc-shop-api/src/lib/gemini.ts) | nơi **duy nhất** khởi tạo `GoogleGenAI`; export `GEMINI_MODEL`; đọc key **lazy** để máy không có key vẫn import được (chỉ khi *gọi* mới lỗi) |
| [csc-shop-api/scripts/ai-review.ts](csc-shop-api/scripts/ai-review.ts) | CLI: `npm run ai:review -- <file>` |
| [csc-shop-api/.env.example](csc-shop-api/.env.example) | `GEMINI_API_KEY`, `GEMINI_MODEL` |

```bash
cd csc-shop-api
npm run ai:review -- src/services/orderService.ts
```

Điểm chính của bài: prompt phải **cụ thể** mới hữu ích. Prompt trong script ép thứ tự ưu
tiên `Security → Error Handling → Performance → Clean Code`, bắt ghi mức độ + số dòng +
cách sửa, cấm viết lại cả file. Script cũng chặn file > 100KB và extension lạ trước khi
tốn một lượt gọi API.

---

# Bài 34 — AI for React

> Mục tiêu: đưa AI thành tính năng người dùng thấy được, và rút hook dùng chung.

| File | Nội dung |
|---|---|
| [csc-shop-fe/CLAUDE.md](csc-shop-fe/CLAUDE.md) | convention thật của FE — **cấm gọi Gemini trực tiếp từ browser** |
| [csc-shop-fe/src/api/aiApi.ts](csc-shop-fe/src/api/aiApi.ts) | wrapper gọi `GET /ai/suggest` qua `axiosClient` |
| [csc-shop-fe/src/components/ai/AISuggestWidget.tsx](csc-shop-fe/src/components/ai/AISuggestWidget.tsx) | widget gợi ý sản phẩm — render **đủ 3 trạng thái** loading / error / success |
| [csc-shop-fe/src/hooks/useFetch.ts](csc-shop-fe/src/hooks/useFetch.ts) | hook generic `useFetch<T>(url, params)` gom `useState × 3 + useEffect + AbortController` |
| [csc-shop-fe/src/pages/MyOrdersPage.tsx](csc-shop-fe/src/pages/MyOrdersPage.tsx) | dùng `useFetch` thay khối viết tay — trang này trước đó **không có nhánh error**, request hỏng là kẹt "Loading..." vĩnh viễn |
| [csc-shop-fe/src/hooks/useDebounce.ts](csc-shop-fe/src/hooks/useDebounce.ts) | hoãn giá trị đổi nhanh (ô search) |
| [csc-shop-fe/src/pages/HomePage.tsx](csc-shop-fe/src/pages/HomePage.tsx) | gắn `<AISuggestWidget />` phía trên danh sách; block debounce viết tay → `useDebounce` |
| [src/components/ai/\_\_tests\_\_/AISuggestWidget.test.tsx](csc-shop-fe/src/components/ai/__tests__/AISuggestWidget.test.tsx) | test đủ 3 trạng thái + nhãn "cache" vs "AI" |

Lý do widget phải xử lý error tử tế: gọi LLM chậm ~1–3s và fail thường xuyên hơn API
thường (rate limit / hết quota / timeout). Widget cũng `abort()` request cũ khi user bấm
lần 2, để câu trả lời chậm không ghi đè câu trả lời mới.

---

# Bài 35 — AI for Backend

> Mục tiêu: service Gemini hoàn chỉnh + feature ProductReview.

### AI service

| File | Nội dung |
|---|---|
| [csc-shop-api/src/utils/ttlCache.ts](csc-shop-api/src/utils/ttlCache.ts) | `TTLCache<T>` generic, expire lazy khi đọc |
| [csc-shop-api/src/utils/aiCache.ts](csc-shop-api/src/utils/aiCache.ts) | cache 10 phút cho câu trả lời AI; `cacheKey()` normalize để `" LAPTOP  gaming "` và `"laptop gaming"` dùng chung 1 entry |
| [csc-shop-api/src/services/aiService.ts](csc-shop-api/src/services/aiService.ts) | `callGemini()` · `buildSuggestPrompt()` · `suggestProducts()` |
| [csc-shop-api/src/controllers/aiController.ts](csc-shop-api/src/controllers/aiController.ts) | set `Cache-Control: no-store` |
| [csc-shop-api/src/routes/aiRoutes.ts](csc-shop-api/src/routes/aiRoutes.ts) | `GET /suggest` + `aiLimiter` |
| [csc-shop-api/src/app.ts](csc-shop-api/src/app.ts) | `app.use("/api/v1/ai", aiRoutes)` |
| [src/services/\_\_tests\_\_/aiService.test.ts](csc-shop-api/src/services/__tests__/aiService.test.ts) | 10 test, mock cả Prisma lẫn Gemini |

Ba thứ mà một lời gọi LLM ở production **luôn** cần, và đều nằm trong `aiService.ts`:

1. **Cache** — mỗi lượt gọi tốn tiền + tốn quota ngày.
2. **Timeout** — `AbortController` 15s; không có nó thì một request treo giữ luôn
   connection của Express.
3. **Phân loại lỗi** — 429 ngắn hạn (`retry sau vài giây`, trả 429) khác hoàn toàn hết
   quota ngày (`retry hôm nay vô ích`, trả 503). Message gốc của provider **không bao
   giờ** được trả về client vì có thể chứa API key.

Prompt được `buildSuggestPrompt()` **ground** vào danh mục thật (chỉ sản phẩm còn hàng,
tối đa 20 dòng) và cấm bịa sản phẩm — có test khẳng định câu "không bịa" không bị xoá
khỏi prompt.

### ProductReview

| File | Nội dung |
|---|---|
| [csc-shop-api/prisma/schema.prisma](csc-shop-api/prisma/schema.prisma) | model `ProductReview` — `@@unique([userId, productId])`, `@@index([productId, isVisible])` |
| [csc-shop-api/src/schemas/reviewSchema.ts](csc-shop-api/src/schemas/reviewSchema.ts) | rating 1–5 (số nguyên), comment ≤ 500 |
| [csc-shop-api/src/services/reviewService.ts](csc-shop-api/src/services/reviewService.ts) | list có phân trang + `averageRating`, tạo, xoá, ẩn/hiện |
| [csc-shop-api/src/controllers/reviewController.ts](csc-shop-api/src/controllers/reviewController.ts) | dịch `P2002` → 409 *"You have already reviewed this product"* |
| [csc-shop-api/src/routes/reviewRoutes.ts](csc-shop-api/src/routes/reviewRoutes.ts) | `GET/POST /products/:id/reviews`, `DELETE /reviews/:id`, `PATCH /reviews/:id/visibility` |
| [csc-shop-api/prisma/seed.ts](csc-shop-api/prisma/seed.ts) | seed 3 review mẫu bằng `upsert` |

Chống review trùng bằng **`@@unique` ở DB**, không phải `findFirst` rồi `create` — cách
sau để 2 request đồng thời cùng lọt qua.

```bash
cd csc-shop-api && npm run prisma:push   # dự án dùng db push, không dùng migration file
```

---

# Bài 36 — App Security

| Việc | File |
|---|---|
| `helmet()`, `disable("x-powered-by")` | [csc-shop-api/src/app.ts](csc-shop-api/src/app.ts) |
| `Permissions-Policy` (helmet không tự set): tắt camera/mic/geolocation/payment | [csc-shop-api/src/app.ts](csc-shop-api/src/app.ts) |
| CORS `*` → **whitelist** đọc từ `CORS_ORIGINS` | [csc-shop-api/src/app.ts](csc-shop-api/src/app.ts) |
| `trust proxy: 1` — nếu thiếu, sau Render mọi user trông như cùng 1 IP và bị rate limit chung | [csc-shop-api/src/app.ts](csc-shop-api/src/app.ts) |
| `express.json({ limit: "100kb" })` | [csc-shop-api/src/app.ts](csc-shop-api/src/app.ts) |
| `authLimiter` 10 req/15 phút · `aiLimiter` 10 req/phút · `generalLimiter` 100 req/phút | [csc-shop-api/src/middleware/rateLimiters.ts](csc-shop-api/src/middleware/rateLimiters.ts) |
| `USER_SELECT` — allow-list field của User | [csc-shop-api/src/constants/userSelect.ts](csc-shop-api/src/constants/userSelect.ts) |
| `/api/v1/users` (thiếu hẳn ở Module 3 → trang Admin Users vỡ) | [userService.ts](csc-shop-api/src/services/userService.ts) · [userSchema.ts](csc-shop-api/src/schemas/userSchema.ts) · [userController.ts](csc-shop-api/src/controllers/userController.ts) · [userRoutes.ts](csc-shop-api/src/routes/userRoutes.ts) |
| `/api/v1/stats` từng **public** (lộ doanh thu) → admin-only | [csc-shop-api/src/routes/statsRoutes.ts](csc-shop-api/src/routes/statsRoutes.ts) |
| Ownership check khi xoá review | [csc-shop-api/src/routes/reviewRoutes.ts](csc-shop-api/src/routes/reviewRoutes.ts) |
| Lỗi 500 không echo message nội bộ | [csc-shop-api/src/middleware/errorHandler.ts](csc-shop-api/src/middleware/errorHandler.ts) |
| FE: xác nhận không `VITE_*` nào chứa secret | [csc-shop-fe/.env.example](csc-shop-fe/.env.example) · [.env.production](csc-shop-fe/.env.production) |
| FE: security header cho static site | [csc-shop-fe/vercel.json](csc-shop-fe/vercel.json) |

**Thứ tự đăng ký limiter rất quan trọng** — limiter cụ thể phải mount TRƯỚC, `generalLimiter`
cho `/api/v1` mount SAU cùng:

```ts
app.use("/api/v1/auth/login",    authLimiter);
app.use("/api/v1/auth/register", authLimiter);
app.use("/api/v1",               generalLimiter);   // catch-all, cuối cùng
```

Hai quy tắc nhỏ nhưng quan trọng: `authLimiter` bật `skipSuccessfulRequests` (chỉ đếm
lần đăng nhập **hỏng**, user thật không bị phạt oan), và `userService` chặn admin tự đổi
role / tự xoá chính mình — FE đã disable nút nhưng BE vẫn phải tự bảo vệ.

---

# Bài 37 — High Performance

### Backend

| Việc | File |
|---|---|
| Bật query log (kèm `duration`) khi `NODE_ENV=development` → cách phát hiện N+1 | [csc-shop-api/src/db/prisma.ts](csc-shop-api/src/db/prisma.ts) |
| Index: `Product.categoryId/stock/price/createdAt`, `Order.userId/status/createdAt`, `ProductReview[productId, isVisible]` | [csc-shop-api/prisma/schema.prisma](csc-shop-api/prisma/schema.prisma) |
| Sửa N+1 thật: vòng lặp `findUnique` khi tạo đơn | [csc-shop-api/src/services/orderService.ts](csc-shop-api/src/services/orderService.ts) |
| Cache 10 phút cho danh sách category + invalidate sau mỗi write | [ttlCache.ts](csc-shop-api/src/utils/ttlCache.ts) · [categoryCache.ts](csc-shop-api/src/utils/categoryCache.ts) · [categoryService.ts](csc-shop-api/src/services/categoryService.ts) |
| `Cache-Control: public, max-age=600, stale-while-revalidate=60` cho category | [csc-shop-api/src/controllers/categoryController.ts](csc-shop-api/src/controllers/categoryController.ts) |
| `Cache-Control: no-store` cho gợi ý AI | [csc-shop-api/src/controllers/aiController.ts](csc-shop-api/src/controllers/aiController.ts) |

### Frontend

| Việc | File |
|---|---|
| Lazy load 3 trang Admin bằng `React.lazy` + `Suspense` | [csc-shop-fe/src/router/index.tsx](csc-shop-fe/src/router/index.tsx) |
| `rollup-plugin-visualizer` (chỉ bật khi `ANALYZE=true`) + hạ ngưỡng cảnh báo chunk xuống 400KB | [csc-shop-fe/vite.config.ts](csc-shop-fe/vite.config.ts) |

Kết quả code-splitting sau `npm run build` — 3 trang admin tách hẳn khỏi bundle chính,
người mua hàng không còn phải tải code quản trị:

```
dist/assets/AdminOrdersPage-*.js     1.52 kB
dist/assets/AdminUsersPage-*.js      1.74 kB
dist/assets/AdminProductsPage-*.js   4.18 kB
dist/assets/index-*.js             677.17 kB │ gzip: 209.47 kB
```

> **Đo trước, tối ưu sau.** `npm run build:analyze` mở `dist/stats.html` để xem thật sự
> cái gì nặng. Ở app này thắng lợi đến từ code-splitting, **không** phải từ việc rải
> `React.memo` — chỉ thêm `memo`/`useCallback` sau khi React DevTools Profiler chứng
> minh component đó render thừa.

---

# Bài 38 — Frontend Deployment (Vercel)

| File | Nội dung |
|---|---|
| [csc-shop-fe/vercel.json](csc-shop-fe/vercel.json) | **rewrite `/(.*)` → `/index.html`** (thứ vỡ đầu tiên khi deploy SPA: F5 ở `/cart` sẽ 404 vì path đó không có file thật) + cache asset 1 năm, `index.html` no-cache + security header |
| [csc-shop-fe/.env.production](csc-shop-fe/.env.production) | chỉ chứa `VITE_API_URL` — **không** secret |
| [csc-shop-fe/.env.example](csc-shop-fe/.env.example) | ghi rõ vì sao `VITE_*` không được chứa key |
| [csc-shop-fe/package.json](csc-shop-fe/package.json) | `build` = `tsc -b && vite build` (Module 3 chỉ chạy `vite build` nên lỗi type không bao giờ lộ ra) |
| [csc-shop-fe/tsconfig.node.json](csc-shop-fe/tsconfig.node.json) | thêm `types: ["node"]` cho `vite.config.ts` |
| [csc-shop-fe/src/api/axiosClient.ts](csc-shop-fe/src/api/axiosClient.ts) | đã đọc `import.meta.env.VITE_API_URL` với fallback localhost — kiểm tra, giữ nguyên |

Bật typecheck trong `build` làm lộ **24 lỗi TypeScript** có sẵn từ Module 3: MUI v9
không còn nhận style prop trần (`mt`, `mb`, `fontWeight`, `alignItems`…), chúng phải nằm
trong `sx`. Đã sửa hết ở 12 file: `HeroBanner`, `CardSummary`, `CartItem`, `Loading`,
`Footer`, `ProductCard`, `ProductInfo`, `MyOrdersPage`, 3 trang `admin/*`, và
`AISuggestWidget`.

**Làm tay trên dashboard**: đăng ký Vercel → connect GitHub repo → Root Directory =
`Module-4/csc-shop-fe` → set `VITE_API_URL` trong Project Settings → Deploy. Sau khi có
domain Vercel, nhớ thêm domain đó vào `CORS_ORIGINS` của backend (Bài 36).

---

# Bài 39 — Backend Deployment (Render)

| Việc | File |
|---|---|
| `build`/`start`/`main` trỏ đúng `dist/server.js`, `engines.node` | [csc-shop-api/package.json](csc-shop-api/package.json) |
| `app.ts` (config) tách hẳn khỏi `server.ts` (`.listen()`) | [app.ts](csc-shop-api/src/app.ts) · [server.ts](csc-shop-api/src/server.ts) |
| `GET /health` chạy `prisma.$queryRaw\`SELECT 1\`` → `{ status, database, uptime }`, DB chết thì trả **503** | [csc-shop-api/src/app.ts](csc-shop-api/src/app.ts) |
| Prisma **Singleton** | [csc-shop-api/src/db/prisma.ts](csc-shop-api/src/db/prisma.ts) |
| Graceful shutdown khi nhận SIGTERM | [csc-shop-api/src/server.ts](csc-shop-api/src/server.ts) |
| Seed **idempotent** (toàn `upsert`) | [csc-shop-api/prisma/seed.ts](csc-shop-api/prisma/seed.ts) |

Hai chi tiết dễ mất dữ liệu / mất connection:

- Seed cũ bắt đầu bằng `deleteMany()` toàn bộ bảng. Trên laptop thì vô hại, trên Render
  thì xoá sạch đơn hàng thật nếu pipeline chạy lại seed. Bản mới chỉ `upsert`, `stock`
  **không** nằm trong nhánh `update` (re-seed không được âm thầm nhập kho lại), và đơn
  hàng mẫu chỉ tạo khi bảng còn rỗng.
- Free tier của Render chỉ có ~97 connection. `new PrismaClient()` ở mỗi file sẽ mở pool
  riêng và làm cạn quota — vì thế cả app dùng đúng một instance, và `server.ts` gọi
  `prisma.$disconnect()` khi nhận SIGTERM.

**Làm tay trên dashboard**: tạo PostgreSQL + Web Service trên Render → Build Command
`npm ci && npx prisma generate && npm run build` → Start Command `npm start` → set
`DATABASE_URL`, `JWT_*`, `CORS_ORIGINS`, `GEMINI_API_KEY` → Health Check Path `/health`
→ copy Deploy Hook cho Bài 40.

---

# Bài 40 — DevOps Fundamentals & CI/CD

| File | Nội dung |
|---|---|
| [csc-shop-api/Dockerfile](csc-shop-api/Dockerfile) | multi-stage `builder` → `production`; `npm prune --omit=dev`; chạy bằng user `node` (không root); `HEALTHCHECK`; `CMD ["node","dist/server.js"]` |
| [csc-shop-api/.dockerignore](csc-shop-api/.dockerignore) | loại `node_modules/`, `dist/`, **`.env`**, test, `.git/` |
| [csc-shop-api/docker-compose.yml](csc-shop-api/docker-compose.yml) | `db` (postgres:16-alpine + healthcheck `pg_isready` + volume) và `backend` (`depends_on: condition: service_healthy`) |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | 4 job: `backend` (typecheck+test+build) · `frontend` · `e2e` (Playwright, **service container PostgreSQL 16**, `needs: [backend, frontend]`) · `docker` (build + **Trivy** `CRITICAL,HIGH`, `exit-code: 1`). `permissions: contents: read`, `cache: npm`, upload `playwright-report` làm artifact |
| [.github/workflows/cd.yml](.github/workflows/cd.yml) | job `deploy` `needs: verify`, chỉ chạy khi push `main`, `curl --fail` tới `secrets.RENDER_DEPLOY_HOOK` |
| [.github/dependabot.yml](.github/dependabot.yml) | `github-actions` + `npm` (một entry cho mỗi package) + `docker`, `interval: weekly`, gom minor/patch vào 1 PR |

Ba cái bẫy kinh điển đều đã xử lý:

- **`.env` lọt vào image.** `COPY . .` mà không có `.dockerignore` sẽ nướng secret vào
  một layer mà ai pull image cũng đọc lại được.
- **`localhost` trong connection string của compose.** Trong mạng compose mỗi service
  gọi nhau bằng **tên service** — phải là `postgresql://...@db:5432/...`, `localhost`
  ở đây nghĩa là chính container backend.
- **`depends_on` không đợi Postgres sẵn sàng.** Nó chỉ đợi container *khởi động*; thiếu
  `condition: service_healthy` thì backend crash-loop ở lần boot đầu.

Base image dùng `node:22-bookworm-slim` (glibc) chứ không phải `-alpine`: `bcrypt` có
sẵn binary prebuilt cho glibc, trên alpine (musl) npm sẽ phải biên dịch từ source và cần
thêm python3/make/g++ trong image.

> ⚠️ **GitHub chỉ đọc `.github/` ở ROOT của repository.** Repo khoá học này chứa nhiều
> module nên `.github/` được đặt ở `Module-4/`. Muốn nó chạy thật: copy `.github/` lên
> root repo rồi đổi `working-directory` thành `Module-4/csc-shop-api` /
> `Module-4/csc-shop-fe`. Nó được đặt ở đây thay vì root ngay từ đầu là có chủ ý — thêm
> workflow vào root sẽ làm MỌI push của repo khoá học chạy CI, và `cd.yml` sẽ đỏ vì
> chưa có secret.

**Làm tay**: thêm `RENDER_DEPLOY_HOOK` vào GitHub Secrets, và chạy thử
`docker compose up -d` ở local.

---

## Checklist tổng thể

- [x] `npm run build` (cả FE và BE) — không lỗi TypeScript
- [x] `npm test` unit (cả FE và BE) — 33 + 18 pass
- [x] `npm run test:e2e` — 64 pass trên Chromium thật + API thật + PostgreSQL thật,
      xanh lại khi chạy lần 2 và lần 3 liên tiếp
- [ ] `docker compose up -d` + `curl /health` — **còn lại cho bạn**: Docker daemon không
      chạy trên máy lúc implement nên `Dockerfile` / `docker-compose.yml` chưa được
      build thử lần nào
- [x] Không còn `any` ở code mới; `any` cũ trong `errorHandler`/`orderController` đã được thay
- [x] Không secret nào lọt vào biến `VITE_*` hay bị commit trong `.env`
- [x] `CLAUDE.md` tồn tại ở cả 2 project và mô tả đúng convention thật sau khi implement
- [x] 13 lỗi tích hợp từ Module 3 đã sửa, mỗi lỗi có ít nhất 1 test chặn hồi quy
