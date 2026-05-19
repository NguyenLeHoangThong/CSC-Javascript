# Bài 4: React Router – Navigation

## Kiến thức trọng tâm

- `react-router-dom`: cài đặt và cấu hình routing
- `BrowserRouter`, `Routes`, `Route`: định nghĩa các trang
- `Link`, `useNavigate`: điều hướng giữa các trang
- `useParams`: lấy tham số động từ URL (ví dụ: `/product/:id`)
- Layout chung: `Outlet` để render trang con bên trong layout

---

## Yêu cầu

- **Cài đặt React Router** và cấu hình routing cho toàn app.

- **Tạo các trang (pages)**:
  - `HomePage`: trang chủ — danh sách sản phẩm (giữ nguyên từ bài 3).
  - `ProductDetailPage`: trang chi tiết — hiển thị thông tin 1 sản phẩm theo `id` từ URL.
  - `CartPage`: trang Shopping Cart — placeholder "Shopping Cart (sẽ làm ở bài 8)".

- **Layout chung `MainLayout`**:
  - Có `Header` với logo/tên shop và link điều hướng (Trang chủ, Shopping Cart).
  - Có `Footer` đơn giản.
  - Dùng `<Outlet />` để render nội dung trang con.

- **Điều hướng**:
  - Click vào `ProductCard` → chuyển đến trang chi tiết `/product/:id`.
  - Header có link về trang chủ và trang Shopping Cart.
  - Trang chi tiết có nút "Quay lại" dùng `useNavigate(-1)`.

- **Trang chi tiết sản phẩm**:
  - Dùng `useParams` lấy `id` từ URL.
  - Tìm sản phẩm trong `products.js` theo `id`.
  - Hiển thị: ảnh lớn, tên, giá, mô tả (thêm field `description` vào products.js).
  - Nếu không tìm thấy sản phẩm → hiển thị "Không tìm thấy sản phẩm."

- **Không thay đổi** tính năng search/filter/wishlist đã có ở bài 3.

---

## Hướng dẫn

### Bước 1: Cài thêm thư viện

```bash
npm install react-router-dom
```

---

### Bước 2: Cập nhật `products.js` — thêm field `description`

```js
// src/products.js
export const products = [
  {
    id: 1,
    name: "iPhone 15",
    price: 20000000,
    image: "https://via.placeholder.com/200x150?text=iPhone+15",
    description: "Smartphone cao cấp của Apple với chip A16 Bionic, camera 48MP và màn hình Super Retina XDR.",
  },
  {
    id: 2,
    name: "Samsung S23",
    price: 18000000,
    image: "https://via.placeholder.com/200x150?text=Samsung+S23",
    description: "Flagship Android của Samsung với Snapdragon 8 Gen 2, camera 200MP và pin 4700mAh.",
  },
  // ... các sản phẩm khác từ bài 3, thêm description cho mỗi cái
];
```

---

### Bước 3: Tạo `MainLayout`

```jsx
// src/components/layout/MainLayout.jsx
import { Outlet, Link } from "react-router-dom";

const MainLayout = () => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    {/* Header */}
    <header style={{ background: "#0B74E5", color: "#fff", padding: "12px 24px", display: "flex", gap: 24, alignItems: "center" }}>
      <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 20 }}>
        CSC Shop
      </Link>
      <Link to="/cart" style={{ color: "#fff", textDecoration: "none", marginLeft: "auto" }}>
        🛒 Shopping Cart
      </Link>
    </header>

    {/* Nội dung trang con */}
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>

    {/* Footer */}
    <footer style={{ background: "#333", color: "#fff", textAlign: "center", padding: "16px" }}>
      © 2025 CSC Shop
    </footer>
  </div>
);

export default MainLayout;
```

> **Giải thích:** `<Outlet />` là nơi React Router render component của route con tương ứng. Mọi trang đều được bọc trong layout này.

---

### Bước 4: Tạo các trang

```jsx
// src/pages/HomePage.jsx
// Di chuyển toàn bộ nội dung từ App.jsx vào đây
// (danh sách sản phẩm, search, filter, wishlist)
import { useState, useEffect } from "react";
import { products } from "../products";
import ProductCard from "../components/product/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

function HomePage() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [search, setSearch] = useState(() => localStorage.getItem("lastSearch") ?? "");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    localStorage.setItem("lastSearch", search);
  }, [search]);

  useEffect(() => {
    document.title = search.trim() ? `Tìm: ${search} – Shop` : "Shop – Danh sách sản phẩm";
  }, [search]);

  const handleToggleFavorite = (id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      if (priceRange === "under10") return p.price < 10000000;
      if (priceRange === "10to20") return p.price >= 10000000 && p.price <= 20000000;
      if (priceRange === "over20") return p.price > 20000000;
      return true;
    })
    .sort((a, b) => {
      if (sort === "priceAsc") return a.price - b.price;
      if (sort === "priceDesc") return b.price - a.price;
      return 0;
    });

  return (
    <div style={{ maxWidth: 960, margin: "40px auto", padding: "0 16px" }}>
      <h1>CSC Shop</h1>
<h2>Fast shipping, curated products, and a floral-themed modern shopping experience.</h2>
      <div style={{ marginBottom: 12 }}>
        <SearchBar value={search} onChange={setSearch} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <FilterBar priceRange={priceRange} onPriceChange={setPriceRange} sort={sort} onSortChange={setSort} />
      </div>
      <p style={{ fontSize: 14, color: "#666" }}>
        Wishlist: {favoriteIds.length} | Result: {filteredProducts.length} products
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {filteredProducts.length === 0 ? (
          <p style={{ color: "#999" }}>No products match current filters.</p>
        ) : (
          filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isFavorite={favoriteIds.includes(item.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;
```

