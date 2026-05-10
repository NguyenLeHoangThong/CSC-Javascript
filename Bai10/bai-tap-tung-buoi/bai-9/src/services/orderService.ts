import axios from "axios";
import type { CreateOrderPayload, OrderResponse } from "../types/order";

export const createOrder = async (payload: CreateOrderPayload): Promise<OrderResponse> => {
  const response = await axios.post("https://jsonplaceholder.typicode.com/posts", payload);

  return response.data;
};
