# Bài 10: Hoàn Thiện Project – Polish, UX & Refactor

## Kiến thức trọng tâm

- Tách component nhỏ: `Header`, `Footer`, `SearchBar`, `BackButton`, `Loading`, `ProductGrid`, `ProductInfo`, `CartSummary`
- `useOutletContext`: truyền state từ layout xuống page qua React Router Outlet
- Search debounce: `useEffect` + `setTimeout` / `clearTimeout`
- `useMemo` filter phía client: `collectionType` lọc wishlist không cần re-fetch
- Skeleton loading: `<Skeleton>` thay spinner khi load danh sách sản phẩm
- `Snackbar` + `Alert`: toast notification khi thêm vào giỏ / đặt hàng thành công
- `DatePicker` từ `@mui/x-date-pickers` + `dayjs` + `LocalizationProvider`
- `useWatch`: theo dõi field trong react-hook-form mà không trigger re-render toàn form
- `orderService`: gọi API tạo đơn hàng (`POST`, `PUT`, `DELETE`)
- `Promise.all`: fetch nhiều sản phẩm song song
- Persist nâng cao: lưu `id + quantity`, hydrate lại bằng `getProductsByIds` khi app khởi động
- `responsiveFontSizes`: tự động scale font theo breakpoint
- CSS-in-JS nâng cao: gradient, pseudo-element `::before` / `::after`, hover animation

---

## Những gì được optimize so với bài 8

### 1. Persist cart — lưu `id + quantity` thay vì toàn bộ object

**Bài 8:** Lưu toàn bộ `cartItems` array vào `localStorage` — dữ liệu sản phẩm (tên, giá, ảnh) bị stale nếu API thay đổi.

**Bài 10:** Chỉ lưu `{ id, quantity }`. Khi app khởi động, `CartProvider` gọi `getProductsByIds` để fetch lại data mới nhất từ API, sau đó dispatch `HYDRATE_STATE`.

```js
// Lưu — chỉ lưu id và quantity
localStorage.setItem(STORAGE_KEY, JSON.stringify({
  cartItemIds: state.cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
  wishlistItemIds: state.wishlistItems,
}));

// Khôi phục — fetch lại data từ API
const cartItems = cartIds.length > 0 ? await getProductsByIds(cartIds) : [];
dispatch({ type: "HYDRATE_STATE", payload: { cartItems, wishlistItems: wishlistIds } });
```

`getProductsByIds` dùng `Promise.all` để fetch song song, không tuần tự:

```js
// src/services/productService.js
export const getProductsByIds = async (items) => {
  const requests = items.map((item) => axiosClient.get(`/products/${item.id}`));
  const responses = await Promise.all(requests);
  return responses.map((response, index) => ({
    ...normalizeProduct(response.data),
    quantity: items[index].quantity,
  }));
};
```

> **Tại sao `Promise.all`:** Nếu dùng `for...of` + `await`, 5 sản phẩm = 5 lần chờ tuần tự. `Promise.all` chạy tất cả song song — tổng thời gian bằng request chậm nhất.

---

### 2. `MainLayout` — search state + `useOutletContext`

**Bài 8:** `SearchBar` (nếu có) nằm trong `HomePage`, không liên kết với `Header`.

**Bài 10:** `search` state sống ở `MainLayout`. `Header` nhận `search` + `setSearch` qua props để render `SearchBar`. `HomePage` nhận `search` qua `useOutletContext` — không cần prop drilling qua router.

```jsx
// MainLayout.jsx
const [search, setSearch] = useState("");
// ...
<Header search={search} setSearch={setSearch} />
<Outlet context={{ search }} />  {/* truyền xuống page */}

// HomePage.jsx
const { search = "" } = useOutletContext() ?? {};
```

---

### 3. Search debounce

Mỗi ký tự gõ không trigger fetch ngay — chờ 400ms sau lần gõ cuối:

```js
const [debouncedSearch, setDebouncedSearch] = useState(search.trim());

useEffect(() => {
  const timeoutId = setTimeout(() => {
    setDebouncedSearch(search.trim());
  }, 400);
  return () => clearTimeout(timeoutId); // hủy timeout cũ khi search thay đổi
}, [search]);

// Chỉ fetch khi debouncedSearch thay đổi
useEffect(() => {
  fetchProducts();
}, [category, debouncedSearch, priceRange, sort]);
```

---

### 4. Filter `collectionType` — `useMemo` phía client

Filter "Wishlist only" không gọi API — chỉ filter `products` đã có trong state:

