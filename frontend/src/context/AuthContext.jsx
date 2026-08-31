import { createContext, useContext, useEffect, useRef, useState } from "react";

import authService from "@/services/auth/authService";
import tokenManager from "@/services/auth/tokenManager";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initialized = useRef(false);

  /**
   * Restore authentication state on application startup.
   */
  async function initializeAuth() {
    try {
      await authService.refresh();

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      tokenManager.clearAccessToken();

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Prevent duplicate initialization
   * in React StrictMode development mode.
   */
  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    initializeAuth();
  }, []);

  /**
   * Login user.
   */
  async function login(credentials) {
    const loggedInUser = await authService.login(credentials);

    setIsLoggingOut(false);
    setUser(loggedInUser);
  }

  /**
   * Register user.
   */
  async function register(userData) {
    const response = await authService.register(userData);

    return response;
  }

  /**
   * Fetch latest authenticated user.
   */
  async function refreshUser() {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);

    return currentUser;
  }

  /**
   * Logout user.
   */
  async function logout() {
    setIsLoggingOut(true);

    try {
      await authService.logout();
    } finally {
      tokenManager.clearAccessToken();

      setUser(null);
    }
  }

  async function changePassword(passwordData) {
    return await authService.changePassword(passwordData);
  }

  async function deleteAccount() {
    try {
      await authService.deleteAccount();
    } finally {
      tokenManager.clearAccessToken();
      setUser(null);
    }
  }

  const isAuthenticated = Boolean(user);

  const value = {
    user,

    isLoading,

    isLoggingOut,

    isAuthenticated,

    login,

    register,

    logout,

    refreshUser,

    changePassword,
    
    deleteAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
