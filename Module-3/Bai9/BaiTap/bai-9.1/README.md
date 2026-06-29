# Bài 9.1 — CSC Shop: Kết nối Frontend với Backend (CORE)

**Bài tập CSC Shop** của Bài 9. Lấy frontend CSC Shop (Module 2) và đấu nối vào `shop-backend`
thật (Bài 8.2) — thay FakeStore/jsonplaceholder bằng API thật.

> Phần BONUS (đăng nhập/đăng ký, my orders, trang admin) nằm ở **Bài 10.1**.

## 🎯 Phần CORE (buổi này)
- `api/axiosClient.ts`: `baseURL` đọc từ `VITE_API_URL`, interceptor tự gắn token + tự refresh khi 401
- `services/productService.ts`: bỏ `normalizeProduct` (BE trả đúng shape `Product`), gọi `/products`, đọc `res.data.data`
- `services/categoryService.ts`: gọi `/categories`
- `services/orderService.ts`: gọi `POST /orders`, payload có snapshot `title`/`price`/`thumbnail` từng item
- `ProductCard`: disable "Thêm vào giỏ" khi `stock === 0`
- `CheckoutPage`: bắt lỗi **409** (hết hàng) → hiện message từ BE

## 🚀 Chạy
> Phải chạy `shop-backend` (Bài 8.2) trước ở cổng 3000.
```bash
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:3000/api/v1
npm run dev                   # http://localhost:5173
```

## 🔎 Ghi chú cho học viên
- Response BE luôn bọc `{ success, data, meta }` → mọi chỗ đọc `res.data` (kiểu FakeStore cũ) đổi thành `res.data.data`.
- `getProducts` trả `{ products, total }` để `HomePage` dùng trực tiếp; lọc giá/sort làm phía client (giống Module 2).
- Đặt hàng vẫn chạy ở chế độ **guest** (chưa cần đăng nhập) — Bài 10 thêm UI đăng nhập.

## 🛠️ Build
`npm run build` dùng `vite build` (esbuild). Lưu ý: bản MUI dùng trong project có type khá chặt nên
không dùng `tsc -b` trong bước build (giống dự án gốc Module 2).

## ➡️ Buổi sau
Bài 10.1 — hoàn thiện FE: AuthContext + Login/Register, My Orders, và dashboard Admin.
