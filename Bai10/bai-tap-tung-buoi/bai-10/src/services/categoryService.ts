import axiosClient from "../api/axiosClient";
import type { Category } from "../types";

export const getCategories = async (config?: { signal?: AbortSignal }): Promise<Category[]> => {
  const response = await axiosClient.get<string[]>("/products/categories", {
    signal: config?.signal,
  });

  return Array.isArray(response.data)
    ? response.data.map((item, index) => ({
        id: index + 1,
        slug: item,
        name: item.charAt(0).toUpperCase() + item.slice(1),
      }))
    : [];
};
