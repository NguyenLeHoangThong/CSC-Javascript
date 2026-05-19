# Bài 6: UI với MUI – Giao Diện Đẹp

## Kiến thức trọng tâm

- Cài đặt và sử dụng Material UI (MUI)
- Các component MUI thường dùng: `Button`, `Card`, `TextField`, `AppBar`, `Container`, `Grid`, `Typography`
- `ThemeProvider` + `createTheme`: tùy chỉnh theme toàn app
- Dark mode: toggle sáng/tối với `useContext` + `useState`
- `CssBaseline`: reset CSS Relevance của trình duyệt

---

## Yêu cầu

- **Cài đặt MUI** và thay thế toàn bộ inline style bằng MUI components.

- **Nâng cấp `MainLayout`**:
  - `Header` dùng `AppBar` + `Toolbar` + `Container`.
  - `Footer` dùng `Box` + `Typography`.
  - Thêm nút toggle dark/light mode trên Header.

- **Nâng cấp `ProductCard`**:
  - Dùng `Card`, `CardMedia`, `CardContent`, `Button`, `IconButton`.
  - Hiển thị thêm `Rating` (điểm đánh giá) — thêm field `rating` vào `products.js`.

- **Nâng cấp `HomePage`**:
  - Dùng `Container`, `Grid` để layout responsive.
  - Dùng `TextField` cho SearchBar.
  - Dùng `Select` + `FormControl` cho FilterBar.
  - Dùng `Typography` cho tiêu đề.

- **Nâng cấp `ProductDetailPage`**:
  - Dùng `Container`, `Grid`, `Typography`, `Button`, `Rating`.

- **Nâng cấp `CheckoutPage`**:
  - Dùng `TextField` thay `<input>` — tích hợp `error` và `helperText` của MUI.
  - Dùng `Button` variant `contained`.

- **Dark mode**:
  - Tạo `ThemeContext` để lưu `mode` (light/dark) và hàm `toggleTheme`.
  - Bọc app trong `ThemeProvider` với theme tương ứng.
  - Nút toggle trên Header thay đổi icon theo mode.

---

## Hướng dẫn

### Bước 1: Cài đặt MUI

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

---

### Bước 2: Tạo `ThemeContext` để quản lý dark mode

```jsx
// src/theme/theme.jsx
import { createTheme } from "@mui/material/styles";
import { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  // useMemo để không tạo lại theme mỗi lần render
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#0B74E5" },
          secondary: { main: "#FF424E" },
        },
        typography: { fontFamily: "Arial, sans-serif" },
        shape: { borderRadius: 8 },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
```

---

### Bước 3: Cập nhật `main.jsx` — bọc app trong ThemeProvider

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App.jsx";
import { ThemeContextProvider, useThemeContext } from "./theme/theme";

// Component trung gian để lấy theme từ context
const Providers = () => {
  const { theme } = useThemeContext();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reset CSS + áp dụng background theo mode */}
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <Providers />
    </ThemeContextProvider>
  </React.StrictMode>
);
```

---

### Bước 4: Nâng cấp `MainLayout`

```jsx
// src/components/layout/MainLayout.jsx
import { AppBar, Box, Container, IconButton, Toolbar, Typography } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, Outlet } from "react-router-dom";
import { useThemeContext } from "../../theme/theme";

const MainLayout = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar sx={{ gap: 2 }}>
            <Typography
              component={Link}
              to="/"
              variant="h6"
              fontWeight={800}
              sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}
            >
              CSC Shop
            </Typography>

            {/* Toggle dark/light mode */}
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            {/* Link Shopping Cart */}
            <IconButton component={Link} to="/cart" color="inherit">
              <ShoppingCartIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Box sx={{ background: "linear-gradient(90deg, #0B74E5, #4f46e5)", color: "white", py: 3 }}>
        <Container>
          <Typography textAlign="center">© 2025 CSC Shop</Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
