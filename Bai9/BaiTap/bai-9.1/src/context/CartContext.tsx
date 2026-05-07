import React, { createContext, useContext, useReducer, type ReactNode } from "react";
import type { CartState, CartAction } from "../types/cart";

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

const calculateTotals = (items: any[]) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalPrice, totalCount };
};

function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems;
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
      if (existingIndex > -1) {
        newItems = [...state.items];
        newItems[existingIndex].quantity += 1;
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    case "REMOVE_ITEM":
      newItems = state.items.filter((item) => item.id !== action.payload);
      return { ...state, items: newItems, ...calculateTotals(newItems) };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
