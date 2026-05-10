import { CheckoutFormData } from "../checkoutSchema";

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  products: OrderItem[];
  formData: CheckoutFormData;
}

export interface OrderResponse {
  id: number;
  customerId: number;
  products: OrderItem[];
  status: string;
}
