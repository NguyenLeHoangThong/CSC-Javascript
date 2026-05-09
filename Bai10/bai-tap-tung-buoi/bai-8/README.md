# Bài 8: Global State – Cart (useContext + useReducer + useMemo + useCallback)

## Kiến thức trọng tâm

- `useContext` + `createContext`: chia sẻ state toàn app không cần prop drilling
- `useReducer`: quản lý state phức tạp với reducer pattern (action/dispatch)
- `useMemo`: tính toán derived value, tránh tính lại không cần thiết
- `useCallback`: memoize function, tránh tạo lại function mỗi lần render
- `React.memo`: tránh re-render component con không cần thiết
- Persist state: lưu/khôi phục Shopping Cart từ `localStorage`

---

## Yêu cầu

- **Tạo `CartContext` + `CartProvider`**:
  - State: `cartItems` (array sản phẩm trong giỏ), `wishlistItems` (array id yêu thích).
  - Actions: `ADD_TO_CART`, `REMOVE_FROM_CART`, `INCREASE_QUANTITY`, `DECREASE_QUANTITY`, `CLEAR_CART`, `TOGGLE_WISHLIST`.
  - Persist: lưu vào `localStorage` mỗi khi state thay đổi, khôi phục khi app khởi động.

- **Tạo `cartReducer.js`**: xử lý tất cả cart actions.

- **Tính toán derived values bằng `useMemo`**:
  - `totalItems`: tổng số lượng sản phẩm trong giỏ.
  - `totalPrice`: tổng tiền.

- **Cập nhật `Header`**: hiển thị badge số lượng sản phẩm trong giỏ (dùng `totalItems` từ context).

- **Xây dựng `CartPage` đầy đủ**:
  - Danh sách sản phẩm trong giỏ với `CartItem` component.
  - Tăng/giảm số lượng, xóa từng sản phẩm.
  - Hiển thị tổng tiền.
  - Nút "Proceed to checkout" → `/checkout`.
  - Empty state khi giỏ trống.

- **Cập nhật `ProductCard`**: nút "Thêm vào giỏ" dùng `dispatch` từ context.

- **Cập nhật `ProductDetailPage`**: nút "Thêm vào giỏ" dùng `dispatch` từ context.

- **Chuyển wishlist từ local state sang `CartContext`**:
  - Xóa `favoriteIds` state khỏi `HomePage`.
  - Dùng `wishlistItems` và `toggleWishlist` từ context.

- **Cập nhật `CheckoutPage`**: đọc `cartItems` từ context, sau submit thành công dispatch `CLEAR_CART`.

---

## Hướng dẫn

### Bước 1: Tạo `cartReducer.js`

```js
// src/context/cartReducer.js
export const cartReducer = (state, action) => {
  switch (action.type) {

    case "ADD_TO_CART": {
      const existing = state.cartItems.find((item) => item.id === action.payload.id);
      if (existing) {
        // Sản phẩm đã có → tăng quantity
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      // Sản phẩm chưa có → thêm mới với quantity = 1
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };

    case "INCREASE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
            : item
        ),
      };

    case "CLEAR_CART":
      return { ...state, cartItems: [] };

    case "TOGGLE_WISHLIST": {
      const id = action.payload;
      const has = state.wishlistItems.includes(id);
      return {
        ...state,
        wishlistItems: has
          ? state.wishlistItems.filter((wid) => wid !== id)
          : [...state.wishlistItems, id],
      };
    }

    default:
      return state;
  }
};
```

> **Giải thích reducer pattern:**
> - Reducer là hàm thuần túy: `(state, action) => newState`.
> - Không bao giờ mutate `state` trực tiếp — luôn trả về object mới với spread `...state`.
> - `action.type` xác định loại thao tác, `action.payload` chứa dữ liệu cần thiết.

---

### Bước 2: Tạo `CartProvider`

```jsx
// src/context/CartProvider.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { cartReducer } from "./cartReducer";

const CartContext = createContext();
const STORAGE_KEY = "csc-shop-cart";

const initialState = {
  cartItems: [],
  wishlistItems: [],
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    // Lazy initializer: đọc localStorage 1 lần khi khởi tạo
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems : [],
          wishlistItems: Array.isArray(parsed.wishlistItems) ? parsed.wishlistItems : [],
        };
      }
    } catch {
      // Nếu parse lỗi → dùng initialState
    }
    return init;
  });

  // Lưu vào localStorage mỗi khi state thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // useMemo: chỉ tính lại khi cartItems thay đổi
  const totalItems = useMemo(
    () => state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [state.cartItems]
  );

  const totalPrice = useMemo(
    () => state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.cartItems]
  );

  // useCallback: hàm không đổi reference giữa các lần render
  const isInWishlist = useCallback(
    (productId) => state.wishlistItems.includes(productId),
    [state.wishlistItems]
  );

  const toggleWishlist = useCallback(
    (productId) => dispatch({ type: "TOGGLE_WISHLIST", payload: productId }),
    []
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
        dispatch,
        totalItems,
        totalPrice,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
```

