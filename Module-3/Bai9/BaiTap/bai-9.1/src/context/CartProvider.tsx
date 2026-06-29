import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode, type Dispatch } from "react";

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

const STORAGE_KEY = "csc-shop-state";

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

  const isReady = useRef(false);

  // ✅ HYDRATE (FIXED)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      isReady.current = true;
      return;
    }

    try {
      const parsed = JSON.parse(raw);

      dispatch({
        type: "HYDRATE_STATE",
        payload: {
          cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems : [],
          wishlistItems: Array.isArray(parsed.wishlistItems) ? parsed.wishlistItems : [],
        },
      });
    } catch {
      dispatch({
        type: "HYDRATE_STATE",
        payload: initialState,
      });
    } finally {
      isReady.current = true;
    }
  }, []);

  // ✅ SAVE (FULL OBJECT)
  useEffect(() => {
    if (!isReady.current) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
      })
    );
  }, [state.cartItems, state.wishlistItems]);

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
