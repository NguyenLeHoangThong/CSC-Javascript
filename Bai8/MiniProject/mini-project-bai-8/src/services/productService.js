import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

export const productService = {
  /**
   * Lấy danh sách sản phẩm
   * @param {number} limit - Số lượng sản phẩm muốn lấy
   */
  getProducts: async (limit = 20) => {
    try {
      const response = await axios.get(`${BASE_URL}/products?limit=${limit}`);
      return response.data.products; // Trả về mảng products cho component
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      throw error; // Ném lỗi để component xử lý (nếu cần hiển thị thông báo)
    }
  },

  /**
   * Tìm kiếm sản phẩm qua API (nếu cần)
   */
  searchProducts: async (query) => {
    const response = await axios.get(`${BASE_URL}/products/search?q=${query}`);
    return response.data.products;
  }
};