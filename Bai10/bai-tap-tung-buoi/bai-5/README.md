# Bài 5: Form – Checkout

## Kiến thức trọng tâm

- `react-hook-form`: quản lý form state hiệu quả với `useForm`, `register`, `handleSubmit`, `formState`
- `yup`: định nghĩa schema validation khai báo (declarative)
- `@hookform/resolvers/yup`: kết nối yup schema với react-hook-form
- `Controller`: dùng cho các component không hỗ trợ `ref` trực tiếp (MUI Select, DatePicker)
- Error display: hiển thị lỗi qua `errors` object từ `formState`
- Submit flow: `handleSubmit` chỉ gọi `onSubmit` khi form hợp lệ

---

## Yêu cầu

- **Cài đặt thư viện**: `react-hook-form`, `yup`, `@hookform/resolvers`.

- **Tạo `checkoutSchema.js`** với yup:
  - `name`: bắt buộc, tối thiểu 2 ký tự.
  - `email`: bắt buộc, đúng định dạng email.
  - `phone`: bắt buộc, đúng định dạng số VN (`0xxxxxxxxx` hoặc `+84xxxxxxxxx`).
  - `address`: bắt buộc, tối thiểu 8 ký tự.
  - `note`: không bắt buộc, tối đa 300 ký tự.

- **Tạo trang `CheckoutPage`** dùng `react-hook-form`:
  - Dùng `useForm` với `yupResolver(checkoutSchema)`.
  - Các field dùng `register` để bind với form.
  - Hiển thị lỗi inline qua `errors.fieldName.message`.
  - Sau submit thành công: hiển thị thông báo, reset form.

- **Thêm route `/checkout`** vào `router/index.jsx`.

- **Thêm link "Thanh toán"** trong `CartPage`.

- **Không thay đổi** các tính năng đã có ở bài 4.

---

## Hướng dẫn

### Bước 1: Cài đặt thư viện

```bash
npm install react-hook-form yup @hookform/resolvers
```

---

### Bước 2: Tạo `checkoutSchema.js`

Tách schema ra file riêng để tái sử dụng và dễ bảo trì.

```js
// src/schemas/checkoutSchema.js
import * as yup from "yup";

export const checkoutSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .required("Họ tên không được để trống"),

  email: yup
    .string()
    .trim()
    .email("Email không đúng định dạng")
    .required("Email không được để trống"),

  phone: yup
    .string()
    .trim()
    .matches(/^(0|\+84)\d{9,10}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại không được để trống"),

  address: yup
    .string()
    .trim()
    .min(8, "Địa chỉ phải có ít nhất 8 ký tự")
    .required("Địa chỉ không được để trống"),

  note: yup
    .string()
    .max(300, "Ghi chú tối đa 300 ký tự")
    .optional(),
});
```

> **Giải thích:** yup schema là khai báo — mô tả **quy tắc** thay vì viết `if/else`. Mỗi field là một chain của các validator. `required` phải đặt **sau** các validator khác để message đúng.

---

### Bước 3: Tạo `CheckoutPage` với `react-hook-form`

```jsx
// src/pages/CheckoutPage.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { checkoutSchema } from "../schemas/checkoutSchema";

function CheckoutPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,           // bind input với form
    handleSubmit,       // wrapper xử lý submit
    formState: { errors }, // object chứa lỗi validation
    reset,              // reset form về defaultValues
  } = useForm({
    resolver: yupResolver(checkoutSchema), // kết nối yup schema
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      note: "",
    },
  });

  // handleSubmit chỉ gọi onSubmit khi form hợp lệ
  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      // Giả lập gọi API đặt hàng (bài 7 sẽ thay bằng API thật)
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Đặt hàng:", formData);
      setSuccess(true);
      reset();
    } catch {
      // xử lý lỗi nếu cần
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
        <h2 style={{ color: "#2e7d32" }}>✅ Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ sớm.</p>
        <button onClick={() => { setSuccess(false); navigate("/"); }}>
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 16px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>
      <h2>Đặt hàng</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* Họ tên */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            Họ tên <span style={{ color: "red" }}>*</span>
          </label>
          <input
            {...register("name")}
            placeholder="Nguyễn Văn A"
            style={inputStyle(!!errors.name)}
          />
          {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            Email <span style={{ color: "red" }}>*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="example@email.com"
            style={inputStyle(!!errors.email)}
          />
          {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
        </div>

        {/* Số điện thoại */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            Số điện thoại <span style={{ color: "red" }}>*</span>
          </label>
          <input
            {...register("phone")}
            placeholder="0901234567"
            style={inputStyle(!!errors.phone)}
          />
          {errors.phone && <p style={errorStyle}>{errors.phone.message}</p>}
        </div>

        {/* Địa chỉ */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            Địa chỉ <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            {...register("address")}
            placeholder="123 Đường ABC, Quận 1, TP.HCM"
            rows={3}
            style={inputStyle(!!errors.address)}
          />
          {errors.address && <p style={errorStyle}>{errors.address.message}</p>}
        </div>

        {/* Ghi chú */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            Ghi chú
          </label>
          <textarea
            {...register("note")}
            placeholder="Ghi chú thêm (không bắt buộc)"
            rows={2}
            style={inputStyle(false)}
          />
          {errors.note && <p style={errorStyle}>{errors.note.message}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%", padding: "12px",
            background: submitting ? "#aaa" : "#0B74E5",
            color: "#fff", border: "none", borderRadius: 6,
            fontSize: 16, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Đang đặt hàng..." : "Đặt hàng"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = (hasError) => ({
  width: "100%",
  padding: "8px 12px",
  boxSizing: "border-box",
  borderRadius: 6,
  border: `1px solid ${hasError ? "#e53935" : "#ddd"}`,
  fontSize: 15,
  outline: "none",
});

const errorStyle = {
  color: "#e53935",
  fontSize: 13,
  margin: "4px 0 0",
};

export default CheckoutPage;
```

