export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
  description: string;
  ratingCount?: number;
  brand?: string;
  stock?: number;
}

export const priceMap = {
  all: {},
  under50: { minPrice: "", maxPrice: 50 },
  from50to200: { minPrice: 50, maxPrice: 200 },
  from200to500: { minPrice: 200, maxPrice: 500 },
  from500: { minPrice: 500, maxPrice: "" },
} as const;

export type PriceRange = keyof typeof priceMap;

export const sortMap = {
  default: {},
  priceAsc: { sortBy: "price", order: "asc" },
  priceDesc: { sortBy: "price", order: "desc" },
  ratingDesc: { sortBy: "rating", order: "desc" },
} as const;

export type SortOption = keyof typeof sortMap;
