import axiosClient from "./axiosClient";

export const orderApi = {
  create: (payload: unknown) => axiosClient.post("/orders", payload),
  // Bài 31 — was "/orders/my", which the backend does not have: Express matched it
  // against `GET /orders/:id`, validateId rejected "my" and the page died with a 400.
  // The real route is /orders/me.
  getMyOrders: () => axiosClient.get("/orders/me"),
  getAll: (params?: Record<string, unknown>) => axiosClient.get("/orders", { params }),
  updateStatus: (id: number, status: string) => axiosClient.patch(`/orders/${id}/status`, { status }),
};
