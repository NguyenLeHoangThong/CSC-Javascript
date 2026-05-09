# Bài 1: UI Cơ Bản – Trang Danh Sách Sản Phẩm

## Kiến thức trọng tâm

- JSX: viết HTML trong JavaScript
- Component: tách giao diện thành các khối tái sử dụng
- Props: truyền dữ liệu từ component cha xuống con
- Render list: dùng `.map()` để render danh sách, luôn có `key`
- Conditional rendering: hiển thị khác nhau tùy điều kiện

---

## Yêu cầu

- **Tạo data sản phẩm tĩnh** trong file `products.js`:
  - Mỗi sản phẩm có: `id`, `name`, `price`, `image`.
  - Có ít nhất 2 sản phẩm.

- **Tạo component `ProductCard`**:
  - Nhận prop `product`.
  - Hiển thị: ảnh, tên, giá (format số có dấu phân cách + ký hiệu ₫).
  - Có style cơ bản: border, border-radius, padding.

- **Render danh sách trong `App.jsx`**:
  - Import `products` và `ProductCard`.
  - Dùng `.map()` để render từng `ProductCard`.
  - Mỗi item phải có prop `key={item.id}`.

- **Empty state**:
  - Nếu mảng `products` rỗng, hiển thị `"Không có sản phẩm nào."`.

---

## Hướng dẫn

### Bước 1: Tạo file `src/products.js`

Đây là nguồn dữ liệu tĩnh cho toàn bộ project. Các bài sau sẽ dùng lại và mở rộng file này.

```js
// src/products.js
export const products = [
  {
    id: 1,
    name: "iPhone 15",
    price: 20000000,
    image: "https://via.placeholder.com/200x150?text=iPhone+15",
  },
  {
    id: 2,
    name: "Samsung S23",
    price: 18000000,
    image: "https://via.placeholder.com/200x150?text=Samsung+S23",
  },
];
```

---

### Bước 2: Tạo component `ProductCard`

Tạo file `src/components/product/ProductCard.jsx`. Component này nhận một prop `product` và hiển thị thông tin của sản phẩm đó.

```jsx
// src/components/product/ProductCard.jsx
const ProductCard = ({ product }) => (
  <div
    className="product-card"
    style={{
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
      textAlign: "center",
      margin: 8,
      background: "#fff",
    }}
  >
    <img src={product.image} alt={product.name} width={200} style={{ borderRadius: 4 }} />
    <h3 style={{ fontSize: 15, margin: "10px 0 4px" }}>{product.name}</h3>
    <p style={{ color: "#e53935", fontWeight: 600, margin: "4px 0" }}>
      {product.price.toLocaleString("vi-VN")}₫
    </p>
  </div>
);

export default ProductCard;
```

> **Giải thích:**
> - `{ product }` là destructuring props — lấy trực tiếp `product` từ props object.
> - `.toLocaleString("vi-VN")` format số theo chuẩn Việt Nam: `20.000.000`.
> - `className="product-card"` để có thể style thêm bằng CSS.

---

### Bước 3: Render danh sách trong `App.jsx`

```jsx
// src/App.jsx
import { products } from "./products";
import ProductCard from "./components/product/ProductCard";

function App() {
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <h1>CSC Shop</h1>
<h2>Fast shipping, curated products, and a floral-themed modern shopping experience.</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
```

> **Giải thích:**
> - `products.map((item) => ...)` duyệt qua từng phần tử và trả về JSX.
> - `key={item.id}` bắt buộc khi render list — React dùng key để theo dõi từng phần tử.
> - Toán tử ternary `condition ? A : B` để render có điều kiện.

---

### Bước 4: Thêm CSS cơ bản vào `index.css`

```css
/* src/index.css */
body {
  font-family: Arial, sans-serif;
  background: #f9f9f9;
  margin: 0;
  padding: 0;
}

.product-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
}

.product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
```

---

### Bước 5: Kiểm tra

- [ ] Chạy `npm run dev`, mở trình duyệt.
- [ ] Thấy danh sách sản phẩm với ảnh, tên, giá.
- [ ] Giá hiển thị đúng format: `20.000.000₫`.
- [ ] Thử xóa hết sản phẩm trong `products.js` → thấy thông báo "Không có sản phẩm nào."

---

## Cấu trúc file sau bài 1

```
src/
├── components/
│   └── product/
│       └── ProductCard.jsx     ← mới
├── App.jsx                     ← cập nhật
├── index.css
├── main.jsx
└── products.js                 ← mới
```

---

## Tổng kết kiến thức bài 1

| Khái niệm | Áp dụng trong bài |
|---|---|
| JSX | Viết giao diện trong `return (...)` |
| Component | `ProductCard` — tách UI thành khối độc lập |
| Props | Truyền `product` từ `App` xuống `ProductCard` |
| Render list | `.map()` + `key` để render danh sách sản phẩm |
| Conditional rendering | Ternary để hiện empty state khi không có sản phẩm |

---

**Lưu ý:**
- GV cung cấp toàn bộ template project (Vite + React) cho học viên, học viên chỉ cần viết code.
- Bài này là nền tảng — các bài sau đều build tiếp trên cấu trúc này.
