// Memory-optimized Context Provider
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Memoized auth functions to prevent re-creation
const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const userData = localStorage.getItem("user-data");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

const isAuthenticated = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  return !!(token && user);
};

export const AuthProviderOptimized = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    isInitialized: false,
  });

  // Memoized auth actions
  const login = useCallback(async (credentials) => {
    try {
      const response = await api.auth.login(credentials);
      if (
        response.success &&
        response.data?.user &&
        response.data?.accessToken
      ) {
        // Store auth data
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user-data", JSON.stringify(response.data.user));

        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }

        setAuthState((prev) => ({
          ...prev,
          user: response.data.user,
          loading: false,
        }));

        return response;
      }
      throw new Error(response.message || "Login failed");
    } catch (error) {
      setAuthState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    // Clear storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user-data");

    setAuthState({
      user: null,
      loading: false,
      isInitialized: true,
    });
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const response = await api.auth.refreshToken({ refreshToken });
      if (response.success && response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);

        if (response.data.user) {
          localStorage.setItem("user-data", JSON.stringify(response.data.user));
          setAuthState((prev) => ({ ...prev, user: response.data.user }));
        }

        return response;
      }
      throw new Error("Token refresh failed");
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = getStoredUser();
          setAuthState({
            user: userData,
            loading: false,
            isInitialized: true,
          });
          return;
        }

        // Try to refresh token if available
        const token = getStoredToken();
        const refreshTokenValue = localStorage.getItem("refreshToken");

        if (token && refreshTokenValue) {
          try {
            await refreshToken();
            return;
          } catch (error) {
            console.warn("Token refresh failed during initialization");
          }
        }

        // No valid auth
        setAuthState({
          user: null,
          loading: false,
          isInitialized: true,
        });
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setAuthState({
          user: null,
          loading: false,
          isInitialized: true,
        });
      }
    };

    initializeAuth();
  }, [refreshToken]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user: authState.user,
      loading: authState.loading,
      isInitialized: authState.isInitialized,
      isAuthenticated: !!authState.user,
      login,
      logout,
      refreshToken,
    }),
    [authState, login, logout, refreshToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProviderOptimized;
