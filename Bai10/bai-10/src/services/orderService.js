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

export const updateOrder = async (cartId, products) => {
  const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${cartId}`, {
    products,
  });

  return response.data;
};

export const deleteOrder = async (cartId) => {
  const response = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${cartId}`);

  return response.data;
};
