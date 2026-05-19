import { createContext, useContext, useMemo, useReducer, type ReactNode, type Dispatch } from "react";

import { cartReducer } from "./cartReducer";
import { CartAction, CartItem } from "../types/cart";

type CartState = {
  cartItems: CartItem[];
  wishlistItems: number[];
};

type CartContextType = {
  cartItems: CartItem[];
  wishlistItems: number[];
  dispatch: Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => void;
};

const initialState: CartState = {
  cartItems: [],
  wishlistItems: [],
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  wishlistItems: [],
  dispatch: () => undefined,
  totalItems: 0,
  totalPrice: 0,
  isInWishlist: () => false,
  toggleWishlist: () => undefined,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const totalItems = useMemo(() => state.cartItems.reduce((t, i) => t + i.quantity, 0), [state.cartItems]);

  const totalPrice = useMemo(() => state.cartItems.reduce((t, i) => t + (Number(i.price) || 0) * i.quantity, 0), [state.cartItems]);

  const isInWishlist = (id: number) => state.wishlistItems.includes(id);

  const toggleWishlist = (id: number) => dispatch({ type: "TOGGLE_WISHLIST", payload: id });

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
        dispatch,
        totalItems,
        totalPrice,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
