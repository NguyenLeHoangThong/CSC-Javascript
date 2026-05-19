# Bài 2: State – Interaction

## Kiến thức trọng tâm

- `useState`: khai báo và cập nhật state trong functional component
- Event handler: xử lý sự kiện click, truyền callback qua props
- Lifting state up: đặt state ở component cha, truyền xuống con qua props
- Immutable state update: cập nhật array state đúng cách (không mutate trực tiếp)

---

## Yêu cầu

- **Tính năng Wishlist (Yêu thích)**:
  - Mỗi `ProductCard` có icon trái tim.
  - Chưa yêu thích: icon trái tim viền (outline).
  - Đã yêu thích: icon trái tim tô màu đỏ.
  - Click vào icon → thêm vào / bỏ khỏi danh sách yêu thích.

- **State quản lý ở `App.jsx`**:
  - `favoriteIds`: mảng chứa `id` của các sản phẩm đã yêu thích.
  - Hàm `handleToggleFavorite(id)`: thêm id nếu chưa có, bỏ id nếu đã có.
  - Truyền `isFavorite` và `onToggleFavorite` xuống từng `ProductCard`.

- **Hiển thị số lượng yêu thích** ở đầu trang.

- **Khi reload trang**, danh sách yêu thích mất (chưa cần lưu localStorage — bài 3 sẽ làm).

- **Không thay đổi** tính năng hiển thị danh sách đã có ở bài 1.

---

## Hướng dẫn

### Bước 1: Cài thêm thư viện icon

```bash
npm install react-icons
```

---

### Bước 2: Cập nhật `ProductCard` — nhận thêm props wishlist

Thêm 2 props mới: `isFavorite` (boolean) và `onToggleFavorite` (function).

```jsx
// src/components/product/ProductCard.jsx
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => (
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
    <p style={{ color: "#e53935", fontWeight: 600, margin: "4px 0 10px" }}>
      {product.price.toLocaleString("vi-VN")}₫
    </p>
    <button
      onClick={() => onToggleFavorite(product.id)}
      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}
      title={isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"}
    >
      {isFavorite ? <FaHeart color="red" /> : <FaRegHeart color="#aaa" />}
    </button>
  </div>
);

export default ProductCard;
```

> **Giải thích:**
> - `isFavorite ? <FaHeart> : <FaRegHeart>` — render icon khác nhau tùy trạng thái.
> - `onClick={() => onToggleFavorite(product.id)}` — gọi hàm từ cha, truyền `id` lên.
> - Component con **không tự quản lý state** — chỉ nhận và gọi callback. Đây là pattern "controlled component".

---

### Bước 3: Thêm state và handler vào `App.jsx`

```jsx
// src/App.jsx
import { useState } from "react";
import { products } from "./products";
import ProductCard from "./components/product/ProductCard";

function App() {
  // State lưu danh sách id sản phẩm đã yêu thích
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Toggle: nếu đã có id → bỏ ra, nếu chưa có → thêm vào
  const handleToggleFavorite = (id) => {
    setFavoriteIds((prev) =>
      prev.includes(id)
        ? prev.filter((fid) => fid !== id)  // bỏ id khỏi mảng
        : [...prev, id]                      // thêm id vào mảng mới
    );
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <h1>CSC Shop</h1>
<h2>Fast shipping, curated products, and a floral-themed modern shopping experience.</h2>

      {/* Hiển thị số lượng yêu thích */}
      <p style={{ color: "#666", fontSize: 14 }}>
        Yêu thích: <strong>{favoriteIds.length}</strong> sản phẩm
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          products.map((item) => (
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

> **Giải thích:**
> - `useState([])` — khởi tạo state là mảng rỗng.
> - `setFavoriteIds((prev) => ...)` — dùng functional update để đảm bảo luôn dùng state mới nhất.
> - `prev.filter(...)` tạo mảng **mới** không chứa id đó — không mutate mảng cũ.
> - `[...prev, id]` tạo mảng **mới** có thêm id — spread operator.
> - `favoriteIds.includes(item.id)` tính `isFavorite` cho từng card ngay lúc render.

---

### Bước 4: Kiểm tra

- [ ] Click icon trái tim → chuyển từ outline sang đỏ.
- [ ] Click lại → trở về outline.
- [ ] Số lượng yêu thích ở đầu trang cập nhật đúng.
- [ ] Reload trang → danh sách yêu thích mất (chưa lưu localStorage).
- [ ] Danh sách sản phẩm từ bài 1 vẫn hiển thị đúng.

---

## Cấu trúc file sau bài 2

```
src/
├── components/
│   └── product/
│       └── ProductCard.jsx     ← cập nhật: thêm isFavorite, onToggleFavorite
├── App.jsx                     ← cập nhật: thêm favoriteIds state, handleToggleFavorite
├── index.css
├── main.jsx
└── products.js                 ← giữ nguyên
```

---

## Tổng kết kiến thức bài 2

| Khái niệm | Áp dụng trong bài |
|---|---|
| `useState` | `favoriteIds` — lưu danh sách id đã yêu thích |
| Functional update | `setFavoriteIds((prev) => ...)` — cập nhật dựa trên state trước |
| Immutable update | `filter(...)` và `[...prev, id]` — không mutate mảng gốc |
| Lifting state up | State ở `App`, truyền xuống `ProductCard` qua props |
| Event handler | `onToggleFavorite` — callback từ cha, gọi từ con |

---

**Lưu ý:**
- GV cung cấp project đã hoàn thành bài 1 cho học viên làm tiếp.
- Bài này chưa lưu localStorage — sẽ làm ở bài 3 khi học `useEffect`.
