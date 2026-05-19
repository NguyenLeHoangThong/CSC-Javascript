import axios from "axios";

export const createOrder = async (cartItems) => {
  const response = await axios.post("https://jsonplaceholder.typicode.com/posts", cartItems);

  return response.data;
};
