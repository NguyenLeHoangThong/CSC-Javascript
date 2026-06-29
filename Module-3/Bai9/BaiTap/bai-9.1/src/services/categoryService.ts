import axiosClient from "../api/axiosClient";
import type { Category } from "../types";

export const getCategories = async (config?: { signal?: AbortSignal }): Promise<Category[]> => {
  const res = await axiosClient.get("/categories", { signal: config?.signal });
  // Backend returns full category objects; keep what the UI needs.
  return (res.data.data as Category[]).map((c) => ({ id: c.id, slug: c.slug, name: c.name }));
};