```js
const visibleProducts = useMemo(() => {
  if (collectionType === "wishlist") {
    return products.filter((item) => wishlistItems.includes(item.id));
  }
  return products;
}, [collectionType, products, wishlistItems]);
```

---

### 5. Skeleton loading thay spinner đơn thuần

```jsx
const ProductGridSkeleton = () => (
  <Grid container spacing={{ xs: 1.5, sm: 2 }}>
    {[...Array(8)].map((_, index) => (
      <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 1.5 }} />
          <Skeleton width="85%" />
          <Skeleton width="55%" />
          <Skeleton width="40%" />
          <Skeleton variant="rounded" height={32} sx={{ mt: 1.3 }} />
        </Paper>
      </Grid>
    ))}
  </Grid>
);

// Trong HomePage — hiển thị cả Loading bar lẫn Skeleton
{loading ? (
  <>
    <Loading />
    <ProductGridSkeleton />
  </>
) : ...}
```

> **Tại sao Skeleton tốt hơn spinner:** Skeleton giữ nguyên layout trong khi load — tránh layout shift. User thấy trước được cấu trúc trang, cảm giác nhanh hơn.

---

### 6. `Snackbar` toast trong `ProductCard`

```jsx
const [toastOpen, setToastOpen] = useState(false);

const handleAddToCart = () => {
  dispatch({ type: "ADD_TO_CART", payload: product });
  setToastOpen(true);
};

// Sau Card component:
<Snackbar
  open={toastOpen}
  autoHideDuration={1400}
  onClose={() => setToastOpen(false)}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
>
  <Alert severity="success" variant="filled">Added to cart successfully!</Alert>
</Snackbar>
```

---

### 7. `CheckoutPage` — `DatePicker` + `orderService` + `useWatch`

**Thêm `deliveryDate`** — dùng `DatePicker` từ `@mui/x-date-pickers`, validate ngày phải từ ngày mai:

```js
// checkoutSchema.js
deliveryDate: yup
  .string()
  .required("Delivery date is required")
  .test("future-date", "Delivery date must be from tomorrow", (value) => {
    if (!value) return false;
    const selected = new Date(value);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return selected >= tomorrow;
  }),
```

```jsx
// Cần bọc app trong LocalizationProvider (main.jsx)
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <RouterProvider router={router} />
</LocalizationProvider>

// Trong form — dùng Controller vì DatePicker không hỗ trợ ref trực tiếp
<Controller
  name="deliveryDate"
  control={control}
  render={({ field }) => (
    <DatePicker
      label="Delivery Date"
      value={field.value ? dayjs(field.value) : null}
      onChange={(date) => field.onChange(date ? date.format("YYYY-MM-DD") : "")}
      slotProps={{ textField: { fullWidth: true, error: !!errors.deliveryDate, helperText: errors.deliveryDate?.message } }}
    />
  )}
/>
```

**`useWatch`** — theo dõi `provinceCode` để hiển thị tên tỉnh trong order summary mà không re-render toàn form:

```js
const provinceCode = useWatch({ control, name: "provinceCode" });

const selectedProvince = useMemo(
  () => provinces.find((item) => String(item.code) === String(provinceCode)),
  [provinceCode, provinces]
);
```

**`orderService`** — gọi API thực tế khi submit:

```js
// src/services/orderService.js
export const createOrder = async (cartItems) => {
  const response = await axios.post("https://jsonplaceholder.typicode.com/posts", {
    customerId: 1,
    products: cartItems.map((item) => ({ productId: item.id, quantity: item.quantity })),
    status: "new",
  });
  return response.data;
};
```

```jsx
// onSubmit trong CheckoutPage
const onSubmit = async (formData) => {
  try {
    setSubmitting(true);
    await createOrder(cartItems.map((item) => ({
      ...item,
      shippingProvince: selectedProvince?.name || "",
      deliveryDate: formData.deliveryDate,
    })));
    setSuccess(true);
    dispatch({ type: "CLEAR_CART" });
    reset();
  } catch {
    setSubmitError("Cannot place order now. Please try again.");
  } finally {
    setSubmitting(false);
  }
};
```

---

### 8. Theme nâng cao

```jsx
// src/theme/theme.jsx
let customTheme = createTheme({
  palette: {
    mode,
    primary: { main: "#0B74E5" },
    secondary: { main: "#FF424E" },
    background: {
      default: mode === "light" ? "#f3f6ff" : "#0d1324",
      paper: mode === "light" ? "#ffffff" : "#1a243d",
    },
  },
  typography: { fontFamily: "Inter, sans-serif" },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 700 } },
    },
  },
});

// responsiveFontSizes: tự động scale font theo breakpoint — không cần viết tay
customTheme = responsiveFontSizes(customTheme);
```

