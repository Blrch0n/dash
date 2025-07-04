import axios from "axios";

// API service for connecting to MongoDB Atlas backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://dash-1-iefb.onrender.com/api";

// Safe localStorage wrapper for SSR compatibility
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for production
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add debugging for production
if (process.env.NODE_ENV === "development") {
  console.log("API Base URL:", API_BASE_URL);
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = safeLocalStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Only refresh token if:
    // 1. Response is 401 (Unauthorized)
    // 2. Request hasn't been retried yet
    // 3. The current token is actually expired
    // 4. We're not already trying to refresh tokens
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      const currentToken = safeLocalStorage.getItem("accessToken");

      // Only refresh if token exists and is expired
      if (currentToken && isTokenExpired(currentToken)) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await apiClient.post("/auth/refresh");
          const { accessToken } = refreshResponse.data;

          safeLocalStorage.setItem("accessToken", accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          safeLocalStorage.removeItem("accessToken");
          safeLocalStorage.removeItem("user");
          // Redirect to login or dispatch logout event
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("auth:logout"));
          }
          return Promise.reject(refreshError);
        }
      } else {
        // Token doesn't exist or isn't expired, clear auth data
        safeLocalStorage.removeItem("accessToken");
        safeLocalStorage.removeItem("user");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
      }
    }

    // Enhanced error logging for better debugging
    const errorInfo = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    };

    if (process.env.NODE_ENV === "development") {
      console.error("API Error Details:", errorInfo);
    }

    // Return a more structured error
    const apiError = new Error(
      error.response?.data?.message || error.message || "Unknown API error"
    );
    apiError.status = error.response?.status;
    apiError.data = error.response?.data;
    apiError.response = error.response; // Preserve the full response object
    apiError.originalError = error;

    throw apiError;
  }
);

