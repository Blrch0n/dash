import axios from "axios";

// API service for connecting to MongoDB Atlas backend
const API_BASE_URL = "https://dash-zov2.onrender.com";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export const api = {
  // Get all sections
  async getAllSections() {
    try {
      return await apiClient.get("/sections");
    } catch (error) {
      console.error("Error fetching all sections:", error);
      throw error;
    }
  },

  // Get sections by name (e.g., 'header', 'about', 'contact')
  async getSectionsByName(sectionName) {
    try {
      return await apiClient.get(`/sections/${sectionName}`);
    } catch (error) {
      console.error(`Error fetching sections for ${sectionName}:`, error);
      throw error;
    }
  },

  // Get specific subsection
  async getSubsection(sectionName, subsectionName) {
    try {
      return await apiClient.get(`/sections/${sectionName}/${subsectionName}`);
    } catch (error) {
      console.error(`Error fetching ${sectionName}/${subsectionName}:`, error);
      throw error;
    }
  },

  // Create or update section
  async saveSection(sectionData) {
    try {
      return await apiClient.post("/sections", sectionData);
    } catch (error) {
      console.error("Error saving section:", error);
      throw error;
    }
  },

  // Update existing section by ID
  async updateSection(id, sectionData) {
    try {
      return await apiClient.put(`/sections/${id}`, sectionData);
    } catch (error) {
      console.error("Error updating section:", error);
      throw error;
    }
  },

  // Delete section
  async deleteSection(id) {
    try {
      return await apiClient.delete(`/sections/${id}`);
    } catch (error) {
      console.error("Error deleting section:", error);
      throw error;
    }
  },

  // Bulk update sections
  async bulkUpdateSections(sections) {
    try {
      return await apiClient.post("/sections/bulk", { sections });
    } catch (error) {
      console.error("Error bulk updating sections:", error);
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
};
