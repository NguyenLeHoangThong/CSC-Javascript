import axios from "axios";

export const getProvinces = async () => {
  const response = await axios.get("https://provinces.open-api.vn/api/v2/p/");
  return Array.isArray(response.data) ? response.data : [];
};

export const getWardsByProvince = async (provinceCode: string) => {
  const res = await axios.get(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`);

  return res.data?.wards ?? [];
};
