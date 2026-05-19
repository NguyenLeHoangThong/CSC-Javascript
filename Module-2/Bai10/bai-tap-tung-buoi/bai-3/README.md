# Bài 3: useEffect – Load Danh Sách Sản Phẩm

## Kiến thức trọng tâm

- `useEffect` cơ bản: chạy sau khi render
- Dependency array: `[]` (chạy 1 lần khi mount), `[dep]` (chạy lại khi dep thay đổi)
- Cleanup function: dọn dẹp effect khi component unmount
- Pattern load data: `loading` state, `error` state, hiển thị kết quả sau khi có data
- Kết hợp `useState` + `useEffect` để quản lý vòng đời fetch data

---

## Yêu cầu

- **Giả lập fetch data bằng `useEffect`:**
  - Không import `products` trực tiếp nữa — thay bằng hàm `fetchProducts()` trả về `Promise` (dùng `setTimeout` giả lập delay mạng).
  - Dùng `useEffect` với `[]` để gọi `fetchProducts()` **một lần duy nhất** khi component mount.
  - Lưu kết quả vào state `products`.

- **Loading state:**
  - Trong khi chờ data, hiển thị thông báo `"Loading..."`.
  - Sau khi có data, ẩn loading và hiển thị danh sách.

- **Error state:**
  - Nếu fetch thất bại, hiển thị thông báo lỗi `"Không thể tải sản phẩm. Vui lòng thử lại."`.

- **Tìm kiếm, lọc, Sort by** (giữ nguyên từ bài trước nếu đã làm, hoặc thêm mới):
  - Thanh tìm kiếm lọc theo tên.
  - Dropdown lọc Price Range.
  - Dropdown Sort by.

- **Không thay đổi** tính năng wishlist đã có ở bài 2.

---

## Hướng dẫn

### Bước 1: Tạo hàm `fetchProducts` giả lập async

Thay vì import trực tiếp, bọc data tĩnh trong một `Promise` để giả lập delay mạng. Bài 7 sẽ thay hàm này bằng `axios` gọi API thật — phần còn lại của code **không cần đổi**.

```js
// src/products.js
const productsData = [
  { id: 1, name: "iPhone 15", price: 20000000, image: "https://via.placeholder.com/200x150?text=iPhone+15" },
  { id: 2, name: "Samsung S23", price: 18000000, image: "https://via.placeholder.com/200x150?text=Samsung+S23" },
  { id: 3, name: "Tai nghe Sony WH-1000XM5", price: 8500000, image: "https://via.placeholder.com/200x150?text=Sony+WH1000XM5" },
  { id: 4, name: "Laptop Dell XPS 15", price: 35000000, image: "https://via.placeholder.com/200x150?text=Dell+XPS+15" },
  { id: 5, name: "iPad Air M2", price: 16000000, image: "https://via.placeholder.com/200x150?text=iPad+Air+M2" },
  { id: 6, name: "Chuột Logitech MX Master 3", price: 2200000, image: "https://via.placeholder.com/200x150?text=Logitech+MX3" },
  { id: 7, name: "Bàn phím Keychron K2", price: 3100000, image: "https://via.placeholder.com/200x150?text=Keychron+K2" },
  { id: 8, name: "MacBook Air M3", price: 28000000, image: "https://via.placeholder.com/200x150?text=MacBook+Air+M3" },
  { id: 9, name: "Màn hình LG 27 inch 4K", price: 12000000, image: "https://via.placeholder.com/200x150?text=LG+27+4K" },
  { id: 10, name: "Loa JBL Charge 5", price: 4500000, image: "https://via.placeholder.com/200x150?text=JBL+Charge+5" },
];

// Giả lập async fetch — bài 7 sẽ thay bằng axios gọi API thật
export const fetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products), 800);
  });
};
```

---

### Bước 2: Cập nhật `App.jsx` — dùng `useEffect` để load data

Đây là bước cốt lõi. Thay vì có data ngay lập tức, giờ phải **chờ** — cần quản lý 3 state: `products`, `loading`, `error`.

