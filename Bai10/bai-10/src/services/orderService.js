import axios from "axios";

export const createOrder = async (cartItems) => {
  const response = await axios.post("https://jsonplaceholder.typicode.com/posts", {
    customerId: 1,
    products: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
    status: "new",
  });

  return response.data;
};
