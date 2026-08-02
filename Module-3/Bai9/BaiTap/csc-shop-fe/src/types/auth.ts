export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