```jsx
// src/pages/ProductDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../products";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tìm sản phẩm theo id từ URL (id từ URL là string, cần ép kiểu)
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <p>Không tìm thấy sản phẩm.</p>
        <button onClick={() => navigate("/")}>Về trang chủ</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        ← Back
      </button>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <img src={product.image} alt={product.name} style={{ width: 300, borderRadius: 8 }} />
        <div>
          <h2>{product.name}</h2>
          <p style={{ color: "#e53935", fontSize: 24, fontWeight: 700 }}>
            {product.price.toLocaleString("vi-VN")}₫
          </p>
          <p style={{ color: "#555", lineHeight: 1.6 }}>{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
```

```jsx
// src/pages/CartPage.jsx
import { useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>
      <h2>Shopping Cart</h2>
      <p style={{ color: "#999" }}>Tính năng Shopping Cart sẽ được xây dựng ở bài 8.</p>
    </div>
  );
}

export default CartPage;
```

---

### Bước 5: Cập nhật `ProductCard` — thêm link đến trang chi tiết

```jsx
// src/components/product/ProductCard.jsx
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => (
  <div className="product-card" style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, textAlign: "center", margin: 8, background: "#fff" }}>
    {/* Bọc ảnh và tên trong Link để click vào chuyển trang */}
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <img src={product.image} alt={product.name} width={200} style={{ borderRadius: 4 }} />
      <h3 style={{ fontSize: 15, margin: "10px 0 4px" }}>{product.name}</h3>
    </Link>
    <p style={{ color: "#e53935", fontWeight: 600, margin: "4px 0 10px" }}>
      {product.price.toLocaleString("vi-VN")}₫
    </p>
    <button
      onClick={() => onToggleFavorite(product.id)}
      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}
    >
      {isFavorite ? <FaHeart color="red" /> : <FaRegHeart color="#aaa" />}
    </button>
  </div>
);

export default ProductCard;
```

---

### Bước 6: Tạo `router/index.jsx` và cập nhật `main.jsx`

Thay vì đặt routing trong `App.jsx`, tách ra file riêng `router/index.jsx` dùng `createBrowserRouter` — đây là cách hiện đại của React Router v6.4+.

```jsx
// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,       // Layout chung bọc tất cả trang
    children: [
      {
        index: true,               // Route Relevance khi URL là "/"
        element: <HomePage />,
      },
      {
        path: "product/:id",       // URL: /product/1, /product/2, ...
        element: <ProductDetailPage />,
      },
      {
        path: "cart",              // URL: /cart
        element: <CartPage />,
      },
    ],
  },
]);

export default router;
```

Cập nhật `main.jsx` để dùng `RouterProvider`:

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

> **Giải thích:**
> - `createBrowserRouter([...])` nhận array config thay vì JSX — dễ tách file, dễ mở rộng.
> - `RouterProvider` thay thế `BrowserRouter` — nhận `router` object đã tạo.
> - `App.jsx` không còn cần thiết — `main.jsx` mount thẳng `RouterProvider`.
> - Route lồng nhau: `MainLayout` là cha, các trang là con — `<Outlet />` trong `MainLayout` render trang con tương ứng.

---

### Bước 7: Kiểm tra

- [ ] Trang chủ hiển thị danh sách sản phẩm với Header và Footer.
- [ ] Click vào sản phẩm → chuyển đến `/product/:id`, hiển thị đúng thông tin.
- [ ] Nút "Quay lại" → trở về trang trước.
- [ ] Click "Shopping Cart" trên Header → chuyển đến `/cart`.
- [ ] Nhập URL `/product/999` → hiển thị "Không tìm thấy sản phẩm."
- [ ] Search/filter/wishlist từ bài 3 vẫn hoạt động.

---

## Cấu trúc file sau bài 4

```
src/
├── components/
│   ├── layout/
│   │   └── MainLayout.jsx      ← mới
│   ├── product/
│   │   └── ProductCard.jsx     ← cập nhật: thêm Link
│   ├── SearchBar.jsx
│   └── FilterBar.jsx
├── pages/
│   ├── HomePage.jsx            ← mới (chuyển từ App.jsx)
│   ├── ProductDetailPage.jsx   ← mới
│   └── CartPage.jsx            ← mới (placeholder)
├── router/
│   └── index.jsx               ← mới: createBrowserRouter
├── App.jsx                     ← không còn dùng (có thể xóa)
├── index.css
├── main.jsx                    ← cập nhật: RouterProvider
└── products.js                 ← cập nhật: thêm description
```

---

## Tổng kết kiến thức bài 4

| Khái niệm | Áp dụng trong bài |
|---|---|
| `BrowserRouter` + `Routes` + `Route` | Cấu hình routing toàn app |
| Route lồng nhau + `Outlet` | `MainLayout` bọc tất cả trang |
| `Link` | Điều hướng không reload trang |
| `useParams` | Lấy `id` từ URL trong `ProductDetailPage` |
| `useNavigate` | Nút "Quay lại" dùng `navigate(-1)` |

---

**Lưu ý:**
- GV cung cấp project đã hoàn thành bài 3 cho học viên làm tiếp.
- `CartPage` chỉ là placeholder — sẽ xây dựng đầy đủ ở bài 8.
