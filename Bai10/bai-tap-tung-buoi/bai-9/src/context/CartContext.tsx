/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { CartAction, CartState } from "../types/cart";
import { cartReducer } from "./cartReducer";

// createContext với undefined — bắt lỗi nếu dùng ngoài Provider
interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
  isInWishlist: (id: number) => boolean;
  toggleWishlist: (id: number) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const initialState: CartState = {
  cartItems: [],
  wishlistItems: [],
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const totalItems = useMemo(
    () => state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [state.cartItems]
  );

  const totalPrice = useMemo(
    () => state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.cartItems]
  );

  const isInWishlist = (id: number) => state.wishlistItems.includes(id);

  const toggleWishlist = (id: number) => {
    dispatch({ type: "TOGGLE_WISHLIST", payload: id });
  };

  return (
    <CartContext.Provider value={{ state, dispatch, totalItems, totalPrice, isInWishlist, toggleWishlist }}>
      {children}
    </CartContext.Provider>
  );
};

// Guard hook — throw lỗi rõ ràng nếu dùng ngoài CartProvider
export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
