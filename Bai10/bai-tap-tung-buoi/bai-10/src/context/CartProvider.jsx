/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

import { cartReducer } from "./cartReducer";
import { getProductsByIds } from "../services/productService";

const CartContext = createContext();
const STORAGE_KEY = "csc-shop-state";

const initialState = {
  cartItems: [],
  wishlistItems: [],
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const hydrateState = async () => {
      try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (!savedState) return;
        const parsedState = JSON.parse(savedState);
        const cartIds = Array.isArray(parsedState.cartItemIds) ? parsedState.cartItemIds : [];
        const wishlistIds = Array.isArray(parsedState.wishlistItemIds) ? parsedState.wishlistItemIds : [];
        const cartItems = cartIds.length > 0 ? await getProductsByIds(cartIds) : [];

        dispatch({
          type: "HYDRATE_STATE",
          payload: {
            cartItems,
            wishlistItems: wishlistIds,
          },
        });
      } catch {
        dispatch({
          type: "HYDRATE_STATE",
          payload: initialState,
        });
      }
    };

    hydrateState();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cartItemIds: state.cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
        wishlistItemIds: state.wishlistItems,
      })
    );
  }, [state.cartItems, state.wishlistItems]);

  const totalItems = useMemo(() => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [state.cartItems]);

  const totalPrice = useMemo(() => {
    return state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [state.cartItems]);

  const isInWishlist = (productId) => state.wishlistItems.includes(productId);

  const toggleWishlist = (productId) => {
    dispatch({
      type: "TOGGLE_WISHLIST",
      payload: productId,
    });
  };

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
