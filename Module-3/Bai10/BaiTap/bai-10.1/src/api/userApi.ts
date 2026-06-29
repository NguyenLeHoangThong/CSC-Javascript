import axiosClient from "./axiosClient";

export const userApi = {
  getAll: (params?: Record<string, unknown>) => axiosClient.get("/users", { params }),
  updateRole: (id: number, role: string) => axiosClient.patch(`/users/${id}/role`, { role }),
  remove: (id: number) => axiosClient.delete(`/users/${id}`),
};
