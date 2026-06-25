// Payload sent to POST /orders
export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  provinceCode?: string;
  wardCode?: string;
  note?: string;
  deliveryDate?: string;
  items: CreateOrderItem[];
}

// Shape returned by the backend for an order
export interface OrderItemView {
  id: number;
  productId: number;
  quantity: number;
  price: number | string;
  product?: { title: string; thumbnail: string };
}

export interface Order {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  totalAmount: number | string;
  status: string;
  createdAt: string;
  items: OrderItemView[];
}
