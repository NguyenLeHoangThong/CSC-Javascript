# csc-shop-fe — Module 4

Frontend của CSC Shop: React 19 + Vite 8 + TypeScript + MUI v9.
Kế thừa nguyên trạng từ `Module-3/Bai10/BaiTap/bai-10.1`, được nâng cấp qua Bài 31→40.

> Bản đồ đầy đủ "bài học → file" nằm ở [../README.md](../README.md).
> Convention bắt buộc khi viết code mới: [CLAUDE.md](CLAUDE.md).

---

## Chạy local

```bash
cp .env.example .env          # VITE_API_URL=http://localhost:3000/api/v1
npm install
npm run dev                   # http://localhost:5173
```

Cần `../csc-shop-api` đang chạy ở cổng 3000 (và đã `npm run prisma:seed`).

---

## Scripts

| Lệnh | Việc |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b && vite build` — **type check rồi mới build** |
| `npm test` | Vitest + Testing Library (18 test) |
| `npm run build:analyze` | build + mở `dist/stats.html` (treemap bundle) |
| `npm run preview` | serve thử bản build |

---

## Có gì mới so với Module 3

| Tính năng | File |
|---|---|
| Widget gợi ý sản phẩm bằng AI | `src/components/ai/AISuggestWidget.tsx` + `src/api/aiApi.ts` |
| Hook dùng lại: `useFetch`, `useDebounce` | `src/hooks/` |
| Test: ProductCard, AISuggestWidget, useDebounce | `src/**/__tests__/` |
| Lazy load 3 trang Admin | `src/router/index.tsx` |
| Cấu hình deploy Vercel | `vercel.json`, `.env.production` |

Và **6 lỗi tích hợp có thật từ Module 3** đã được sửa (gọi sai `/orders/my`, sai tên
`OrderStatus`, sai tên `Role`, cùng 24 lỗi TypeScript mà `vite build` không hề báo vì
Module 3 không chạy `tsc`). Chi tiết ở [../README.md](../README.md) mục Bài 31 và 38.

---

## Lưu ý bảo mật

Mọi biến `VITE_*` đều **bị compile vào bundle** và ai cũng đọc được. Chỉ đặt URL công
khai ở đây. API key của Gemini nằm ở backend — FE gọi `GET /api/v1/ai/suggest`, không
bao giờ gọi thẳng Google.
