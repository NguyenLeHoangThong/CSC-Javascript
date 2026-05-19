# Bài 7: API Nâng Cao với Axios – Service Layer

## Kiến thức trọng tâm

- `axios`: cài đặt và tạo `axiosClient` với `baseURL`
- `async/await` + `try/catch`: gọi API bất đồng bộ, xử lý lỗi
- `useEffect` + API: fetch data khi component mount, khi dependency thay đổi
- Loading state + Error state: UX khi đang tải và khi có lỗi
- Service layer: tách logic gọi API ra file riêng, tái sử dụng

---

## Yêu cầu

- **Tạo `axiosClient`**: instance axios với `baseURL` trỏ đến FakeStore API.

- **Tạo `productService.js`**:
  - `getProducts({ search, category, minPrice, maxPrice, sortBy, order })`: lấy danh sách sản phẩm.
  - `getProductById(id)`: lấy chi tiết 1 sản phẩm.
  - `getCategories()`: lấy danh sách category.
  - Normalize data: map response về đúng shape `{ id, title, price, thumbnail, rating, description, ... }`.

- **Tạo `locationService.js`**:
  - `getProvinces()`: gọi API tỉnh/thành phố Việt Nam (`https://provinces.open-api.vn/api/v2/p/`).
  - Dùng `axios` trực tiếp (không qua `axiosClient`) vì khác `baseURL`.

- **Cập nhật `HomePage`**:
  - Xóa import `products.js` tĩnh.
  - Dùng `useEffect` + `getProducts()` để fetch data từ API.
  - Thêm `loading` state: hiển thị skeleton/spinner khi đang tải.
  - Thêm `error` state: hiển thị thông báo lỗi khi fetch thất bại.
  - Thêm filter theo `category` từ API (dropdown load từ `getCategories()`).

- **Cập nhật `ProductDetailPage`**:
  - Dùng `useEffect` + `getProductById(id)` để fetch chi tiết sản phẩm.
  - Hiển thị loading và error state.

- **Cập nhật `CheckoutPage`**:
  - Thêm dropdown **Tỉnh / Thành phố** load từ `getProvinces()` bằng `useEffect([])`.
  - Dùng `Controller` của react-hook-form để bind MUI Select.
  - Thêm `provinceCode` vào `checkoutSchema` (bắt buộc chọn).

- **Tạo `EmptyState` component**: hiển thị khi không có sản phẩm / có lỗi.

- **Không thay đổi** UI MUI đã có ở bài 6.

---

## Hướng dẫn

### Bước 1: Cài đặt axios

```bash
npm install axios
```

---

### Bước 2: Tạo `axiosClient`

```js
// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://fakestoreapi.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
```

> **Giải thích:** `axios.create()` tạo một instance riêng với config Relevance. Mọi request qua `axiosClient` đều tự động có `baseURL` — không cần lặp lại URL đầy đủ mỗi lần.

---

### Bước 3: Tạo `productService.js`

```js
// src/services/productService.js
import axiosClient from "../api/axiosClient";

// Normalize: map data từ FakeStore API về shape thống nhất trong app
const normalizeProduct = (product) => ({
  id: product.id,
  title: product.title,
  description: product.description,
  price: product.price,
  category: product.category,
  thumbnail: product.image || "https://placehold.co/300x300?text=No+Image",
  rating: product.rating?.rate ?? 4.0,
  ratingCount: product.rating?.count ?? 0,
});

export const getProducts = async ({
  search = "",
  category = "all",
  minPrice = "",
  maxPrice = "",
  sortBy = "",
  order = "asc",
} = {}) => {
  // Nếu có category → gọi endpoint riêng
  const endpoint = category !== "all" ? `/products/category/${category}` : "/products";
  const response = await axiosClient.get(endpoint);

  let products = Array.isArray(response.data)
    ? response.data.map(normalizeProduct)
    : [];

  // Filter và sort phía client (FakeStore API không hỗ trợ đầy đủ)
  if (search.trim()) {
    products = products.filter((p) =>
      p.title.toLowerCase().includes(search.trim().toLowerCase())
    );
  }
  if (minPrice !== "") products = products.filter((p) => p.price >= Number(minPrice));
  if (maxPrice !== "") products = products.filter((p) => p.price <= Number(maxPrice));
  if (sortBy === "price") products.sort((a, b) => order === "desc" ? b.price - a.price : a.price - b.price);
  if (sortBy === "rating") products.sort((a, b) => b.rating - a.rating);

  return products;
};

export const getProductById = async (id) => {
  const response = await axiosClient.get(`/products/${id}`);
  return normalizeProduct(response.data);
};

export const getCategories = async () => {
  const response = await axiosClient.get("/products/categories");
  return Array.isArray(response.data)
    ? response.data.map((item, index) => ({
        id: index + 1,
        slug: item,
        name: item.charAt(0).toUpperCase() + item.slice(1),
      }))
    : [];
};
```

