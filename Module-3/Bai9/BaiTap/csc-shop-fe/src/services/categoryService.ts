import axiosClient from "../api/axiosClient";
import type { Category } from "../types";

export const getCategories = async (config?: { signal?: AbortSignal }): Promise<Category[]> => {
  const response = await axiosClient.get("/categories", { signal: config?.signal });

  // Backend returns full category objects; keep only what the UI needs.
  return (response.data.data as Category[]).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
  }));
};
