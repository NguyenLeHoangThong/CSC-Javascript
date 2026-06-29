# Bài 10.1 — CSC Shop: Hoàn thiện Frontend (Full-stack)

**Bài tổng kết Module 3.** Hoàn thiện toàn bộ frontend CSC Shop để khai thác hết `shop-backend`:
đăng nhập/đăng ký, đơn hàng của tôi, và dashboard Admin (sản phẩm/đơn hàng/người dùng).

## 🆕 So với Bài 9.1
| Phần | File |
|------|------|
| Quản lý phiên đăng nhập | `context/AuthContext.tsx` (+ hydrate qua `/auth/me`) |
| Đăng nhập / Đăng ký | `pages/LoginPage.tsx`, `pages/RegisterPage.tsx` |
| Header có trạng thái đăng nhập + menu | `components/layout/Header.tsx` |
| Route guard | `router/ProtectedRoute.tsx` (chờ `loading` rồi mới redirect) |
| Đơn hàng của tôi | `pages/MyOrdersPage.tsx` → `GET /orders/my` |
| Admin sản phẩm (CRUD + Dialog) | `pages/admin/AdminProductsPage.tsx` |
| Admin đơn hàng (đổi status) | `pages/admin/AdminOrdersPage.tsx` → `PATCH /orders/:id/status` |
| Admin người dùng (đổi role/xóa) | `pages/admin/AdminUsersPage.tsx` |
| API wrappers | `src/api/{authApi,orderApi,productApi,userApi,categoryApi}.ts` |

## 🚀 Chạy
> Chạy `shop-backend` (Bài 8.2) trước ở cổng 3000 (`npm run prisma:seed` để có tài khoản admin).
```bash
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:3000/api/v1
npm run dev                   # http://localhost:5173
```
Đăng nhập admin: `admin@shop.com / Admin@123456` → thấy menu **Quản lý**.
Khách hàng: `customer@shop.com / Customer@123`.

## 🔎 Ghi chú cho học viên
- `AuthContext` dùng `useState` (đơn giản hơn `useReducer` vì auth ít action) + custom hook `useAuth()`.
- `ProtectedRoute` **chờ `loading`** xong mới quyết định redirect — tránh "đá" user đã đăng nhập về `/login` khi F5.
- Admin pages: sau mỗi thao tác (tạo/sửa/xóa) **load lại danh sách** từ server thay vì tự sửa state → tránh lệch dữ liệu.
- Trang admin tự disable nút đổi-role/xóa với chính tài khoản đang đăng nhập (BE cũng đã chặn → 400).

## ✅ Checklist test end-to-end
1. Đăng ký user mới → đăng nhập → mua hàng → vào "Đơn hàng của tôi" thấy đơn.
2. Đăng xuất → mua tiếp (guest checkout) → vẫn đặt được, không lưu vào "của tôi".
3. Đăng nhập admin → `/admin/products` thêm/sửa/xóa sản phẩm.
4. `/admin/orders` đổi trạng thái 1 đơn.
5. `/admin/users` thử đổi role/xóa chính mình → nút bị disable.
6. Đăng xuất admin → mở thẳng `/admin/products` qua URL → bị redirect về `/`.

## 🛠️ Build
`npm run build` = `vite build` (esbuild).
