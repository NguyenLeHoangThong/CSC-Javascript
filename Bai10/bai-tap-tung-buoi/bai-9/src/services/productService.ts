import axios from "axios";
import type { Product } from "../types/cart";

// Raw shape từ FakeStore API — dùng để normalize
interface RawProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: { rate: number; count: number };
  description: string;
}

const normalizeProduct = (raw: RawProduct): Product => ({
  id: raw.id,
  title: raw.title,
  price: raw.price,
  thumbnail: raw.image,
  category: raw.category,
  rating: raw.rating?.rate ?? 4.0,
  description: raw.description,
});

export const productService = {
  // Return type rõ ràng: Promise<Product[]>
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get<RawProduct[]>(
      "https://fakestoreapi.com/products?limit=8"
    );
    return response.data.map(normalizeProduct);
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await axios.get<RawProduct>(
      `https://fakestoreapi.com/products/${id}`
    );
    return normalizeProduct(response.data);
  },
};
