import axiosClient from "../api/axiosClient";
import { Product } from "../types";

/**
 * Raw API response từ FakeStoreAPI
 */
export interface RawProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface GetProductsParams {
  search?: string;
  category?: string;
  minPrice?: number | "";
  maxPrice?: number | "";
  sortBy?: "price" | "rating" | "";
  order?: "asc" | "desc";
  skip?: number;
  limit?: number;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  skip: number;
}

const DEFAULT_LIMIT = 24;

const normalizeProduct = (item: RawProduct): Product => ({
  id: item.id,
  title: item.title,
  description: item.description,
  price: item.price,
  category: item.category ?? "uncategorized",
  thumbnail: item.image,

  rating: item.rating?.rate ?? 0,
  ratingCount: item.rating?.count ?? 0,

  brand: "FakeStore",
  stock: 99,
});

export const getProducts = async (params: GetProductsParams & { signal?: AbortSignal } = {}): Promise<GetProductsResponse> => {
  const { search = "", category = "all", minPrice = "", maxPrice = "", sortBy = "", order = "asc", skip = 0, limit = DEFAULT_LIMIT, signal } = params;

  const hasSearch = search.trim().length > 0;
  const hasCategory = category !== "all";

  const endpoint = hasCategory ? `/products/category/${category}` : "/products";

  const response = await axiosClient.get(endpoint, {
    params: { limit },
    signal,
  });

  let products: Product[] = Array.isArray(response.data) ? response.data.map(normalizeProduct) : [];

  if (hasSearch) {
    const q = search.toLowerCase();
    products = products.filter((p) => p.title.toLowerCase().includes(q));
  }

  if (minPrice !== "") {
    products = products.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice !== "") {
    products = products.filter((p) => p.price <= Number(maxPrice));
  }

  if (sortBy === "price") {
    products = [...products].sort((a, b) => (order === "desc" ? b.price - a.price : a.price - b.price));
  }

  if (sortBy === "rating") {
    products = [...products].sort((a, b) => (order === "desc" ? b.rating - a.rating : a.rating - b.rating));
  }

  return {
    products,
    total: products.length,
    limit,
    skip,
  };
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axiosClient.get<RawProduct>(`/products/${id}`);

  return normalizeProduct(response.data);
};

export const getProductsByIds = async (items: { id: number; quantity: number }[]): Promise<(Product & { quantity: number })[]> => {
  const results: (Product & { quantity: number })[] = [];

  for (const item of items) {
    const res = await axiosClient.get<RawProduct>(`/products/${item.id}`);

    results.push({
      ...normalizeProduct(res.data),
      quantity: item.quantity,
    });
  }

  return results;
};
