import { Product } from "./product";

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  cartItems: CartItem[];
  wishlistItems: number[];
}

// Discriminated Union
export type CartAction =
  | {
      type: "HYDRATE_STATE";
      payload: CartState;
    }
  | {
      type: "ADD_TO_CART";
      payload: Product;
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: number;
    }
  | {
      type: "INCREASE_QUANTITY";
      payload: number;
    }
  | {
      type: "DECREASE_QUANTITY";
      payload: number;
    }
  | {
      type: "CLEAR_CART";
    }
  | {
      type: "TOGGLE_WISHLIST";
      payload: number;
    };
