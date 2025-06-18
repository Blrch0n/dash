// Authentication utilities for client-side auth management
import { api, tokenUtils } from "../services/api";

// Key for localStorage
const AUTH_TOKEN_KEY = "accessToken";
const USER_DATA_KEY = "user";

// Helper function to set cookie
const setCookie = (name, value, days = 7) => {
  if (typeof document !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }
};

// Helper function to get cookie
const getCookie = (name) => {
  if (typeof document !== "undefined") {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

// Helper function to delete cookie
const deleteCookie = (name) => {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
  }
};

// Register new user
export const register = async (userData) => {
  try {
    const response = await api.auth.register(userData);

    if (response.success) {
      // Store user data in localStorage (tokens are handled by API service)
      const user = response.data.user;
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      }

      // Set auth cookie for SSR compatibility
      setCookie("isAuthenticated", "true", 7);

      return {
        success: true,
        user: user,
        message: response.message,
      };
    }

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.auth.login(credentials);

    if (response.success) {
      // Store user data in localStorage (tokens are handled by API service)
      const user = response.data.user;
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      }

      // Set auth cookie for SSR compatibility
      setCookie("isAuthenticated", "true", 7);

      return {
        success: true,
        user: user,
        message: response.message,
      };
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Logout user
export const logout = async () => {
  try {
    await api.auth.logout();
  } catch (error) {
    console.error("Logout error:", error);
    // Continue with client-side cleanup even if server logout fails
  } finally {
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      // Dispatch logout event for components to listen to
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    // Clear auth cookie
    deleteCookie("isAuthenticated");
  }
};

// Logout from all devices
export const logoutAll = async () => {
  try {
    await api.auth.logoutAll();
  } catch (error) {
    console.error("Logout all error:", error);
    // Continue with client-side cleanup even if server logout fails
  } finally {
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      // Dispatch logout event for components to listen to
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    // Clear auth cookie
    deleteCookie("isAuthenticated");
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return tokenUtils.isAuthenticated();
};

// Get current user data
export const getCurrentUser = () => {
  return tokenUtils.getUser();
};

// Get access token
export const getAccessToken = () => {
  return tokenUtils.getAccessToken();
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await api.auth.updateProfile(profileData);

    if (response.success) {
      // Update user data in localStorage
      const user = response.data.user;
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      }

      return {
        success: true,
        user: user,
        message: response.message,
      };
    }

    return response;
  } catch (error) {
    console.error("Profile update error:", error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await api.auth.changePassword(passwordData);

    if (response.success) {
      // Clear auth data as user needs to login again
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
      deleteCookie("isAuthenticated");
    }

    return response;
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
};

// Verify token validity
export const verifyToken = async () => {
  try {
    const response = await api.auth.verifyToken();

    if (response.success) {
      // Update user data if changed
      const user = response.data.user;
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      }
      return response;
    }

    return response;
  } catch (error) {
    console.error("Token verification error:", error);
    // Clear invalid auth data
    tokenUtils.clearAuthData();
    deleteCookie("isAuthenticated");
    throw error;
  }
};

// Initialize auth state on app load
export const initializeAuth = async () => {
  try {
    // First check if we have valid tokens locally
    if (isAuthenticated()) {
      // If tokens are valid locally, no need to hit the API
      return true;
    }

    // Only verify with server if we have tokens but they appear invalid
    const token = tokenUtils.getAccessToken();
    if (token) {
      try {
        await verifyToken();
        return true;
      } catch (error) {
        console.error("Token verification failed during init:", error);
        tokenUtils.clearAuthData();
        deleteCookie("isAuthenticated");
        return false;
      }
    }

    return false;
  } catch (error) {
    console.error("Auth initialization error:", error);
    tokenUtils.clearAuthData();
    deleteCookie("isAuthenticated");
    return false;
  }
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user?.role === role;
};

// Check if user is admin
export const isAdmin = () => {
  return hasRole("admin");
};

// Get user's full name
export const getUserFullName = () => {
  const user = getCurrentUser();
  return user ? `${user.firstName} ${user.lastName}` : "";
};

// Get user's initials
export const getUserInitials = () => {
  const user = getCurrentUser();
  if (!user) return "";

  const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || "";
  const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || "";

  return `${firstInitial}${lastInitial}`;
};

// Auth event listeners for React components
export const setupAuthEvents = (onLogin, onLogout) => {
  if (typeof window !== "undefined") {
    const handleLogin = () => onLogin && onLogin();
    const handleLogout = () => onLogout && onLogout();

    window.addEventListener("auth:login", handleLogin);
    window.addEventListener("auth:logout", handleLogout);

    // Cleanup function
    return () => {
      window.removeEventListener("auth:login", handleLogin);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }

  return () => {}; // No-op cleanup for SSR
};
