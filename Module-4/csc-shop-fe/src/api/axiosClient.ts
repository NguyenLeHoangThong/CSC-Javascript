import axios from "axios";

// localStorage keys (shared with the auth layer added in Bài 10)
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

const axiosClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach the access token to every request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: on 401, try to refresh the token once, then replay the request.
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (error.response?.status === 401 && refreshToken && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
        localStorage.setItem(ACCESS_TOKEN_KEY, data.data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return axiosClient(original);
      } catch {
        // Refresh failed → clear tokens (the app treats the user as logged out)
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
