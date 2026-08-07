import axiosClient from "./axiosClient";

export const productApi = {
  getAll: (params?: Record<string, unknown>) => axiosClient.get("/products", { params }),
  create: (data: unknown) => axiosClient.post("/products", data),
  update: (id: number, data: unknown) => axiosClient.patch(`/products/${id}`, data),
  remove: (id: number) => axiosClient.delete(`/products/${id}`),
};
