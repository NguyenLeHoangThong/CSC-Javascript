/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useReducer } from "react";

import { cartReducer } from "./cartReducer";

const CartContext = createContext();

const initialState = {
  cartItems: [],
  wishlistItems: [],
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

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
