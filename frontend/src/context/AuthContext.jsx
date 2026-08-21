import { createContext, useContext, useEffect, useState } from "react";

import authService from "@/services/auth/authService";
import tokenManager from "@/services/auth/tokenManager";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  async function initializeAuth() {
    try {
      const currentUser = await authService.refresh();

      setUser(currentUser);
    } catch (error) {
      tokenManager.clearAccessToken();

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    initializeAuth();
  }, []);

  async function login(credentials) {
    const loggedInUser = await authService.login(credentials);

    setUser(loggedInUser);
  }

  async function register(userData) {
    return await authService.register(userData);
  }

  async function logout() {
    await authService.logout();

    setUser(null);
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,

    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