---

## Cấu trúc file project hoàn chỉnh

```
src/
├── api/
│   └── axiosClient.js
├── components/
│   ├── cart/
│   │   ├── CartItem.jsx
│   │   └── CartSummary.jsx         ← tách từ CartPage
│   ├── common/
│   │   ├── BackButton.jsx          ← mới
│   │   ├── EmptyState.jsx
│   │   ├── Loading.jsx             ← mới (LinearProgress + message)
│   │   ├── SearchBar.jsx           ← mới
│   │   └── ThemeToggle.jsx
│   ├── layout/
│   │   ├── Footer.jsx              ← tách từ MainLayout
│   │   ├── Header.jsx              ← tách từ MainLayout
│   │   └── MainLayout.jsx          ← giữ search state, truyền qua Outlet
│   └── product/
│       ├── ProductCard.jsx         ← thêm toast, hover animation
│       ├── ProductGrid.jsx         ← tách từ HomePage
│       └── ProductInfo.jsx         ← tách từ ProductDetailPage
├── context/
│   ├── CartProvider.jsx            ← optimize persist: lưu id+qty, hydrate từ API
│   └── cartReducer.js              ← thêm HYDRATE_STATE action
├── pages/
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx            ← thêm DatePicker, orderService, useWatch
│   ├── HomePage.jsx                ← thêm debounce, skeleton, collectionType filter
│   └── ProductDetailPage.jsx
├── router/
│   └── index.jsx
├── schemas/
│   └── checkoutSchema.js           ← thêm deliveryDate validation
├── services/
│   ├── locationService.js
│   ├── orderService.js             ← mới: createOrder, updateOrder, deleteOrder
│   └── productService.js           ← thêm getProductsByIds (Promise.all)
├── theme/
│   └── theme.jsx                   ← thêm responsiveFontSizes, custom background
└── main.jsx                        ← thêm LocalizationProvider
```

---

## Checklist kiểm tra

- [ ] Reload trang → Shopping Cart khôi phục đúng (data mới từ API, không phải cache cũ).
- [ ] Gõ search → không fetch ngay, chờ 400ms sau khi dừng gõ.
- [ ] Skeleton hiển thị khi Loading.
- [ ] Click "Add To Cart" → toast xuất hiện góc phải dưới.
- [ ] Card hover → nhấc lên nhẹ.
- [ ] Filter "Wishlist only" → chỉ hiển thị sản phẩm đã tim, không gọi API.
- [ ] Vào `/checkout` → DatePicker không cho chọn ngày hôm nay hoặc quá khứ.
- [ ] Submit checkout → gọi `createOrder`, nút hiển thị "Placing order...", sau đó clear cart.
- [ ] Lỗi API → hiển thị Alert error, không clear cart.
- [ ] Dark mode toggle hoạt động, font scale đúng theo màn hình.

---

## Tổng kết kiến thức bài 10

| Khái niệm | Áp dụng trong bài |
|---|---|
| Persist nâng cao | Lưu `id+qty`, hydrate bằng `getProductsByIds` khi app khởi động |
| `Promise.all` | Fetch nhiều sản phẩm song song trong `getProductsByIds` |
| `useOutletContext` | Truyền `search` từ `MainLayout` xuống `HomePage` |
| Search debounce | `useEffect` + `setTimeout/clearTimeout` — delay 400ms |
| `useMemo` filter | `collectionType` lọc wishlist phía client, không re-fetch |
| `Skeleton` | Placeholder loading giữ layout, tránh layout shift |
| `Snackbar` + `Alert` | Toast notification khi thêm vào giỏ |
| `DatePicker` + `dayjs` | Chọn ngày giao hàng, validate ngày tương lai |
| `useWatch` | Theo dõi `provinceCode` để hiển thị tên tỉnh, không re-render toàn form |
| `orderService` | `createOrder`, `updateOrder`, `deleteOrder` — CRUD đơn hàng |
| `responsiveFontSizes` | Tự động scale font theo breakpoint |
| Component tách nhỏ | `Header`, `Footer`, `SearchBar`, `BackButton`, `Loading`, `ProductGrid`, `ProductInfo`, `CartSummary` |

---

**Lưu ý:**
- Đây là bài cuối — project `bai-10` là phiên bản hoàn chỉnh nhất của toàn khóa.
- GV cung cấp project đã hoàn thành bài 8 cho học viên tự optimize theo hướng dẫn trên.
