// Bài 31 (phát hiện qua E2E) — các type này PHẢI khớp `orderCreateSchema` của backend.
//
// Module 3 gửi `userName/userEmail/userPhone` và mỗi item kèm `title/price/thumbnail`.
// Backend dùng `stripUnknown: true` nên các field lạ bị bỏ, còn `customerName` bắt buộc
// thì thiếu → mọi lần đặt hàng đều 400. Không unit test nào bắt được vì cả hai phía
// đều "đúng" một mình; chỉ E2E chạy thật mới lộ ra.

// Backend chỉ nhận productId + quantity. Giá được tra lại từ DB — client không được
// phép tự khai giá.
export interface OrderItemPayload {
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
  deliveryDate?: string;
  note?: string;
  items: OrderItemPayload[];
}

// Backend trả về item kèm product được `include` sẵn (không N+1).
export interface OrderItemView {
  id: number;
  productId: number;
  price: number | string;
  quantity: number;
  product?: { title: string; thumbnail: string };
}

export interface Order {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  totalAmount: number | string;
  status: string;
  createdAt: string;
  items: OrderItemView[];
}
