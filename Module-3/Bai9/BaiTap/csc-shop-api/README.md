# CSC Shop API — Bài 9: Backend hoàn chỉnh (Full-stack)

Đây là **backend cuối cùng** của chuỗi CSC Shop. Code giống Bài 8 (đầy đủ CRUD + auth + RBAC + ownership),
được dùng làm API thật cho frontend React ở thư mục `../csc-shop-fe`.

## 🧩 Toàn cảnh full-stack

```
Bai9/BaiTap/
├── csc-shop-api/   ← backend (file này) — Express + Prisma + PostgreSQL, chạy ở :3000
└── csc-shop-fe/    ← frontend React + Vite + MUI, chạy ở :5173, gọi vào API :3000
```

## 🚀 Chạy backend trước

```bash
cd csc-shop-api
npm install
cp .env.example .env          # sửa DATABASE_URL + JWT secrets
npm run prisma:migrate
npm run prisma:seed
npm run dev                   # http://localhost:3000
```

Tài khoản mẫu:
- `admin@cscshop.com` / `Admin@123456` (admin — quản lý sản phẩm)
- `customer@cscshop.com` / `Customer@123` (customer — mua hàng)

## 📡 API mà frontend sử dụng

| Method | Endpoint | Dùng ở màn hình |
|--------|----------|-----------------|
| GET | `/api/v1/products?...` | Trang chủ (lọc/sort/tìm kiếm) |
| GET | `/api/v1/products/:id` | Chi tiết sản phẩm |
| GET | `/api/v1/categories` | Bộ lọc category |
| POST | `/api/v1/auth/register` | Đăng ký |
| POST | `/api/v1/auth/login` | Đăng nhập |
| GET | `/api/v1/auth/me` | Lấy user hiện tại |
| POST | `/api/v1/orders` | Đặt hàng (cần đăng nhập) |
| GET | `/api/v1/orders/me` | Đơn hàng của tôi |

## 📖 Chi tiết kiến thức

Toàn bộ kiến trúc, bảng phân quyền, transaction, aggregate… đã giải thích ở README các bài
trước (Bài 5 → Bài 8). Bài 9 không thêm khái niệm backend mới — trọng tâm là **ghép frontend + backend**
thành ứng dụng hoàn chỉnh.

> Xem `../csc-shop-fe/README.md` để chạy frontend.
