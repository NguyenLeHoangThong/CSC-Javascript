# Bài 9: TypeScript – Migrate React App sang TypeScript

## Kiến thức trọng tâm

- TypeScript cơ bản: `type`, `interface`, union type, generic
- Typed props: thay `PropTypes` bằng `interface` / `type`
- Typed hooks: `useState<T>`, `useReducer<State, Action>`
- Typed context: `createContext<T | undefined>(undefined)` + guard `useContext`
- Generic component: component nhận type parameter `<T extends FieldValues>`
- Discriminated union: mô hình hóa trạng thái API với `ApiState<T>`
- Custom hook có type: `useApi<T>(url: string): ApiState<T>`
- Cấu hình TypeScript: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

---

## Yêu cầu

- **Khởi tạo project TypeScript**: dùng Vite template `react-ts`.
- **Định nghĩa types** trong `src/types/`:
  - `Product`, `CartItem`, `CartState`, `CartAction` (discriminated union).
  - `ApiState<T>` (discriminated union cho trạng thái fetch).
- **Migrate `CartContext`**: thêm type cho `state`, `dispatch`, `createContext`.
- **Migrate `productService`**: thêm return type `Promise<Product[]>`.
- **Migrate `ProductCard`**: typed props `{ product: Product }`.
- **Tạo `FormBuilder<T>`**: generic component nhận `fields`, `initialValues`, `onSubmit`.
- **Tạo `useApi<T>`**: custom hook generic với `AbortController` + cache.

---

## Hướng dẫn

### Bước 1: Khởi tạo project TypeScript

```bash
npm create vite@latest bai-9 -- --template react-ts
cd bai-9
npm install
```

Vite tạo sẵn `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` và các file `.tsx` / `.ts`.

> **Giải thích:** Template `react-ts` cấu hình TypeScript strict mode, path alias, và JSX transform tự động — không cần cài thêm gì.

---

### Bước 2: Cấu hình `tsconfig.app.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

> **Giải thích `strict: true`:** Bật tất cả strict checks — `strictNullChecks`, `noImplicitAny`, v.v. Đây là best practice, giúp bắt lỗi sớm nhất.

---

### Bước 3: Định nghĩa types

```ts
// src/types/cart.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalCount: number;
}

// Discriminated union: mỗi action có type riêng biệt
// TypeScript dùng "type" field để thu hẹp kiểu trong switch/case
export type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "CLEAR_CART" };
```

```ts
// src/types/api.ts
// Discriminated union cho trạng thái fetch — thay thế 3 state riêng lẻ
export type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

> **Giải thích discriminated union:** Khi `status === "success"`, TypeScript tự biết `data` tồn tại. Khi `status === "error"`, TypeScript tự biết `error` tồn tại. Không cần optional `?` hay non-null assertion `!`.

---

### Bước 4: Migrate `CartContext`

```tsx
// src/context/CartContext.tsx
import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { CartState, CartAction } from "../types/cart";

// createContext cần type rõ ràng — dùng undefined để bắt lỗi dùng ngoài Provider
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const initialState: CartState = { items: [], totalPrice: 0, totalCount: 0 };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
      let newItems: CartItem[];
      if (existingIndex > -1) {
        newItems = [...state.items];
        newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + 1 };
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }
    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

// Custom hook với guard — throw lỗi rõ ràng nếu dùng ngoài Provider
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
```

> **Giải thích guard pattern:** `createContext<T | undefined>(undefined)` + kiểm tra `if (!context) throw` là pattern chuẩn. Nếu quên bọc `CartProvider`, lỗi sẽ xuất hiện ngay lập tức thay vì âm thầm trả về `undefined`.

---

### Bước 5: Migrate `productService`

```ts
// src/services/productService.ts
import axios from "axios";
import type { Product } from "../types/cart";

export const productService = {
  // Return type rõ ràng: Promise<Product[]>
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get("https://fakestoreapi.com/products?limit=8");
    // response.data là any — cần map về đúng shape
    return response.data.map((item: any) => ({
      id: item.id,
      name: item.title,
      price: Math.round(item.price * 25000),
      image: item.image,
      category: item.category,
    }));
  },
};
```

> **Giải thích `item: any`:** API response chưa có type — dùng `any` tạm thời ở đây là chấp nhận được. Nếu muốn strict hơn, có thể định nghĩa `RawProduct` interface cho response.

---

### Bước 6: Migrate `ProductCard` — typed props

```tsx
// src/components/ProductCard.tsx
import type { Product } from "../types/cart";
import { useCart } from "../context/CartContext";

// Typed props: React.FC<Props> hoặc khai báo trực tiếp trong tham số
export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { dispatch } = useCart();

  return (
    <Card>
      {/* ... */}
      <Button onClick={() => dispatch({ type: "ADD_ITEM", payload: product })}>
        MUA NGAY
      </Button>
    </Card>
  );
};
```

> **Lưu ý:** `React.FC<Props>` tự động thêm `children` vào props. Nếu không cần `children`, có thể khai báo thẳng `({ product }: { product: Product })` để rõ ràng hơn.

---

### Bước 7: Generic component `FormBuilder<T>`

```tsx
// src/components/FormBuilder.tsx
import { useForm, type Path, type DefaultValues, type FieldValues } from "react-hook-form";

// Interface dùng generic T để type-safe field names
interface FormField<T> {
  name: Path<T>;       // Path<T> đảm bảo name phải là key hợp lệ của T
  label: string;
  type?: string;
  required?: boolean;
}

interface FormBuilderProps<T extends FieldValues> {
  title: string;
  initialValues: DefaultValues<T>;
  fields: FormField<T>[];
  onSubmit: (data: T) => void;
}

