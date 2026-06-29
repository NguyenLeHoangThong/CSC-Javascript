import axiosClient from "../api/axiosClient";
import type { CreateOrderPayload, Order } from "../types/order";

// POST /orders — guest checkout works without a token; if logged in, axiosClient attaches it.
export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const res = await axiosClient.post("/orders", payload);
  return res.data.data;
};
