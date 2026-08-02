# CSC Shop — Frontend (Bài 9)

Frontend React + TypeScript + MUI cho **CSC Shop**, nối trực tiếp tới backend thật ở
`../csc-shop-api` (không còn dùng FakeStoreAPI). Đây là phần "đầy đủ" của bài 9: duyệt sản phẩm,
giỏ hàng + wishlist (localStorage), **đăng nhập/đăng ký**, đặt hàng và xem **đơn hàng của tôi**.

## 🎯 Điểm khác so với bản gốc (Module-2 / bai-10)

| Bản gốc (bai-10) | Bản này (Bài 9) |
|------------------|-----------------|
| Gọi FakeStoreAPI / jsonplaceholder | Gọi backend CSC Shop (`/api/v1`) |
| Không có đăng nhập | `AuthProvider` + Login/Register, JWT lưu localStorage |
| Checkout gửi lên jsonplaceholder | Checkout POST `/orders` (cần đăng nhập) |
| — | Trang **My Orders** (`GET /orders/me`) |
| — | Axios interceptor tự gắn token + tự refresh khi 401 |
| — | `ProtectedRoute` chặn `/checkout`, `/orders` nếu chưa đăng nhập |

## 🚀 Chạy

> ⚠️ Phải chạy backend (`../csc-shop-api`) trước ở cổng 3000.

```bash
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:3000/api/v1
npm run dev                   # http://localhost:5173
```

Đăng nhập bằng tài khoản seed của backend:
- `customer@cscshop.com` / `Customer@123` (mua hàng)
- `admin@cscshop.com` / `Admin@123456`

## 🗂️ Cấu trúc chính

```
src/
├── api/axiosClient.ts        # axios instance + interceptor token/refresh
├── context/
│   ├── AuthProvider.tsx      # user, login, register, logout (JWT)
│   └── CartProvider.tsx      # giỏ hàng + wishlist (localStorage)
├── services/                 # productService, categoryService, orderService, authService
├── pages/
│   ├── HomePage.tsx          # danh sách + filter/sort/search
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx      # đặt hàng (ProtectedRoute)
│   ├── MyOrdersPage.tsx      # đơn của tôi (ProtectedRoute)
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── components/common/ProtectedRoute.tsx
└── router/index.tsx
```

## 🔎 Ghi chú cho học viên

- **axiosClient**: `request interceptor` gắn `Authorization: Bearer <token>`; `response interceptor`
  bắt lỗi 401 → gọi `/auth/refresh` 1 lần → thử lại request cũ.
- **AuthProvider**: khi load lại trang, nếu có token trong localStorage thì gọi `/auth/me` để khôi phục phiên.
- **ProtectedRoute**: chờ `loading` xong rồi mới quyết định redirect — tránh "nháy" trang login.
- Giỏ hàng vẫn lưu ở localStorage (client-side), chỉ khi **đặt hàng** mới gửi lên server.

## 🛠️ Build

`npm run build` dùng `vite build` (esbuild) để đóng gói `dist/`.
