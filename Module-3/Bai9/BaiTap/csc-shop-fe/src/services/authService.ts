import axiosClient from "../api/axiosClient";
import type { AuthUser, LoginResponse, RegisterPayload } from "../types/auth";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axiosClient.post("/auth/login", { email, password });
  return response.data.data;
};

export const register = async (payload: RegisterPayload): Promise<AuthUser> => {
  const response = await axiosClient.post("/auth/register", payload);
  return response.data.data;
};

export const getMe = async (): Promise<AuthUser> => {
  const response = await axiosClient.get("/auth/me");
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await axiosClient.post("/auth/logout");
};
