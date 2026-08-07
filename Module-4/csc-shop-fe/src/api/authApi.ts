import axiosClient from "./axiosClient";

export const authApi = {
  register: (data: { name: string; email: string; password: string }) => axiosClient.post("/auth/register", data),
  login: (data: { email: string; password: string }) => axiosClient.post("/auth/login", data),
  logout: () => axiosClient.post("/auth/logout"),
  getMe: () => axiosClient.get("/auth/me"),
};