```jsx
// src/App.jsx
import { useState, useEffect } from "react";
import { fetchProducts } from "./products";
import ProductCard from "./components/product/ProductCard";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";

function App() {
  // --- State từ bài 2: wishlist ---
  const [favoriteIds, setFavoriteIds] = useState([]);

  // --- State bài 3: data, loading, error ---
  const [products, setProducts] = useState([]);   // data sau khi load
  const [loading, setLoading] = useState(true);   // đang tải?
  const [error, setError] = useState("");          // thông báo lỗi

  // --- State: tìm kiếm, lọc, Sort by ---
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("default");

  // useEffect với [] — chỉ chạy 1 lần khi component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProducts();
        setProducts(data);
      } catch {
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false); // luôn tắt loading dù thành công hay thất bại
      }
    };

    loadProducts();
  }, []); // [] = chỉ chạy 1 lần khi mount, không chạy lại

  const handleToggleFavorite = (id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Derived state: lọc + Sort by từ products đã load
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

  // Render loading
  if (loading) {
    return (
      <div style={{ maxWidth: 960, margin: "40px auto", padding: "0 16px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Render error
  if (error) {
    return (
      <div style={{ maxWidth: 960, margin: "40px auto", padding: "0 16px" }}>
        <p style={{ color: "#e53935" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "40px auto", padding: "0 16px" }}>
      <h1>CSC Shop</h1>
<h2>Fast shipping, curated products, and a floral-themed modern shopping experience.</h2>

      <div style={{ marginBottom: 12 }}>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <FilterBar
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      <div style={{ marginBottom: 12, fontSize: 14, color: "#666" }}>
        Wishlist: {favoriteIds.length} &nbsp;|&nbsp; Result: {filteredProducts.length} products
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {filteredProducts.length === 0 ? (
          <p style={{ color: "#999", fontStyle: "italic" }}>
            No products match current filters.
          </p>
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

export default App;
```

> **Giải thích flow:**
> 1. Component mount → `loading = true`, render "Đang tải..."
> 2. `useEffect` chạy → gọi `fetchProducts()`
> 3. 800ms sau → `setProducts(data)`, `setLoading(false)`
> 4. Re-render → hiển thị danh sách sản phẩm
>
> **Tại sao `[]`?** Không có dependency → effect không phụ thuộc vào bất kỳ state/prop nào → chỉ cần chạy 1 lần khi mount. Bài 7 sẽ thêm dependency khi filter thay đổi cần re-fetch từ API.

---

### Bước 3: Tạo `SearchBar` và `FilterBar` (nếu chưa có)

```jsx
// src/components/SearchBar.jsx
const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Search products, brands,......"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{ padding: "8px 12px", width: "100%", boxSizing: "border-box", borderRadius: 6, border: "1px solid #ddd", fontSize: 15 }}
  />
);
export default SearchBar;
```

```jsx
// src/components/FilterBar.jsx
const FilterBar = ({ priceRange, onPriceChange, sort, onSortChange }) => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
    <div>
      <label style={{ fontSize: 13, marginRight: 6 }}>Price Range:</label>
      <select value={priceRange} onChange={(e) => onPriceChange(e.target.value)}>
        <option value="all">All prices</option>
        <option value="under10">Under 10M</option>
        <option value="10to20">10M – 20M</option>
        <option value="over20">Over 20M</option>
      </select>
    </div>
    <div>
      <label style={{ fontSize: 13, marginRight: 6 }}>Sort by:</label>
      <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
        <option value="default">Relevance</option>
        <option value="priceAsc">Price low to high</option>
        <option value="priceDesc">Price high to low</option>
      </select>
    </div>
  </div>
);
export default FilterBar;
```

---

### Bước 4: Kiểm tra

- [ ] Tải trang → thấy "Loading..." khoảng 0.8 giây.
- [ ] Sau đó danh sách hiện ra đầy đủ.
- [ ] Gõ tên sản phẩm → danh sách lọc theo thời gian thực.
- [ ] Chọn Price Range → chỉ hiện sản phẩm trong khoảng đó.
- [ ] Chọn Sort by → thứ tự thay đổi đúng.
- [ ] Kết hợp cả 3 bộ lọc → hoạt động đồng thời.
- [ ] Không có kết quả → hiện thông báo empty state.
- [ ] Wishlist từ bài 2 vẫn hoạt động bình thường.

---

## Cấu trúc file sau bài 3

```
src/
├── components/
│   ├── product/
│   │   └── ProductCard.jsx     ← giữ nguyên từ bài 2
│   ├── SearchBar.jsx           ← mới
│   └── FilterBar.jsx           ← mới
├── App.jsx                     ← cập nhật: useEffect load data, loading/error state
├── index.css
├── main.jsx
└── products.js                 ← cập nhật: export fetchProducts() thay vì array trực tiếp
```

---

## Tổng kết kiến thức bài 3

| Khái niệm | Áp dụng trong bài |
|---|---|
| `useEffect(() => {}, [])` | Load danh sách sản phẩm 1 lần khi component mount |
| `async/await` trong `useEffect` | Gọi `fetchProducts()` bất đồng bộ |
| `try/catch/finally` | Xử lý lỗi + đảm bảo `setLoading(false)` luôn chạy |
| `loading` state | Hiển thị "Đang tải..." trong khi chờ data |
| `error` state | Hiển thị thông báo lỗi nếu fetch thất bại |
| Derived state | Tính `filteredProducts` từ `products` đã load |

---

**Lưu ý:**
- Bài này tiếp tục từ bài 2 — giữ nguyên toàn bộ logic wishlist.
- GV cung cấp project đã hoàn thành bài 2 cho học viên làm tiếp.
- `fetchProducts()` dùng data tĩnh + `setTimeout` — bài 7 sẽ thay bằng `axios` gọi API thật, phần `useEffect` trong `App.jsx` **không cần đổi**.
