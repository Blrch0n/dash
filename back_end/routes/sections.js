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
  applyGlobalColors,
} = require("../controllers/sectionController");

// Import middleware
const { authenticateToken, optionalAuth } = require("../middleware/auth");
const { upload, handleMulterError } = require("../middleware/upload");
const { processImages } = require("../middleware/imageProcessor");
const {
  validateSectionData,
  validateColorsObject,
} = require("../middleware/sectionValidation");

// Get all sections (public read access)
router.get("/", optionalAuth, getAllSections);

// Get sections by section name (public read access)
router.get("/:sectionName", optionalAuth, getSectionsByName);

// Get specific subsection
router.get("/:sectionName/:subsectionName", getSubsection);

// Create or update a section with file upload support
router.post(
  "/",
  authenticateToken,
  (req, res, next) => {
    // Check if this is a multipart request (file upload)
    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      // Use multer for file uploads
      upload.array("images", 10)(req, res, (err) => {
        if (err) return handleMulterError(err, req, res, next);
        processImages(req, res, next);
      });
    } else {
      // For JSON requests, just process images without multer
      processImages(req, res, next);
    }
  },
  validateSectionData,
  validateColorsObject,
  createOrUpdateSection
);

// Update section by ID with file upload support
router.put(
  "/:id",
  authenticateToken,
  (req, res, next) => {
    // Check if this is a multipart request (file upload)
    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      // Use multer for file uploads
      upload.array("images", 10)(req, res, (err) => {
        if (err) return handleMulterError(err, req, res, next);
        processImages(req, res, next);
      });
    } else {
      // For JSON requests, just process images without multer
      processImages(req, res, next);
    }
  },
  validateSectionData,
  validateColorsObject,
  updateSectionById
);

// Delete section by ID
router.delete("/:id", authenticateToken, deleteSectionById);

// Bulk create/update sections (useful for frontend data sync)
router.post(
  "/bulk",
  authenticateToken,
  validateSectionData,
  validateColorsObject,
  bulkUpdateSections
);

// Apply global colors to all sections
router.post("/apply-global-colors", authenticateToken, applyGlobalColors);

// Clean up duplicate color properties in existing sections
router.post("/cleanup-colors", authenticateToken, async (req, res) => {
  try {
    const {
      cleanupDuplicateColorProperties,
    } = require("../utils/cleanupDuplicateColors");
    const updatedCount = await cleanupDuplicateColorProperties();

    res.json({
      success: true,
      message: `Cleaned up duplicate color properties in ${updatedCount} sections`,
      updatedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cleaning up duplicate colors",
      error: error.message,
    });
  }
});

// Error handling middleware for multer
router.use(handleMulterError);

module.exports = router;
