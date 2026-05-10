import { CartAction, CartState } from "../types/cart";

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "HYDRATE_STATE":
      return {
        cartItems: action.payload.cartItems ?? [],
        wishlistItems: action.payload.wishlistItems ?? [],
      };

    case "ADD_TO_CART": {
      if (!action.payload?.id) return state;

      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        };
      }

      return {
        ...state,
        cartItems: [
          ...state.cartItems,
          {
            ...action.payload,
            quantity: 1,
          },
        ],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };

    case "INCREASE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) => (item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item)),
      };

    case "DECREASE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload
            ? {
                ...item,
                quantity: Math.max(1, item.quantity - 1),
              }
            : item
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
      };

    case "TOGGLE_WISHLIST": {
      const exists = state.wishlistItems.includes(action.payload);

      return {
        ...state,
        wishlistItems: exists ? state.wishlistItems.filter((id) => id !== action.payload) : [...state.wishlistItems, action.payload],
      };
    }

    default:
      return state;
  }
};
