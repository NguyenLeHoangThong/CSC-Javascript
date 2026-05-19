// Discriminated union cho trạng thái fetch
// Khi status === "success", TypeScript tự biết data tồn tại

import { Product } from "./product";

// Khi status === "error", TypeScript tự biết error tồn tại
export type ApiState<T> = { status: "idle" } | { status: "loading" } | { status: "success"; data: T } | { status: "error"; error: string };

export interface ProductResponse {
  products: Product[];
}
