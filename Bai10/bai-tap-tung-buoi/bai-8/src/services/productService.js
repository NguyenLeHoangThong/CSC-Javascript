import axiosClient from "../api/axiosClient";

const DEFAULT_LIMIT = 24;

const normalizeProduct = (product) => ({
  id: product.id,
  title: product.title,
  description: product.description,
  price: product.price,
  category: product.category || "uncategorized",
  thumbnail: product.image || "https://placehold.co/600x600?text=Product",
  rating: product.rating?.rate ?? 4.2,
  ratingCount: product.rating?.count ?? 0,
  brand: "FakeStore",
  stock: product.stock ?? 99,
});

export const getProducts = async ({
  search = "",
  category = "all",
  minPrice = "",
  maxPrice = "",
  sortBy = "",
  order = "asc",
  skip = 0,
  limit = DEFAULT_LIMIT,
} = {}) => {
  const hasSearch = search.trim().length > 0;
  const hasCategory = category && category !== "all";
  const endpoint = hasCategory ? `/products/category/${category}` : "/products";
  const response = await axiosClient.get(endpoint, {
    params: {
      limit,
    },
  });

  let products = Array.isArray(response.data) ? response.data.map(normalizeProduct) : [];

  if (hasSearch) {
    const query = search.trim().toLowerCase();
    products = products.filter((product) => product.title.toLowerCase().includes(query));
  }

  if (minPrice !== "") {
    products = products.filter((product) => Number(product.price) >= Number(minPrice));
  }

  if (maxPrice !== "") {
    products = products.filter((product) => Number(product.price) <= Number(maxPrice));
  }

  if (sortBy === "price") {
    products = [...products].sort((a, b) => (order === "desc" ? b.price - a.price : a.price - b.price));
  }

  if (sortBy === "rating") {
    products = [...products].sort((a, b) => (order === "desc" ? b.rating - a.rating : a.rating - b.rating));
  }

  return {
    products,
    total: products.length,
    limit,
    skip,
  };
};

export const getCategories = async () => {
  const response = await axiosClient.get("/products/categories");
  return Array.isArray(response.data)
    ? response.data.map((item, index) => ({
        id: index + 1,
        slug: item,
        name: item.charAt(0).toUpperCase() + item.slice(1),
      }))
    : [];
};

export const getProductById = async (id) => {
  const response = await axiosClient.get(`/products/${id}`);
  return normalizeProduct(response.data);
};

export const getProductsByIds = async (items) => {
  const requests = items.map((item) => axiosClient.get(`/products/${item.id}`));
  const responses = await Promise.all(requests);
  return responses.map((response, index) => ({
    ...normalizeProduct(response.data),
    quantity: items[index].quantity,
  }));
};
