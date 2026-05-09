export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  cartItems: CartItem[];
  wishlistItems: number[];
}

// Discriminated union — mỗi action có type riêng biệt
// TypeScript dùng "type" field để thu hẹp kiểu trong switch/case
export type CartAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "INCREASE_QUANTITY"; payload: number }
  | { type: "DECREASE_QUANTITY"; payload: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_WISHLIST"; payload: number };
