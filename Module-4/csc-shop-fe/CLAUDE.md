# CLAUDE.md — csc-shop-fe

Hướng dẫn cho AI coding assistant (Claude Code, Copilot, Cursor…) khi làm việc trong
repo này. Viết đúng những gì dự án **đang** làm, không phải best-practice chung chung —
một file CLAUDE.md mô tả sai còn tệ hơn không có.

---

## Stack

| Thành phần | Lựa chọn |
|---|---|
| Build | Vite 8 + React 19 + TypeScript (strict) |
| UI | MUI v9 (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`) |
| Routing | react-router-dom v7, `createBrowserRouter` |
| Form | react-hook-form + yup qua `@hookform/resolvers` |
| HTTP | axios, tập trung ở `src/api/axiosClient.ts` |
| State | React Context (`CartProvider`, `AuthContext`) — **không** dùng Redux/Zustand |
| Test | Vitest + @testing-library/react (jsdom) · Playwright (E2E, Chromium) |

Backend đi kèm: `../csc-shop-api` (Express + Prisma + PostgreSQL).

---

## Quy tắc BẮT BUỘC

### 1. Không bao giờ gọi Gemini (hay bất kỳ AI provider nào) trực tiếp từ FE

Mọi thứ trong `import.meta.env.VITE_*` đều **bị compile thẳng vào bundle JS** và ai mở
DevTools cũng đọc được. API key phải nằm ở backend.

```ts
// ❌ SAI — key lộ cho toàn bộ người dùng
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

// ✅ ĐÚNG — gọi qua API của mình
const res = await aiApi.suggest(query);   // -> GET /api/v1/ai/suggest
```

Chỉ `VITE_API_URL` (một URL công khai) được phép tồn tại trong `.env*`.

### 2. Mọi request đi qua `axiosClient`

`src/api/axiosClient.ts` đã gắn sẵn access token, tự refresh khi 401, và đọc `baseURL`
từ env. Gọi `axios.get(...)` hay `fetch(...)` trực tiếp là bỏ qua toàn bộ phần đó.

### 3. Style props phải nằm trong `sx`

MUI v9 **không** nhận `mt`, `mb`, `fontWeight`, `alignItems`… như prop trần nữa —
chúng sẽ rơi xuống DOM và tsc báo lỗi.

```tsx
<Typography variant="h4" fontWeight={700} mb={3}>   {/* ❌ */}
<Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>   {/* ✅ */}
```

### 4. Tên trạng thái / vai trò phải khớp backend

- `OrderStatus`: `pending | paid | shipped | completed | cancelled`
- `Role`: `customer | admin` (**không** phải `user`)

Lệch tên là lỗi runtime 400, TypeScript không bắt được vì đó chỉ là string.

### 5. Fetch phải có `AbortController`

Dùng `useFetch<T>()` (`src/hooks/useFetch.ts`) thay vì tự viết lại
`useState + useEffect + try/catch`. Nếu buộc phải viết tay thì vẫn phải abort khi
unmount, nếu không response cũ sẽ ghi đè response mới.

### 6. Nút chỉ có icon PHẢI có `aria-label`; `<Select>` phải nối với `<InputLabel>`

```tsx
<IconButton onClick={...}>            {/* ❌ screen reader chỉ đọc "button" */}
<IconButton aria-label="Giỏ hàng">    {/* ✅ */}

<InputLabel>Danh mục</InputLabel>                          {/* ❌ combobox vô danh */}
<Select label="Danh mục" ...>

<InputLabel id="category-label">Danh mục</InputLabel>      {/* ✅ */}
<Select labelId="category-label" label="Danh mục" ...>
```

Không chỉ là chuyện a11y: E2E tìm phần tử bằng `getByRole`/`getByLabel`, nên thiếu tên
khả truy cập là test phải bám vào thứ tự DOM và trở nên flaky.

### 7. Feature gọi AI phải render đủ 3 trạng thái

`loading` / `error` / `success`. Gọi LLM chậm (~1–3s) và fail thường xuyên hơn API
thường (rate limit, hết quota, timeout) — thiếu nhánh error là bug chắc chắn xảy ra,
không phải trường hợp hiếm. Xem `src/components/ai/AISuggestWidget.tsx`.

---

## Cấu trúc thư mục

```
src/
├── api/            # axios wrapper theo resource (authApi, productApi, aiApi…)
├── components/
│   ├── ai/         # widget dùng AI
│   ├── cart/  common/  layout/  product/  banners/
├── context/        # CartProvider (useReducer), AuthContext (useState)
├── hooks/          # useFetch, useDebounce — hook dùng lại
├── pages/          # 1 file = 1 route; pages/admin/* được lazy load
├── router/         # createBrowserRouter + ProtectedRoute
├── schemas/        # yup schema cho form
├── services/       # gọi api/ rồi map về type của UI
├── test/           # setup.ts cho vitest
└── types/          # type dùng chung

e2e/                # Playwright — KHÔNG import gì từ src/ ngoài type
├── fixtures/       # test-fixtures.ts: customerPage/adminPage, mock API bên thứ ba
├── pages/          # Page Object Model
└── specs/          # home / auth / shopping / admin / ai-suggest / security
```

**Quy ước đặt tên**: file component/page dùng `PascalCase.tsx`, mọi thứ khác dùng
`camelCase.ts`. Service đặt là `<name>Service.ts`, api wrapper là `<name>Api.ts`.

---

## Lệnh hay dùng

```bash
npm run dev             # http://localhost:5173
npm run build           # tsc -b && vite build  (PHẢI pass trước khi commit)
npm run test:unit       # vitest run
npm run test:e2e        # playwright (tự khởi động cả backend lẫn frontend)
npm run test:e2e:ui     # UI mode để debug test đỏ
npm run build:analyze   # dist/stats.html — treemap của bundle
```

---

## Viết E2E (`e2e/`)

- Selector: `getByRole` / `getByLabel` / `getByPlaceholder`. **Không** dùng class CSS,
  trừ badge của MUI (không có role nào) — và khi đó phải scope trong một locator có role.
- **Không** `waitForTimeout()`. Dùng auto-waiting của `expect()`, `waitForResponse()`,
  hoặc `expect.poll()`.
- Selector của component phức tạp (MUI Select, DatePicker) sống trong `e2e/pages/*.ts`,
  không rải trong spec.
- Đăng nhập trong test: dùng fixture `customerPage` / `adminPage` (đăng nhập qua API),
  đừng điền lại form login ở mỗi test.
- Mỗi test tự tạo dữ liệu riêng có timestamp — chạy song song và chạy lại nhiều lần
  đều phải xanh.
- Mock mọi thứ NGOÀI hệ thống của mình (API tỉnh/thành, Gemini). **Không** mock API của
  chính mình, trừ khi đang test riêng một trạng thái lỗi khó tái tạo.

## Khi thêm code mới

- Trang admin mới → thêm vào `router/index.tsx` bằng `lazy()` + `lazyAdminRoute()`.
- Endpoint mới → thêm hàm vào `src/api/<name>Api.ts`, đừng gọi URL rải rác trong page.
  **Kiểm tra tên field khớp schema Yup của backend** — đây là nguồn lỗi số 1 của dự án này.
- Component có logic điều kiện (badge, disable, empty state) → viết test cho **cả hai
  nhánh**, không chỉ nhánh happy path.
- Luồng người dùng thật đi qua (mua hàng, đăng nhập, CRUD admin) → thêm E2E, vì unit
  test không bao giờ bắt được lỗi FE/BE lệch nhau.
