import axios from "axios";

const API_KEY = "YOUR_API_KEY_HERE"; // 👈 Thay bằng API key của bạn, đăng ký API miễn phí tại https://twelvedata.com/
const BASE_URL = "https://api.twelvedata.com";

export const stockService = {
  /**
   * Lấy nhiều mã cùng lúc
   */
  getQuotes: async (symbols) => {
    try {
      const res = await axios.get(`${BASE_URL}/quote`, {
        params: {
          symbol: symbols.join(","), // 👈 multi-symbol
          apikey: API_KEY,
        },
      });

      const data = res.data;

      // API error
      if (data.code) {
        throw new Error(data.message || "API_ERROR");
      }

      // normalize data
      return Object.keys(data).map((symbol) => {
        const item = data[symbol];

        return {
          symbol,
          price: parseFloat(item.price),
          change: parseFloat(item.change),
          changePercent: item.percent_change + "%",
          volume: item.volume,
          lastUpdated: new Date().toLocaleTimeString(),
        };
      });
    } catch (err) {
      console.error(err);
      throw new Error("API_ERROR");
    }
  },
};