// Generic component — T được infer từ props khi dùng
export function FormBuilder<T extends FieldValues>({
  title,
  initialValues,
  fields,
  onSubmit,
}: FormBuilderProps<T>) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<T>({
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit((data) => { onSubmit(data); reset(); })}>
      {fields.map((field) => (
        <TextField
          key={field.name.toString()}
          label={field.label}
          type={field.type || "text"}
          {...register(field.name, {
            required: field.required ? `${field.label} không được để trống` : false,
          })}
          error={!!errors[field.name]}
          helperText={errors[field.name]?.message as string}
        />
      ))}
      <Button type="submit">Xác nhận gửi</Button>
    </form>
  );
}
```

Cách dùng — TypeScript tự infer `T` từ `initialValues`:

```tsx
// Dùng FormBuilder với type LoginForm
interface LoginForm {
  email: string;
  password: string;
}

<FormBuilder<LoginForm>
  title="Đăng nhập"
  initialValues={{ email: "", password: "" }}
  fields={[
    { name: "email", label: "Email", required: true },
    { name: "password", label: "Mật khẩu", type: "password", required: true },
  ]}
  onSubmit={(data) => console.log(data)} // data: LoginForm — fully typed
/>
```

> **Giải thích `Path<T>`:** `Path<T>` từ react-hook-form là utility type trả về tất cả key hợp lệ của `T` (kể cả nested). Nếu truyền `name: "emaill"` (typo), TypeScript báo lỗi ngay.

---

### Bước 8: Custom hook `useApi<T>` với `AbortController`

```ts
// src/hooks/useApi.ts
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { ApiState } from "../types/api";

export function useApi<T>(url: string): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({ status: "idle" });
  // useRef để cache — không trigger re-render khi cache thay đổi
  const cache = useRef<Record<string, T>>({});

  useEffect(() => {
    if (!url) return;

    // Trả về từ cache nếu đã fetch trước đó
    if (cache.current[url]) {
      setState({ status: "success", data: cache.current[url] });
      return;
    }

    // AbortController: hủy request khi component unmount hoặc url thay đổi
    const controller = new AbortController();
    setState({ status: "loading" });

    axios
      .get<T>(url, { signal: controller.signal })
      .then((res) => {
        cache.current[url] = res.data;
        setState({ status: "success", data: res.data });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; // Bỏ qua lỗi do abort
        setState({ status: "error", error: err.message });
      });

    // Cleanup: abort request khi effect cleanup
    return () => controller.abort();
  }, [url]);

  return state;
}
```

Cách dùng với discriminated union:

```tsx
const state = useApi<Product[]>("https://fakestoreapi.com/products");

// TypeScript biết chính xác shape của state trong mỗi nhánh
if (state.status === "loading") return <CircularProgress />;
if (state.status === "error") return <Alert severity="error">{state.error}</Alert>;
if (state.status === "success") return <ProductGrid products={state.data} />;
// state.status === "idle" — chưa fetch
```

> **Giải thích `AbortController`:** Khi component unmount trong khi đang fetch (ví dụ: user navigate đi), cleanup function gọi `controller.abort()` → request bị hủy → tránh lỗi "setState on unmounted component".

---

### Bước 9: Kiểm tra

- [ ] `npm run build` không có lỗi TypeScript.
- [ ] Truyền sai type vào `ProductCard` → TypeScript báo lỗi ngay trong editor.
- [ ] Dùng `FormBuilder` với `name` không tồn tại trong interface → TypeScript báo lỗi.
- [ ] `useCart()` dùng ngoài `CartProvider` → throw lỗi rõ ràng.
- [ ] `useApi` trả đúng `data` type khi `status === "success"`.

---

## Cấu trúc file sau bài 9

```
src/
├── components/
│   ├── FormBuilder.tsx         ← mới: generic component
│   ├── ProductCard.tsx         ← migrate: typed props
│   ├── ProductList.tsx         ← migrate: typed props
│   └── ShoppingCart.tsx        ← migrate: typed props
├── context/
│   └── CartContext.tsx         ← migrate: typed context + reducer
├── hooks/
│   └── useApi.ts               ← mới: generic custom hook
├── pages/
│   └── ShoppingPage.tsx        ← migrate: typed state
├── services/
│   └── productService.ts       ← migrate: typed return
├── types/
│   ├── cart.ts                 ← mới: Product, CartItem, CartState, CartAction
│   └── api.ts                  ← mới: ApiState<T>
├── App.tsx
└── main.tsx
```

---

## Tổng kết kiến thức bài 9

| Khái niệm | Áp dụng trong bài |
|---|---|
| `interface` / `type` | `Product`, `CartItem`, `CartState`, `CartAction` |
| Discriminated union | `CartAction`, `ApiState<T>` — thu hẹp type trong switch/if |
| Typed `useState` | `useState<ApiState<T>>({ status: "idle" })` |
| Typed `useReducer` | `useReducer(cartReducer, initialState)` — infer từ reducer |
| Typed context | `createContext<T \| undefined>(undefined)` + guard hook |
| Generic component | `FormBuilder<T extends FieldValues>` |
| `Path<T>` | Type-safe field names trong `FormBuilder` |
| Generic hook | `useApi<T>(url)` — infer data type từ caller |
| `AbortController` | Hủy fetch khi component unmount |
| `useRef` cache | Tránh fetch lại URL đã có kết quả |

---

**Lưu ý:**
- Bài này tập trung vào cách migrate — không cần migrate toàn bộ project, chỉ cần hiểu pattern ở các file quan trọng.
- Các bài tập (9.1, 9.2, 9.3) là project độc lập để luyện từng khái niệm riêng, không phải tiếp nối project bài 8.
- Project bài 8 (JavaScript) vẫn là nền tảng — bài 10 sẽ hoàn thiện project đó.
