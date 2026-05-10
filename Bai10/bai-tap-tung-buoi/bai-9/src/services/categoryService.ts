import axiosClient from "../api/axiosClient";
import type { Category } from "../types";

export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosClient.get("/products/categories");

  return Array.isArray(response.data)
    ? response.data.map((item: string, index: number) => ({
        id: index + 1,
        slug: item,
        name: item.charAt(0).toUpperCase() + item.slice(1),
      }))
    : [];
};
