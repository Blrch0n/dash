"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
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

        // Check if we have valid authentication without making API calls
        if (isAuthenticated()) {
          const userData = getCurrentUser();
          setUser(userData);
          setIsInitialized(true);
          setLoading(false);
          return;
        }

        // Only verify token with API if we have a token but basic validation failed
        const token = getCurrentUser() ? "token_exists" : null;
        if (token) {
          try {
            const isValid = await initializeAuth();
            if (isValid) {
              const userData = getCurrentUser();
              setUser(userData);
            } else {
              setUser(null);
            }
          } catch (error) {
            console.error("Auth verification failed:", error);
            setUser(null);
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
