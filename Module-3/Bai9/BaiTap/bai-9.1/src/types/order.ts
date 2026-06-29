// Each item carries a snapshot of title/price/thumbnail (the backend stores them as-is).
export interface OrderItemPayload {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export interface CreateOrderPayload {
  userName: string;
  userEmail: string;
  userPhone: string;
  address: string;
  provinceCode?: string;
  wardCode?: string;
  deliveryDate?: string;
  note?: string;
  items: OrderItemPayload[];
}

export interface OrderItemView {
  id: number;
  productId: number;
  title: string;
  price: number | string;
  quantity: number;
  thumbnail: string;
}

export interface Order {
  id: number;
  userName: string;
  totalAmount: number | string;
  status: string;
  createdAt: string;
  items: OrderItemView[];
}
