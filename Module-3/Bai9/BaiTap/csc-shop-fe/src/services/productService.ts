import axiosClient from "../api/axiosClient";
import { Product } from "../types";

// Params accepted by GET /products on the backend.
export interface GetProductsParams {
  search?: string;
  category?: string;
  minPrice?: number | "";
  maxPrice?: number | "";
  sortBy?: "price" | "rating" | "createdAt" | "";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
}

// Drop empty / undefined values so we never send `minPrice=` to the API.
const clean = (obj: Record<string, unknown>) => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== "" && v !== undefined && v !== null) out[k] = v;
  }
  return out;
};

export const getProducts = async (params: GetProductsParams = {}): Promise<GetProductsResponse> => {
  const { signal, ...query } = params;

  const response = await axiosClient.get("/products", {
    params: clean(query),
    signal,
  });

  // Backend shape: { success, data: Product[], meta: { total, ... } }
  return {
    products: response.data.data as Product[],
    total: response.data.meta?.total ?? response.data.data.length,
  };
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axiosClient.get(`/products/${id}`);
  return response.data.data as Product;
};
