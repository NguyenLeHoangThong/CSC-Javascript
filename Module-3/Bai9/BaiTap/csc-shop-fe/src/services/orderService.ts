import axiosClient from "../api/axiosClient";
import type { CreateOrderPayload, Order } from "../types/order";

// POST /orders — requires a logged-in user (token attached by axiosClient interceptor).
export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const response = await axiosClient.post("/orders", payload);
  return response.data.data;
};

// GET /orders/me — the current user's order history.
export const getMyOrders = async (): Promise<Order[]> => {
  const response = await axiosClient.get("/orders/me");
  return response.data.data;
};
