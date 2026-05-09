export const cartReducer = (state, action) => {
  switch (action.type) {
    case "HYDRATE_STATE":
      return {
        ...state,
        ...action.payload,
      };

    case "ADD_TO_CART": {
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
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload
            ? {
                ...item,
                quantity: item.quantity > 1 ? item.quantity - 1 : 1,
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
      const productId = action.payload;
      const hasItem = state.wishlistItems.includes(productId);
      return {
        ...state,
        wishlistItems: hasItem ? state.wishlistItems.filter((id) => id !== productId) : [...state.wishlistItems, productId],
      };
    }

    default:
      return state;
  }
};
