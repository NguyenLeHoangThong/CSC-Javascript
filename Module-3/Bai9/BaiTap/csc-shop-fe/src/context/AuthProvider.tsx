import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../api/axiosClient";
import * as authService from "../services/authService";
import type { AuthUser, RegisterPayload } from "../types/auth";

const USER_KEY = "csc-user";

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, restore the session from localStorage and re-validate it with /auth/me.
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((me) => setUser(me))
      .catch(() => {
        // token invalid/expired and refresh failed → clear everything
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (payload: RegisterPayload) => {
    // Create the account, then log in automatically for a smooth UX.
    await authService.register(payload);
    await login(payload.email, payload.password);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors on logout — we clear local state regardless
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Guard hook — throws a clear error if used outside the provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