> **Giải thích `register`:**
> `{...register("name")}` spread các props cần thiết vào input: `name`, `ref`, `onChange`, `onBlur`. React Hook Form dùng `ref` để đọc giá trị trực tiếp từ DOM — không cần `useState` cho từng field.

> **Giải thích `handleSubmit`:**
> `handleSubmit(onSubmit)` trả về một event handler. Khi submit, nó chạy validation trước — nếu có lỗi thì cập nhật `errors` và **không gọi** `onSubmit`. Chỉ khi hợp lệ mới gọi `onSubmit(formData)`.

---

### Bước 4: Thêm route `/checkout` vào `router/index.jsx`

```jsx
// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage"; // thêm

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> }, // thêm
    ],
  },
]);

export default router;
```

---

### Bước 5: Thêm link "Thanh toán" vào `CartPage`

```jsx
// src/pages/CartPage.jsx
import { Link, useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>
      <h2>Shopping Cart</h2>
      <p style={{ color: "#999" }}>Tính năng Shopping Cart sẽ được xây dựng ở bài 8.</p>
      <Link to="/checkout">
        <button style={{ padding: "10px 24px", background: "#0B74E5", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Proceed to checkout →
        </button>
      </Link>
    </div>
  );
}

export default CartPage;
```

---

### Bước 6: Kiểm tra

- [ ] Vào `/checkout`, thấy form đặt hàng.
- [ ] Nhấn "Đặt hàng" khi để trống → thấy lỗi đỏ dưới từng field bắt buộc.
- [ ] Nhập email sai định dạng → lỗi "Email không đúng định dạng".
- [ ] Nhập số điện thoại không đúng → lỗi "Số điện thoại không hợp lệ".
- [ ] Sửa field → lỗi biến mất ngay khi nhập lại.
- [ ] Điền đầy đủ và đúng → thấy màn hình "Đặt hàng thành công!".
- [ ] Nhấn "Về trang chủ" → về `/`.

---

## Cấu trúc file sau bài 5

```
src/
├── components/
│   ├── layout/
│   │   └── MainLayout.jsx
│   └── product/
│       └── ProductCard.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── ProductDetailPage.jsx
│   ├── CartPage.jsx            ← cập nhật: thêm link checkout
│   └── CheckoutPage.jsx        ← mới
├── router/
│   └── index.jsx               ← cập nhật: thêm route /checkout
├── schemas/
│   └── checkoutSchema.js       ← mới
├── index.css
├── main.jsx
└── products.js
```

---

## Tổng kết kiến thức bài 5

| Khái niệm | Áp dụng trong bài |
|---|---|
| `useForm` + `yupResolver` | Khởi tạo form với schema validation |
| `register` | Bind input vào form không cần `useState` |
| `handleSubmit` | Chỉ gọi `onSubmit` khi form hợp lệ |
| `formState.errors` | Object chứa lỗi, hiển thị inline dưới field |
| `reset` | Reset form về `defaultValues` sau submit |
| yup schema | Khai báo validation rules tách biệt khỏi component |

---

**Lưu ý:**
- GV cung cấp project đã hoàn thành bài 4 cho học viên làm tiếp.
- Form chưa kết nối với Shopping Cart thật — sẽ làm ở bài 8.
- `Controller` (dùng cho MUI Select, DatePicker) chưa cần ở bài này — sẽ dùng ở bài 6 khi nâng cấp UI sang MUI.