> **Giải thích normalize:** FakeStore API trả về `image` nhưng app dùng `thumbnail`. Normalize giúp phần còn lại của app không phụ thuộc vào cấu trúc API — nếu đổi API sau này chỉ cần sửa hàm normalize.

---

### Bước 4: Tạo `EmptyState` component

```jsx
// src/components/common/EmptyState.jsx
import { Box, Button, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useNavigate } from "react-router-dom";

const EmptyState = ({ message, showBackHome = false }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: "center", py: 6 }}>
      <SearchOffIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
      <Typography color="text.secondary">{message}</Typography>
      {showBackHome && (
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/")}>
          Về trang chủ
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
```

---

### Bước 5: Cập nhật `HomePage` — fetch từ API

```jsx
// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Container, Grid, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Box, CircularProgress } from "@mui/material";
import ProductCard from "../components/product/ProductCard";
import EmptyState from "../components/common/EmptyState";
import { getProducts, getCategories } from "../services/productService";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [search, setSearch] = useState(() => localStorage.getItem("lastSearch") ?? "");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("default");

  // Fetch categories 1 lần khi mount
  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Fetch products mỗi khi filter thay đổi
  useEffect(() => {
    const priceMap = {
      under10: { minPrice: "", maxPrice: 10 },
      "10to20": { minPrice: 10, maxPrice: 20 },
      over20: { minPrice: 20, maxPrice: "" },
    };
    const sortMap = {
      priceAsc: { sortBy: "price", order: "asc" },
      priceDesc: { sortBy: "price", order: "desc" },
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProducts({
          search,
          category,
          ...(priceMap[priceRange] ?? {}),
          ...(sortMap[sort] ?? {}),
        });
        setProducts(data);
      } catch {
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, priceRange, sort]); // Re-fetch khi bất kỳ filter nào thay đổi

  // Side effects từ bài 3
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

  if (error) return <EmptyState message={error} />;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={800} mb={3}>Danh sách sản phẩm</Typography>

      {/* Filters */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField label="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} size="small" sx={{ minWidth: 220 }} />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Danh mục</InputLabel>
          <Select value={category} label="Danh mục" onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="all">Tất cả</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.slug} value={c.slug}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Price Range</InputLabel>
          <Select value={priceRange} label="Price Range" onChange={(e) => setPriceRange(e.target.value)}>
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="under10">Dưới $10</MenuItem>
            <MenuItem value="10to20">$10 – $20</MenuItem>
            <MenuItem value="over20">Trên $20</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sort} label="Sort by" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="default">Relevance</MenuItem>
            <MenuItem value="priceAsc">Price low to high</MenuItem>
            <MenuItem value="priceDesc">Price high to low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <EmptyState message="No products match current filters." />
      ) : (
        <Grid container spacing={2}>
          {products.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard
                product={item}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default HomePage;
```

---

### Bước 6: Cập nhật `ProductDetailPage` — fetch từ API

```jsx
// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Container, Grid, Rating, Typography, CircularProgress } from "@mui/material";
import { getProductById } from "../services/productService";
import EmptyState from "../components/common/EmptyState";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Re-fetch khi id thay đổi

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
  if (error || !product) return <EmptyState message={error || "Không tìm thấy sản phẩm."} showBackHome />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Back</Button>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <img src={product.thumbnail} alt={product.title} style={{ width: "100%", borderRadius: 8 }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight={700}>{product.title}</Typography>
          <Rating value={product.rating} precision={0.5} readOnly sx={{ mt: 1 }} />
          <Typography variant="h4" color="secondary" fontWeight={800} mt={2}>
            ${product.price}
          </Typography>
          <Typography mt={2} color="text.secondary">{product.description}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetailPage;
```

> **Giải thích `useEffect` với `[id]`:** Khi người dùng điều hướng từ `/product/1` sang `/product/2`, component không unmount/remount — chỉ `id` thay đổi. Dependency `[id]` đảm bảo effect chạy lại và fetch đúng sản phẩm mới.

---

### Bước 7: Tạo `locationService.js` và cập nhật `CheckoutPage`

Tỉnh/thành phố là dữ liệu động từ API — đây là cơ hội tốt để thực hành thêm một `useEffect` fetch data khi mount, tương tự `getCategories` ở `HomePage`.

```js
// src/services/locationService.js
import axios from "axios";

// Dùng axios trực tiếp (không qua axiosClient) vì đây là API bên ngoài, khác baseURL
export const getProvinces = async () => {
  const response = await axios.get("https://provinces.open-api.vn/api/v2/p/");
  return Array.isArray(response.data) ? response.data : [];
};
```

Cập nhật `CheckoutPage` — thêm dropdown tỉnh/thành phố load từ API:

