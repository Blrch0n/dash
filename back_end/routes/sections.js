const express = require("express");
const router = express.Router();

// Import controllers
const {
  getAllSections,
  getSectionsByName,
  getSubsection,
  createOrUpdateSection,
  updateSectionById,
  deleteSectionById,
  bulkUpdateSections,
} = require("../controllers/sectionController");

// Import middleware
const { authenticateToken, optionalAuth } = require("../middleware/auth");

// Get all sections (public read access)
router.get("/", optionalAuth, getAllSections);

// Get sections by section name (public read access)
router.get("/:sectionName", optionalAuth, getSectionsByName);

// Get specific subsection
router.get("/:sectionName/:subsectionName", getSubsection);

// Create or update a section
router.post("/", authenticateToken, createOrUpdateSection);

// Update section by ID
router.put("/:id", authenticateToken, updateSectionById);

// Delete section by ID
router.delete("/:id", authenticateToken, deleteSectionById);

// Bulk create/update sections (useful for frontend data sync)
router.post("/bulk", authenticateToken, bulkUpdateSections);

module.exports = router;