export const api = {
  // Authentication endpoints
  auth: {
    async register(userData) {
      try {
        console.log("Attempting registration with data:", {
          ...userData,
          password: "[REDACTED]",
          confirmPassword: "[REDACTED]",
        });

        const response = await apiClient.post("/auth/register", userData);

        console.log("Registration response:", {
          success: response.success,
          message: response.message,
          hasData: !!response.data,
          hasAccessToken: !!response.data?.accessToken,
        });

        // Handle backend response structure: { success, message, data: { user, accessToken, refreshToken } }
        if (response.success && response.data?.accessToken) {
          safeLocalStorage.setItem("accessToken", response.data.accessToken);
          safeLocalStorage.setItem("user", JSON.stringify(response.data.user));
        }

        return response;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Registration failed:", {
            status: error.status,
            message: error.message,
            data: error.data,
            response: error.response,
            originalError: error.originalError,
          });
        }

        // Create error with preserved backend response data
        const userError = new Error(
          error.response?.data?.message ||
            error.data?.message ||
            error.message ||
            "Registration failed. Please try again."
        );
        userError.status = error.response?.status || error.status;
        userError.data = error.response?.data || error.data;
        userError.response = error.response;

        throw userError;
      }
    },

    async login(credentials) {
      try {
        const response = await apiClient.post("/auth/login", credentials);

        // Handle backend response structure: { success, message, data: { user, accessToken, refreshToken } }
        if (response.success && response.data?.accessToken) {
          safeLocalStorage.setItem("accessToken", response.data.accessToken);
          safeLocalStorage.setItem("user", JSON.stringify(response.data.user));
        }

        return response;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Login failed:", {
            status: error.status,
            message: error.message,
            data: error.data,
          });
        }

        // Create error with preserved backend response data
        const userError = new Error(
          error.response?.data?.message ||
            error.message ||
            "Login failed. Please check your credentials."
        );
        userError.status = error.response?.status || error.status;
        userError.response = error.response;

        throw userError;
      }
    },

    async logout() {
      try {
        return await apiClient.post("/auth/logout");
      } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
      }
    },

    async logoutAll() {
      try {
        return await apiClient.post("/auth/logout-all");
      } catch (error) {
        console.error("Error logging out from all devices:", error);
        throw error;
      }
    },

    async updateProfile(profileData) {
      try {
        return await apiClient.put("/auth/profile", profileData);
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    },

    async changePassword(passwordData) {
      try {
        return await apiClient.put("/auth/change-password", passwordData);
      } catch (error) {
        console.error("Error changing password:", error);
        throw error;
      }
    },

    async verifyToken() {
      try {
        return await apiClient.get("/auth/verify");
      } catch (error) {
        console.error("Error verifying token:", error);
        throw error;
      }
    },

    async refreshToken() {
      try {
        return await apiClient.post("/auth/refresh");
      } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
      }
    },

    async forgotPassword(emailData) {
      try {
        return await apiClient.post("/auth/forgot-password", emailData);
      } catch (error) {
        console.error("Error sending password reset:", error);
        throw error;
      }
    },

    async resetPassword(resetData) {
      try {
        return await apiClient.post("/auth/reset-password", resetData);
      } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
      }
    },
  },

  // Config endpoints
  config: {
    async getAll() {
      try {
        return await apiClient.get("/config");
      } catch (error) {
        console.error("Error fetching configs:", error);
        throw error;
      }
    },

    async getById(id) {
      try {
        return await apiClient.get(`/config/${id}`);
      } catch (error) {
        console.error("Error fetching config:", error);
        throw error;
      }
    },

    async create(configData) {
      try {
        return await apiClient.post("/config", configData);
      } catch (error) {
        console.error("Error creating config:", error);
        throw error;
      }
    },

    async update(id, configData) {
      try {
        return await apiClient.put(`/config/${id}`, configData);
      } catch (error) {
        console.error("Error updating config:", error);
        throw error;
      }
    },

    async delete(id) {
      try {
        return await apiClient.delete(`/config/${id}`);
      } catch (error) {
        console.error("Error deleting config:", error);
        throw error;
      }
    },
  },

  // Sections endpoints
  sections: {
    async getAll() {
      try {
        return await apiClient.get("/sections");
      } catch (error) {
        console.error("Error fetching sections:", error);
        throw error;
      }
    },

    async getById(id) {
      try {
        return await apiClient.get(`/sections/${id}`);
      } catch (error) {
        console.error("Error fetching section:", error);
        throw error;
      }
    },

    async getBySectionName(sectionName) {
      try {
        return await apiClient.get(`/sections/${sectionName}`);
      } catch (error) {
        console.error("Error fetching section by name:", error);
        throw error;
      }
    },

    async getBySubsection(sectionName, subsectionName) {
      try {
        return await apiClient.get(
          `/sections/${sectionName}/${subsectionName}`
        );
      } catch (error) {
        console.error("Error fetching subsection:", error);
        throw error;
      }
    },

    async create(sectionData) {
      try {
        return await apiClient.post("/sections", sectionData);
      } catch (error) {
        console.error("Error creating section:", error);
        throw error;
      }
    },

    async update(id, sectionData) {
      try {
        return await apiClient.put(`/sections/${id}`, sectionData);
      } catch (error) {
        console.error("Error updating section:", error);
        throw error;
      }
    },

    async delete(id) {
      try {
        return await apiClient.delete(`/sections/${id}`);
      } catch (error) {
        console.error("Error deleting section:", error);
        throw error;
      }
    },
  },

  // Convenience method for saving sections (create or update)
  async saveSection(sectionData) {
    try {
      const { sectionName, subsectionName } = sectionData;

      // Try to find existing section first
      try {
        const existingResponse = await this.sections.getBySubsection(
          sectionName,
          subsectionName
        );

        if (existingResponse.success && existingResponse.data.length > 0) {
          // Section exists, update it
          const existingSection = existingResponse.data[0];
          return await this.sections.update(existingSection._id, sectionData);
        }
      } catch (error) {
        // Section doesn't exist or error fetching, proceed to create
        console.log("Section not found, creating new one");
      }

      // Section doesn't exist, create new one
      return await this.sections.create(sectionData);
    } catch (error) {
      console.error("Error saving section:", error);
      throw error;
    }
  },

  // Convenience method for getting subsections
  async getSubsection(sectionName, subsectionName) {
    try {
      return await this.sections.getBySubsection(sectionName, subsectionName);
    } catch (error) {
      console.error("Error getting subsection:", error);
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      return await apiClient.get("/health");
    } catch (error) {
      console.error("Error checking backend health:", error);
      throw error;
    }
  },

  // Upload functionality
  upload: {
    async single(file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await apiClient.post("/upload/single", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response;
      } catch (error) {
        console.error("Upload error:", error);
        throw error;
      }
    },

    async multiple(files) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      try {
        const response = await apiClient.post("/upload/multiple", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response;
      } catch (error) {
        console.error("Upload error:", error);
        throw error;
      }
    },
  },

  // File Server functionality (NGINX with CloudFlare)
  fileServer: {
    async healthCheck() {
      try {
        const response = await apiClient.get("/files/health");
        return response;
      } catch (error) {
        console.error("File server health check error:", error);
        throw error;
      }
    },

    async uploadFile(file, customFilename = null) {
      const formData = new FormData();
      formData.append("file", file);
      if (customFilename) {
        formData.append("filename", customFilename);
      }

      // Calculate timeout based on file size (minimum 60s, +30s per 10MB)
      const fileSizeMB = file.size / (1024 * 1024);
      const uploadTimeout = Math.max(
        60000,
        60000 + Math.ceil(fileSizeMB / 10) * 30000
      );

      console.log(
        `Uploading file: ${file.name}, Size: ${fileSizeMB.toFixed(
          2
        )}MB, Timeout: ${uploadTimeout}ms`
      );

      try {
        const response = await apiClient.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: uploadTimeout,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          },
        });
        return response;
      } catch (error) {
        console.error("File server upload error:", error);

        // Provide more specific error messages
        if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
          throw new Error(
            "Upload timeout - file may be too large or connection unstable"
          );
        } else if (error.response?.status === 413) {
          throw new Error("File too large for server");
        } else if (error.response?.status === 408) {
          throw new Error(
            "Upload timeout - try a smaller file or check your connection"
          );
        } else {
          throw error;
        }
      }
    },

    async uploadMultipleFiles(files, customFilenames = null) {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append("files", file);
      });

      if (customFilenames && Array.isArray(customFilenames)) {
        customFilenames.forEach((filename, index) => {
          formData.append("filenames", filename);
        });
      }

      try {
        const response = await apiClient.post(
          "/files/upload/multiple",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 120000, // 2 minute timeout for multiple uploads
          }
        );
        return response;
      } catch (error) {
        console.error("File server multiple upload error:", error);
        throw error;
      }
    },

    async deleteFile(filename) {
      try {
        const response = await apiClient.delete(
          `/files/${encodeURIComponent(filename)}`
        );
        return response;
      } catch (error) {
        console.error("File server delete error:", error);
        throw error;
      }
    },

    async getFileUrl(filename) {
      try {
        const response = await apiClient.get(
          `/files/url/${encodeURIComponent(filename)}`
        );
        return response;
      } catch (error) {
        console.error("File server URL error:", error);
        throw error;
      }
    },

    // Direct download URL (for use in <img> src, <a> href, etc.)
    getDirectDownloadUrl(filename) {
      return `${API_BASE_URL}/files/${encodeURIComponent(filename)}`;
    },

    // Helper function to construct image URLs for legacy uploads
    getImageUrl(filename) {
      // Handle both absolute URLs (legacy) and relative filenames
      if (filename.startsWith("http")) {
        // If it's already an absolute URL, check if it's localhost and replace if needed
        if (
          filename.includes("localhost") &&
          process.env.NODE_ENV === "production"
        ) {
          // Extract just the filename from the URL
          const filenameOnly = filename.split("/").pop();
          return `${API_BASE_URL}/uploads/images/${filenameOnly}`;
        }
        return filename;
      }
      // If it's just a filename, construct the full URL
      return `${API_BASE_URL}/uploads/images/${filename}`;
    },
  },

  // User profile management
  user: {
    async updateProfile(profileData) {
      try {
        return await apiClient.put("/auth/profile", profileData);
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    },

    async changePassword(passwordData) {
      try {
        return await apiClient.put("/auth/change-password", passwordData);
      } catch (error) {
        console.error("Error changing password:", error);
        throw error;
      }
    },

    async updateNotificationSettings(settings) {
      try {
        return await apiClient.put("/user/notification-settings", settings);
      } catch (error) {
        console.error("Error updating notification settings:", error);
        throw error;
      }
    },

    async updatePrivacySettings(settings) {
      try {
        return await apiClient.put("/user/privacy-settings", settings);
      } catch (error) {
        console.error("Error updating privacy settings:", error);
        throw error;
      }
    },

    async deleteAccount() {
      try {
        return await apiClient.delete("/user/account");
      } catch (error) {
        console.error("Error deleting account:", error);
        throw error;
      }
    },
  },

  // Support and help functionality
  support: {
    async submitTicket(ticketData) {
      try {
        return await apiClient.post("/support/tickets", ticketData);
      } catch (error) {
        console.error("Error submitting support ticket:", error);
        throw error;
      }
    },

    async getTickets() {
      try {
        return await apiClient.get("/support/tickets");
      } catch (error) {
        console.error("Error fetching support tickets:", error);
        throw error;
      }
    },

    async getSystemStatus() {
      try {
        return await apiClient.get("/support/system-status");
      } catch (error) {
        console.error("Error fetching system status:", error);
        throw error;
      }
    },
  },
};

