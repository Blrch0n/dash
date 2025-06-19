"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import {
  isAuthenticated,
  getCurrentUser,
  logout as authLogout,
  initializeAuth,
  setupAuthEvents,
} from "../lib/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);

        // Check if we have valid authentication
        if (isAuthenticated()) {
          const userData = getCurrentUser();
          setUser(userData);
          setIsInitialized(true);
          setLoading(false);
          return;
        }

        // If we have a token but basic validation failed, verify with backend
        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            const response = await api.auth.verifyToken();
            if (response.success && response.data?.user) {
              setUser(response.data.user);
              // Update stored user data
              localStorage.setItem(
                "user-data",
                JSON.stringify(response.data.user)
              );
            } else {
              setUser(null);
              // Clear invalid tokens
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user-data");
            }
          } catch (error) {
            console.error("Auth verification failed:", error);
            setUser(null);
            // Clear invalid tokens
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user-data");
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  // Set up auth event listeners
  useEffect(() => {
    const cleanup = setupAuthEvents(
      () => {
        // On login
        const userData = getCurrentUser();
        setUser(userData);
      },
      () => {
        // On logout
        setUser(null);
      }
    );

    return cleanup;
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authLogout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear user state even if logout fails
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
    isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
