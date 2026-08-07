import axiosClient from "../api/axiosClient";
import { Product } from "../types";

export interface GetProductsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
}

// Drop empty values so we never send `category=` etc. to the API.
const clean = (obj: Record<string, unknown>) => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== "" && v !== undefined && v !== null && v !== "all") out[k] = v;
  }
  return out;
};

// Backend already returns the exact Product shape (price/rating numbers, category slug),
// so no normalizeProduct() is needed anymore.
export const getProducts = async (params: GetProductsParams = {}): Promise<GetProductsResponse> => {
  const { signal, ...query } = params;
  const res = await axiosClient.get("/products", { params: clean(query), signal });
  // Backend shape: { success, data: Product[], meta: { total, ... } }
  return { products: res.data.data as Product[], total: res.data.meta?.total ?? res.data.data.length };
};

export const getProductById = async (id: number): Promise<Product> => {
  const res = await axiosClient.get(`/products/${id}`);
  return res.data.data as Product;
};