// Export authAPI as an alias for easier import
export const authAPI = api.auth;

export default api;

// Utility functions for token management
export const tokenUtils = {
  getAccessToken() {
    return safeLocalStorage.getItem("accessToken");
  },

  isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Add 30 second buffer to avoid edge cases
      return Date.now() >= payload.exp * 1000 - 30000;
    } catch {
      return true;
    }
  },

  isAuthenticated() {
    const token = this.getAccessToken();
    const user = this.getUser();
    return !!(token && user && !this.isTokenExpired(token));
  },

  getUser() {
    try {
      const userData = safeLocalStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  clearAuthData() {
    safeLocalStorage.removeItem("accessToken");
    safeLocalStorage.removeItem("user");
    // Dispatch logout event for components to listen to
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
  },

  // Check if token needs refresh (expires in less than 5 minutes)
  needsRefresh(token) {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Refresh if token expires in less than 5 minutes
      return Date.now() >= payload.exp * 1000 - 5 * 60 * 1000;
    } catch {
      return false;
    }
  },
};

// Utility functions for image URL handling
export const imageUtils = {
  // Get the correct image URL regardless of storage method
  getImageUrl(imageData) {
    if (!imageData) return null;

    // If imageData is a string, it might be a filename or full URL
    if (typeof imageData === "string") {
      return api.fileServer.getImageUrl(imageData);
    }

    // If imageData is an object with url property
    if (imageData.url) {
      return api.fileServer.getImageUrl(imageData.url);
    }

    // If imageData is an object with filename property
    if (imageData.filename) {
      return api.fileServer.getImageUrl(imageData.filename);
    }

    return null;
  },

  // Extract filename from URL or return as-is if already a filename
  getFilename(urlOrFilename) {
    if (!urlOrFilename) return null;

    if (urlOrFilename.includes("/")) {
      // Extract filename from URL
      return urlOrFilename.split("/").pop();
    }

    return urlOrFilename;
  },

  // Check if an image URL is accessible
  async checkImageExists(imageUrl) {
    try {
      const response = await fetch(imageUrl, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  },
};