```jsx
// src/pages/CheckoutPage.jsx — thêm vào phần import và state
import { getProvinces } from "../services/locationService";
import { Controller } from "react-hook-form";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// Trong component, thêm state:
const [provinces, setProvinces] = useState([]);
const [loadingProvince, setLoadingProvince] = useState(false);

// Thêm useEffect fetch tỉnh/thành khi mount:
useEffect(() => {
  const fetchProvinces = async () => {
    try {
      setLoadingProvince(true);
      const data = await getProvinces();
      setProvinces(data);
    } catch {
      setProvinces([]);
    } finally {
      setLoadingProvince(false);
    }
  };
  fetchProvinces();
}, []); // [] = chỉ fetch 1 lần khi mount
```

Thêm field `provinceCode` vào schema:

```js
// src/schemas/checkoutSchema.js — thêm field
provinceCode: yup.string().required("Vui lòng chọn tỉnh/thành phố"),
```

Thêm `defaultValues` và render dropdown trong form:

```jsx
// useForm defaultValues — thêm provinceCode
defaultValues: {
  name: "", email: "", phone: "", address: "",
  provinceCode: "", // thêm
  note: "",
},

// Trong JSX form — thêm field tỉnh/thành (dùng Controller vì MUI Select không hỗ trợ ref trực tiếp)
<Controller
  control={control}
  name="provinceCode"
  render={({ field }) => (
    <FormControl fullWidth error={!!errors.provinceCode} sx={{ mb: 2 }}>
      <InputLabel>Tỉnh / Thành phố *</InputLabel>
      <Select label="Tỉnh / Thành phố *" {...field}>
        {loadingProvince
          ? <MenuItem value="">Đang tải...</MenuItem>
          : provinces.map((p) => (
              <MenuItem key={p.code} value={String(p.code)}>
                {p.name}
              </MenuItem>
            ))
        }
      </Select>
      {errors.provinceCode && (
        <p style={{ color: "#e53935", fontSize: 13, margin: "4px 0 0" }}>
          {errors.provinceCode.message}
        </p>
      )}
    </FormControl>
  )}
/>
```

> **Giải thích `Controller`:** MUI `Select` không forward `ref` theo cách react-hook-form cần, nên phải dùng `Controller` để wrap — nó cung cấp `field` object gồm `value`, `onChange`, `onBlur` để bind thủ công.

---

### Bước 8: Kiểm tra

- [ ] Trang chủ load sản phẩm từ FakeStore API (không còn dùng `products.js`).
- [ ] Thấy spinner khi đang tải.
- [ ] Tắt mạng → thấy thông báo lỗi.
- [ ] Filter theo category → danh sách cập nhật (gọi API mới).
- [ ] Click sản phẩm → trang chi tiết load đúng data từ API.
- [ ] Vào `/checkout` → dropdown tỉnh/thành phố load từ API, hiển thị đầy đủ.
- [ ] Submit form không chọn tỉnh → thấy lỗi validation.
- [ ] Tất cả tính năng UI từ bài 6 vẫn hoạt động.

---

## Cấu trúc file sau bài 7

```
src/
├── api/
│   └── axiosClient.js          ← mới
├── components/
│   ├── common/
│   │   └── EmptyState.jsx      ← mới
│   ├── layout/
│   │   └── MainLayout.jsx
│   └── product/
│       └── ProductCard.jsx
├── pages/
│   ├── HomePage.jsx            ← cập nhật: fetch API, loading/error state
│   ├── ProductDetailPage.jsx   ← cập nhật: fetch API
│   ├── CartPage.jsx
│   └── CheckoutPage.jsx        ← cập nhật: dropdown tỉnh/thành từ API
├── schemas/
│   └── checkoutSchema.js       ← cập nhật: thêm provinceCode
├── services/
│   ├── productService.js       ← mới
│   └── locationService.js      ← mới
├── theme/
│   └── theme.jsx
├── router/
│   └── index.jsx
├── main.jsx
└── products.js                 ← không còn dùng (có thể xóa)
```

---

## Tổng kết kiến thức bài 7

| Khái niệm | Áp dụng trong bài |
|---|---|
| `axios.create()` | Tạo `axiosClient` với `baseURL` cố định |
| `async/await` | Gọi API bất đồng bộ trong `useEffect` |
| `try/catch/finally` | Xử lý lỗi + đảm bảo `setLoading(false)` luôn chạy |
| Service layer | `productService.js`, `locationService.js` tách biệt logic API |
| Normalize data | Map response API về shape thống nhất trong app |
| `useEffect([dep])` | Re-fetch khi filter hoặc `id` thay đổi |
| `useEffect([])` | Fetch tỉnh/thành 1 lần khi `CheckoutPage` mount |
| `Controller` | Bind MUI Select với react-hook-form |
| Loading/Error state | UX tốt: spinner khi tải, thông báo khi lỗi |

---

**Lưu ý:**
- GV cung cấp project đã hoàn thành bài 6 cho học viên làm tiếp.
- FakeStore API dùng USD — Price Range filter cần điều chỉnh theo đơn vị USD (không phải VNĐ như bài trước).
- `products.js` tĩnh không còn cần thiết sau bài này.