> **Giải thích:**
> - `useReducer(reducer, initialState, initFn)` — tham số thứ 3 là lazy initializer, chạy 1 lần để tính initial state từ localStorage.
> - `useMemo` cho `totalItems` và `totalPrice` — tránh tính lại mỗi lần render nếu `cartItems` không đổi.
> - `useCallback` cho `isInWishlist` và `toggleWishlist` — giữ reference ổn định, tránh re-render component con nhận hàm này qua props.

---

### Bước 3: Bọc app trong `CartProvider` — cập nhật `main.jsx`

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App.jsx";
import { CartProvider } from "./context/CartProvider";
import { ThemeContextProvider, useThemeContext } from "./theme/theme";

const Providers = () => {
  const { theme } = useThemeContext();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>   {/* Bọc toàn app để mọi component đều truy cập được cart */}
        <App />
      </CartProvider>
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

### Bước 4: Cập nhật `Header` — hiển thị badge số lượng Shopping Cart

```jsx
// src/components/layout/MainLayout.jsx (phần Header)
import { Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../../context/CartProvider";

// Trong Header component:
const { totalItems } = useCart();

// Trong JSX:
<IconButton component={Link} to="/cart" color="inherit">
  <Badge badgeContent={totalItems} color="secondary">
    <ShoppingCartIcon />
  </Badge>
</IconButton>
```

---

### Bước 5: Cập nhật `ProductCard` — nút "Thêm vào giỏ"

```jsx
// src/components/product/ProductCard.jsx
import { useCart } from "../../context/CartProvider";

const ProductCard = ({ product }) => {
  // Lấy dispatch và các helper từ context — không cần props nữa
  const { dispatch, cartItems, isInWishlist, toggleWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const itemInCart = cartItems.find((item) => item.id === product.id);
  const currentQty = itemInCart?.quantity ?? 0;

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  return (
    <Card ...>
      {/* ... ảnh, tên, rating, giá ... */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button variant="contained" size="small" onClick={handleAddToCart}>
          {currentQty > 0 ? `Trong giỏ: ${currentQty}` : "Thêm vào giỏ"}
        </Button>
        <IconButton color={isWishlisted ? "error" : "default"} onClick={() => toggleWishlist(product.id)}>
          {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
    </Card>
  );
};
```

> **Lưu ý quan trọng:** `ProductCard` giờ không nhận `isFavorite` và `onToggleFavorite` qua props nữa — tự lấy từ context. Cập nhật `HomePage` để không truyền các props này xuống nữa.

---

### Bước 6: Tạo `CartItem` component

```jsx
// src/components/cart/CartItem.jsx
import { Box, Button, Card, CardContent, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "../../context/CartProvider";

const CartItem = ({ item }) => {
  const { dispatch } = useCart();

  return (
    <Card sx={{ display: "flex", mb: 2, borderRadius: 2 }}>
      <CardMedia component="img" image={item.thumbnail} sx={{ width: 120, objectFit: "contain", p: 1 }} />
      <CardContent sx={{ flex: 1 }}>
        <Typography fontWeight={700}>{item.title}</Typography>
        <Typography color="secondary" mt={0.5}>${item.price}</Typography>

        <Stack direction="row" spacing={1} mt={1.5} alignItems="center">
          <Button variant="outlined" size="small" sx={{ minWidth: 32 }}
            onClick={() => dispatch({ type: "DECREASE_QUANTITY", payload: item.id })}>
            −
          </Button>
          <Typography fontWeight={700} sx={{ minWidth: 24, textAlign: "center" }}>
            {item.quantity}
          </Typography>
          <Button variant="outlined" size="small" sx={{ minWidth: 32 }}
            onClick={() => dispatch({ type: "INCREASE_QUANTITY", payload: item.id })}>
            +
          </Button>
          <IconButton size="small" color="error"
            onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}>
            <DeleteIcon />
          </IconButton>
          <Typography fontWeight={700} sx={{ ml: "auto" }}>
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CartItem;
```

---

### Bước 7: Xây dựng `CartPage` đầy đủ

```jsx
// src/pages/CartPage.jsx
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import EmptyState from "../components/common/EmptyState";
import { useCart } from "../context/CartProvider";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return <EmptyState message="Shopping Cart trống." showBackHome />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Back</Button>
      <Typography variant="h4" fontWeight={700} mb={3}>Shopping Cart</Typography>

      <Grid container spacing={3}>
        {/* Danh sách sản phẩm */}
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </Grid>

        {/* Tổng tiền */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, position: "sticky", top: 80 }}>
            <Typography variant="h6" fontWeight={700}>Tóm tắt đơn hàng</Typography>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography>Tổng cộng</Typography>
              <Typography fontWeight={700}>${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Button component={Link} to="/checkout" variant="contained" fullWidth sx={{ mt: 3 }}>
              Proceed to checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CartPage;
```

---

### Bước 8: Cập nhật `CheckoutPage` — đọc cart từ context, clear sau submit

```jsx
// src/pages/CheckoutPage.jsx — thêm vào phần đầu
import { useCart } from "../context/CartProvider";

// Trong component:
const { cartItems, totalPrice, dispatch } = useCart();

// Kiểm tra giỏ trống
if (cartItems.length === 0) {
  return <EmptyState message="Shopping Cart trống. Thêm sản phẩm trước khi đặt hàng." showBackHome />;
}

// Trong handleSubmit sau khi thành công:
dispatch({ type: "CLEAR_CART" });
setSuccess(true);
setForm(initialForm);

// Hiển thị danh sách sản phẩm đặt hàng trong form:
{cartItems.map((item) => (
  <Box key={item.id} display="flex" justifyContent="space-between">
    <Typography variant="body2">{item.title} x{item.quantity}</Typography>
    <Typography variant="body2" fontWeight={700}>${(item.price * item.quantity).toFixed(2)}</Typography>
  </Box>
))}
<Typography variant="h6" mt={2}>Tổng: ${totalPrice.toFixed(2)}</Typography>
```

---

### Bước 9: Cập nhật `HomePage` — xóa local wishlist state

```jsx
// src/pages/HomePage.jsx
// XÓA: const [favoriteIds, setFavoriteIds] = useState([]);
// XÓA: const handleToggleFavorite = ...

// ProductCard không cần truyền isFavorite và onToggleFavorite nữa
// vì ProductCard tự lấy từ context
{products.map((item) => (
  <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
    <ProductCard product={item} />  {/* Không cần props wishlist */}
  </Grid>
))}
```

---

### Bước 10: Kiểm tra

- [ ] Click "Thêm vào giỏ" → badge trên Header tăng.
- [ ] Vào `/cart` → thấy danh sách sản phẩm đã thêm.
- [ ] Tăng/giảm số lượng → tổng tiền cập nhật.
- [ ] Xóa sản phẩm → biến mất khỏi giỏ.
- [ ] Reload trang → Shopping Cart vẫn còn (persist localStorage).
- [ ] Wishlist vẫn hoạt động, persist qua reload.
- [ ] Vào `/checkout` → thấy danh sách sản phẩm và tổng tiền từ giỏ.
- [ ] Submit checkout thành công → Shopping Cart bị xóa.
- [ ] Giỏ trống → `CartPage` hiển thị empty state.

---

## Cấu trúc file sau bài 8 (= final project)

```
src/
├── api/
│   └── axiosClient.js
├── components/
│   ├── cart/
│   │   ├── CartItem.jsx        ← mới
│   │   └── CartSummary.jsx     ← mới (tách từ CartPage)
│   ├── common/
│   │   ├── BackButton.jsx      ← mới (tách nút quay lại)
│   │   ├── EmptyState.jsx
│   │   └── Loading.jsx         ← mới (tách spinner)
│   ├── layout/
│   │   ├── Header.jsx          ← tách từ MainLayout
│   │   ├── Footer.jsx          ← tách từ MainLayout
│   │   └── MainLayout.jsx      ← cập nhật: dùng Header/Footer riêng
│   └── product/
│       ├── ProductCard.jsx     ← cập nhật: dùng useCart
│       ├── ProductGrid.jsx     ← mới (tách grid ra component)
│       └── ProductInfo.jsx     ← mới (tách info trang chi tiết)
├── context/
│   ├── CartProvider.jsx        ← mới
│   └── cartReducer.js          ← mới
├── pages/
│   ├── CartPage.jsx            ← cập nhật: đầy đủ
│   ├── CheckoutPage.jsx        ← cập nhật: dùng cart context
│   ├── HomePage.jsx            ← cập nhật: bỏ local wishlist
│   └── ProductDetailPage.jsx   ← cập nhật: nút add to cart
├── services/
│   └── productService.js
├── theme/
│   └── theme.jsx
├── App.jsx
└── main.jsx                    ← cập nhật: thêm CartProvider
```

---

## Tổng kết kiến thức bài 8

| Khái niệm | Áp dụng trong bài |
|---|---|
| `createContext` + `useContext` | `CartContext` — chia sẻ cart state toàn app |
| `useReducer` | Quản lý cart state phức tạp với reducer pattern |
| `useMemo` | `totalItems`, `totalPrice` — tránh tính lại không cần thiết |
| `useCallback` | `isInWishlist`, `toggleWishlist` — giữ reference ổn định |
| Persist state | Lưu/khôi phục cart + wishlist từ `localStorage` |
| Lazy initializer | `useReducer(reducer, init, initFn)` — đọc localStorage 1 lần |

---

**Lưu ý:**
- GV cung cấp project đã hoàn thành bài 7 cho học viên làm tiếp.
- Đây là bài cuối cùng — sau bài 8, project đã hoàn chỉnh như `bai10/bai-10`.
- Bài 9 (TypeScript) và bài 10 (Hoàn thiện) sẽ nâng cấp thêm nhưng không thêm tính năng mới.
