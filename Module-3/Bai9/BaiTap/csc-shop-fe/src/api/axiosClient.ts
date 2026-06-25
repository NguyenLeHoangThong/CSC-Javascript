import axios from "axios";

// localStorage keys shared with the auth layer
export const ACCESS_TOKEN_KEY = "csc-access-token";
export const REFRESH_TOKEN_KEY = "csc-refresh-token";

// Read API base URL from the Vite env (.env). Fallback to localhost for convenience.
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

const axiosClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach the access token to every call ──
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: if the access token expired (401), try refreshing once ──
let isRefreshing = false;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    // Only retry once, only on 401, and only when we actually have a refresh token.
    if (error.response?.status === 401 && refreshToken && !original._retry && !isRefreshing) {
      original._retry = true;
      isRefreshing = true;
      try {
        // Use a bare axios call so we don't loop through this interceptor again.
        const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data.data;

        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);

        original.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(original); // replay the original request
      } catch {
        // Refresh failed → clear tokens; the UI will treat the user as logged out.
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
