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
  updateSectionById
);

// Delete section by ID
router.delete("/:id", authenticateToken, deleteSectionById);

// Bulk create/update sections (useful for frontend data sync)
router.post("/bulk", authenticateToken, bulkUpdateSections);

// Apply global colors to all sections
router.post("/apply-global-colors", authenticateToken, applyGlobalColors);

// Error handling middleware for multer
router.use(handleMulterError);

module.exports = router;
