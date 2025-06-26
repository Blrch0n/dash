const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth/tokenAuth");
const {
  getStoredFiles,
  getStoredFile,
  downloadStoredFile,
  downloadFileToStorage,
  downloadMultipleFiles,
  syncAllFiles,
  getFileServerFileList,
  deleteStoredFile,
  verifyFileIntegrity,
  getStorageStats,
  clearStorage,
  searchStoredFiles,
  getMigrationStatus,
  migrateUploadedFiles,
  getUploadedFiles,
  downloadUploadedFile,
  getUploadedFileUrl,
  deleteUploadedFile,
} = require("../controllers/storageController");

// ────────────────────────────────────────────────────────────────────────────────
// File Storage Management Routes
// ────────────────────────────────────────────────────────────────────────────────

/**
 * @route GET /api/storage/stats
 * @desc Get storage statistics
 * @access Public
 */
router.get("/stats", getStorageStats);

/**
 * @route GET /api/storage/files
 * @desc Get all stored files
 * @access Public
 */
router.get("/files", getStoredFiles);

/**
 * @route GET /api/storage/search
 * @desc Search stored files
 * @access Public
 */
router.get("/search", searchStoredFiles);

/**
 * @route GET /api/storage/server/files
 * @desc Get file list from file server
 * @access Public
 */
router.get("/server/files", getFileServerFileList);

/**
 * @route GET /api/storage/files/:filename
 * @desc Get specific stored file metadata
 * @access Public
 */
router.get("/files/:filename", getStoredFile);

/**
 * @route GET /api/storage/files/:filename/download
 * @desc Download stored file
 * @access Public
 */
router.get("/files/:filename/download", downloadStoredFile);

/**
 * @route GET /api/storage/files/:filename/verify
 * @desc Verify file integrity
 * @access Public
 */
router.get("/files/:filename/verify", verifyFileIntegrity);

/**
 * @route POST /api/storage/download
 * @desc Download single file from file server to storage
 * @access Public
 */
router.post("/download", downloadFileToStorage);

/**
 * @route POST /api/storage/download/batch
 * @desc Download multiple files from file server to storage
 * @access Public
 */
router.post("/download/batch", downloadMultipleFiles);

/**
 * @route POST /api/storage/sync
 * @desc Sync all files from file server
 * @access Public
 */
router.post("/sync", syncAllFiles);

/**
 * @route DELETE /api/storage/files/:filename
 * @desc Delete file from storage
 * @access Public
 */
router.delete("/files/:filename", deleteStoredFile);

// ────────────────────────────────────────────────────────────────────────────────
// Direct File Server Access Routes (for uploaded files)
// ────────────────────────────────────────────────────────────────────────────────

/**
 * @route GET /api/storage/uploaded/files
 * @desc Get list of uploaded files directly from file server
 * @access Public
 */
router.get("/uploaded/files", getUploadedFiles);

/**
 * @route GET /api/storage/uploaded/files/:filename/download
 * @desc Download file directly from file server uploads directory
 * @access Public
 */
router.get("/uploaded/files/:filename/download", downloadUploadedFile);

/**
 * @route GET /api/storage/uploaded/files/:filename/url
 * @desc Get direct URL for uploaded file on file server
 * @access Public
 */
router.get("/uploaded/files/:filename/url", getUploadedFileUrl);

/**
 * @route DELETE /api/storage/uploaded/files/:filename
 * @desc Delete file from NGINX server uploads directory
 * @access Public
 */
router.delete("/uploaded/files/:filename", deleteUploadedFile);

// ────────────────────────────────────────────────────────────────────────────────
// Migration Routes
// ────────────────────────────────────────────────────────────────────────────────

/**
 * @route GET /api/storage/migration/status
 * @desc Get migration status of uploaded files
 * @access Public
 */
router.get("/migration/status", getMigrationStatus);

/**
 * @route POST /api/storage/migration/migrate
 * @desc Migrate uploaded files to storage
 * @access Public
 */
router.post("/migration/migrate", migrateUploadedFiles);

/**
 * @route DELETE /api/storage/clear
 * @desc Clear all storage
 * @access Public
 */
router.delete("/clear", clearStorage);

module.exports = router;
