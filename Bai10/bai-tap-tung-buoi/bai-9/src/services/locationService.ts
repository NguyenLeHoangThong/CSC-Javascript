import axios from "axios";

export const getProvinces = async () => {
  const response = await axios.get("https://provinces.open-api.vn/api/v2/p/");
  return Array.isArray(response.data) ? response.data : [];
};
