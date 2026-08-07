import axiosClient from "./axiosClient";

export const authApi = {
  // Bài 31 — `registerSchema` của backend yêu cầu CẢ `confirmPassword`. Module 3 chỉ
  // gửi name/email/password nên mọi lần đăng ký đều 400 "Please confirm your password".
  register: (data: { name: string; email: string; password: string; confirmPassword: string }) =>
    axiosClient.post("/auth/register", data),
  login: (data: { email: string; password: string }) => axiosClient.post("/auth/login", data),
  logout: () => axiosClient.post("/auth/logout"),
  getMe: () => axiosClient.get("/auth/me"),
};
