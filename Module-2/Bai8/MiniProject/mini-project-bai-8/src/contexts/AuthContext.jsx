import React, { createContext, useState, useCallback, useMemo } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());

  const login = useCallback(async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // Tối ưu Provider: chỉ re-render con khi user thay đổi
  const contextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