```

---

### Bước 5: Nâng cấp `ProductCard`

Thêm field `rating` vào `products.js` trước:

```js
// src/products.js — thêm rating cho mỗi sản phẩm
{ id: 1, name: "iPhone 15", price: 20000000, rating: 4.5, image: "...", description: "..." },
```

```jsx
// src/components/product/ProductCard.jsx
import { Box, Button, Card, CardContent, CardMedia, IconButton, Rating, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => (
  <Card sx={{ height: "100%", borderRadius: 2, "&:hover": { transform: "translateY(-4px)", boxShadow: 4 }, transition: "0.2s" }}>
    <Box component={Link} to={`/product/${product.id}`} sx={{ display: "block", textDecoration: "none" }}>
      <CardMedia component="img" image={product.image} alt={product.name} sx={{ height: 180, objectFit: "contain", p: 2 }} />
    </Box>
    <CardContent>
      <Typography
        component={Link}
        to={`/product/${product.id}`}
        fontWeight={600}
        sx={{ color: "text.primary", textDecoration: "none", display: "-webkit-box", overflow: "hidden", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
      >
        {product.name}
      </Typography>

      <Rating value={product.rating} precision={0.5} readOnly size="small" sx={{ mt: 1 }} />

      <Typography variant="h6" color="secondary" fontWeight={800} mt={1}>
        {product.price.toLocaleString("vi-VN")}₫
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button variant="contained" size="small">
          Add to cart
        </Button>
        <IconButton color={isFavorite ? "error" : "default"} onClick={() => onToggleFavorite(product.id)}>
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);

export default ProductCard;
```

---

### Bước 6: Nâng cấp `HomePage` — dùng MUI Grid + TextField + Select

```jsx
// src/pages/HomePage.jsx (phần render, giữ nguyên logic state/useEffect)
import { Container, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Box } from "@mui/material";

// ... (giữ nguyên state và useEffect từ bài 3)

return (
  <Container maxWidth="xl" sx={{ py: 3 }}>
    <Typography variant="h4" fontWeight={800} mb={3}>Danh sách sản phẩm</Typography>

    {/* Search + Filter */}
    <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
      <TextField
        label="Tìm kiếm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ minWidth: 240 }}
      />
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Price Range</InputLabel>
        <Select value={priceRange} label="Price Range" onChange={(e) => setPriceRange(e.target.value)}>
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="under10">Under 10M</MenuItem>
          <MenuItem value="10to20">10M – 20M</MenuItem>
          <MenuItem value="over20">Over 20M</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Sort by</InputLabel>
        <Select value={sort} label="Sort by" onChange={(e) => setSort(e.target.value)}>
          <MenuItem value="default">Relevance</MenuItem>
          <MenuItem value="priceAsc">Price low to high</MenuItem>
          <MenuItem value="priceDesc">Price high to low</MenuItem>
        </Select>
      </FormControl>
    </Box>

    {/* Product Grid */}
    {filteredProducts.length === 0 ? (
      <Typography color="text.secondary">No products match current filters.</Typography>
    ) : (
      <Grid container spacing={2}>
        {filteredProducts.map((item) => (
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
```

---

### Bước 7: Nâng cấp `CheckoutPage` — dùng MUI TextField

Thay `<input>` bằng `<TextField>` của MUI — tích hợp sẵn `error` và `helperText`:

```jsx
<TextField
  fullWidth
  label="Họ tên"
  name="name"
  value={form.name}
  onChange={handleChange}
  error={!!errors.name}
  helperText={errors.name}
  sx={{ mb: 2 }}
/>
```

> **Giải thích:** `!!errors.name` chuyển string thành boolean — MUI dùng `error={true/false}` để đổi màu border và label sang đỏ. `helperText` hiển thị text nhỏ bên dưới field.

---

### Bước 8: Kiểm tra

- [ ] Giao diện toàn app dùng MUI, không còn inline style thô.
- [ ] Nút toggle trên Header → chuyển dark/light mode, toàn app đổi màu.
- [ ] `ProductCard` hiển thị Rating.
- [ ] Grid sản phẩm responsive: 1 cột mobile, 2 cột tablet, 4 cột desktop.
- [ ] Form checkout dùng MUI TextField với error/helperText.
- [ ] Tất cả tính năng từ bài 1–5 vẫn hoạt động.

---

## Cấu trúc file sau bài 6

```
src/
├── components/
│   ├── layout/
│   │   └── MainLayout.jsx      ← cập nhật: MUI AppBar, dark mode toggle
│   ├── product/
│   │   └── ProductCard.jsx     ← cập nhật: MUI Card, Rating
│   ├── SearchBar.jsx           ← có thể xóa (tích hợp vào HomePage)
│   └── FilterBar.jsx           ← có thể xóa (tích hợp vào HomePage)
├── pages/
│   ├── HomePage.jsx            ← cập nhật: MUI Grid, TextField, Select
│   ├── ProductDetailPage.jsx   ← cập nhật: MUI layout
│   ├── CartPage.jsx
│   └── CheckoutPage.jsx        ← cập nhật: MUI TextField
├── theme/
│   └── theme.jsx               ← mới: ThemeContext, createTheme
├── App.jsx
├── index.css
├── main.jsx                    ← cập nhật: ThemeProvider, CssBaseline
└── products.js                 ← cập nhật: thêm rating
```

---

## Tổng kết kiến thức bài 6

| Khái niệm | Áp dụng trong bài |
|---|---|
| MUI components | `Card`, `AppBar`, `Grid`, `TextField`, `Select`, `Button`, `Rating` |
| `ThemeProvider` + `createTheme` | Tùy chỉnh màu sắc, font, border-radius toàn app |
| `CssBaseline` | Reset CSS + áp dụng background color theo mode |
| Dark mode | `ThemeContext` lưu `mode`, toggle qua `useState` |
| `useMemo` cho theme | Tránh tạo lại theme object mỗi lần render |
| `sx` prop | Style inline theo theme MUI |

---

**Lưu ý:**
- GV cung cấp project đã hoàn thành bài 5 cho học viên làm tiếp.
- Đây là bài nặng nhất về UI — học viên cần đọc docs MUI để hiểu các props.
- `SearchBar.jsx` và `FilterBar.jsx` có thể tích hợp thẳng vào `HomePage` thay vì giữ làm component riêng.
