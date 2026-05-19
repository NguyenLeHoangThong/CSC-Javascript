import axios from "axios";
import type { Product } from "../types/cart";

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get("https://fakestoreapi.com/products?limit=8");
    return response.data.map((item: any) => ({
      id: item.id,
      name: item.title,
      price: Math.round(item.price * 25000),
      image: item.image,
      category: item.category,
    }));
  },
};
