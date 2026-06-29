import axiosClient from "./axiosClient";

export const orderApi = {
  create: (payload: unknown) => axiosClient.post("/orders", payload),
  getMyOrders: () => axiosClient.get("/orders/my"),
  getAll: (params?: Record<string, unknown>) => axiosClient.get("/orders", { params }),
  updateStatus: (id: number, status: string) => axiosClient.patch(`/orders/${id}/status`, { status }),
};
