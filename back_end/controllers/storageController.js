const fileStorageService = require("../services/fileStorageService");
const fileMigrationService = require("../services/fileMigrationService");
const fileServerService = require("../services/fileServerService");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc Get all stored files
 * @route GET /api/storage/files
 * @access Private
 */
const getStoredFiles = asyncHandler(async (req, res) => {
  const data = fileStorageService.getAllStoredFiles();

  res.json({
    success: true,
    message: "Stored files retrieved successfully",
    data,
  });
});

/**
 * @desc Get specific stored file
 * @route GET /api/storage/files/:filename
 * @access Private
 */
const getStoredFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  const fileInfo = fileStorageService.getStoredFile(filename);

  res.json({
    success: true,
    message: "File retrieved successfully",
    data: fileInfo,
  });
});

/**
 * @desc Download and serve stored file
 * @route GET /api/storage/files/:filename/download
 * @access Private
 */
const downloadStoredFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  const fileInfo = fileStorageService.getStoredFile(filename);

  // Set appropriate headers
  res.setHeader("Content-Type", fileInfo.mimetype);
  res.setHeader("Content-Length", fileInfo.size);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileInfo.originalName}"`
  );

  // Stream the file
  const fs = require("fs");
  const fileStream = fs.createReadStream(fileInfo.localPath);
  fileStream.pipe(res);
});

/**
 * @desc Download file from file server to storage
 * @route POST /api/storage/download
 * @access Private
 */
const downloadFileToStorage = asyncHandler(async (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({
      success: false,
      message: "Filename is required",
    });
  }

  const result = await fileStorageService.downloadFileToStorage(filename);

  res.json({
    success: true,
    message: "File downloaded to storage successfully",
    data: result,
  });
});

/**
 * @desc Download multiple files from file server to storage
 * @route POST /api/storage/download/batch
 * @access Private
 */
const downloadMultipleFiles = asyncHandler(async (req, res) => {
  const { filenames, concurrency = 3 } = req.body;

  if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Filenames array is required",
    });
  }

  const results = await fileStorageService.downloadMultipleFiles(filenames, {
    concurrency,
  });

  res.json({
    success: true,
    message: `Batch download completed. ${results.successful.length} successful, ${results.failed.length} failed`,
    data: results,
  });
});

/**
 * @desc Sync all files from file server
 * @route POST /api/storage/sync
 * @access Private
 */
const syncAllFiles = asyncHandler(async (req, res) => {
  const { concurrency = 3 } = req.body;

  const results = await fileStorageService.syncAllFiles({
    concurrency,
  });

  res.json({
    success: true,
    message: results.message,
    data: results,
  });
});

/**
 * @desc Get file server file list
 * @route GET /api/storage/server/files
 * @access Private
 */
const getFileServerFileList = asyncHandler(async (req, res) => {
  const fileList = await fileStorageService.getFileServerFileList();

  res.json({
    success: true,
    message: "File server file list retrieved successfully",
    data: {
      files: fileList,
      count: fileList.length,
    },
  });
});

/**
 * @desc Delete file from storage
 * @route DELETE /api/storage/files/:filename
 * @access Private
 */
const deleteStoredFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  const result = fileStorageService.deleteStoredFile(filename);

  res.json({
    success: true,
    message: "File deleted from storage successfully",
    data: { deleted: result },
  });
});

/**
 * @desc Verify file integrity
 * @route GET /api/storage/files/:filename/verify
 * @access Private
 */
const verifyFileIntegrity = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  const result = fileStorageService.verifyFileIntegrity(filename);

  res.json({
    success: result.valid,
    message: result.valid ? result.message : result.error,
    data: result,
  });
});

/**
 * @desc Get storage statistics
 * @route GET /api/storage/stats
 * @access Private
 */
const getStorageStats = asyncHandler(async (req, res) => {
  const stats = fileStorageService.getStorageStats();

  res.json({
    success: true,
    message: "Storage statistics retrieved successfully",
    data: stats,
  });
});

/**
 * @desc Clear all storage
 * @route DELETE /api/storage/clear
 * @access Private
 */
const clearStorage = asyncHandler(async (req, res) => {
  const result = fileStorageService.clearStorage();

  res.json({
    success: true,
    message: "Storage cleared successfully",
    data: { cleared: result },
  });
});

/**
 * @desc Search stored files
 * @route GET /api/storage/search
 * @access Private
 */
const searchStoredFiles = asyncHandler(async (req, res) => {
  const { query, type, size_min, size_max } = req.query;

  const allFiles = fileStorageService.getAllStoredFiles();
  let filteredFiles = allFiles.files;

  // Filter by filename/query
  if (query) {
    filteredFiles = filteredFiles.filter(
      (file) =>
        file.filename.toLowerCase().includes(query.toLowerCase()) ||
        file.originalName.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Filter by file type
  if (type) {
    filteredFiles = filteredFiles.filter((file) =>
      file.mimetype.toLowerCase().includes(type.toLowerCase())
    );
  }

  // Filter by file size
  if (size_min) {
    const minBytes = parseInt(size_min);
    filteredFiles = filteredFiles.filter((file) => file.size >= minBytes);
  }

  if (size_max) {
    const maxBytes = parseInt(size_max);
    filteredFiles = filteredFiles.filter((file) => file.size <= maxBytes);
  }

  res.json({
    success: true,
    message: `Found ${filteredFiles.length} files matching criteria`,
    data: {
      files: filteredFiles,
      count: filteredFiles.length,
      total: allFiles.files.length,
      summary: allFiles.summary,
    },
  });
});

/**
 * @desc Get migration status
 * @route GET /api/storage/migration/status
 * @access Private
 */
const getMigrationStatus = asyncHandler(async (req, res) => {
  const status = fileMigrationService.getMigrationStatus();

  res.json({
    success: true,
    message: "Migration status retrieved successfully",
    data: status,
  });
});

/**
 * @desc Migrate uploaded files to storage
 * @route POST /api/storage/migration/migrate
 * @access Private
 */
const migrateUploadedFiles = asyncHandler(async (req, res) => {
  const results = await fileMigrationService.migrateUploadedFiles();

  res.json({
    success: true,
    message: `Migration completed. ${results.successful.length} files migrated successfully, ${results.failed.length} failed`,
    data: results,
  });
});

/**
 * @desc Get uploaded files list from file server
 * @route GET /api/storage/uploaded/files
 * @access Private
 */
const getUploadedFiles = asyncHandler(async (req, res) => {
  const files = await fileServerService.listUploadedFiles();

  res.json({
    success: true,
    message: "Uploaded files list retrieved successfully",
    data: {
      files,
      count: files.length,
      serverUrl: process.env.FILE_SERVER_BASE,
    },
  });
});

/**
 * @desc Download file directly from uploads directory
 * @route GET /api/storage/uploaded/files/:filename/download
 * @access Private
 */
const downloadUploadedFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  await fileServerService.downloadUploadedFile(filename, res);
});

/**
 * @desc Get direct URL for uploaded file
 * @route GET /api/storage/uploaded/files/:filename/url
 * @access Private
 */
const getUploadedFileUrl = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  if (!fileServerService.isConfigured()) {
    return res.status(503).json({
      success: false,
      message: "File server not configured",
    });
  }

  const url = `${process.env.FILE_SERVER_BASE}/uploads/${encodeURIComponent(
    filename
  )}`;

  res.json({
    success: true,
    message: "File URL generated successfully",
    data: {
      filename,
      url,
      directAccess: true,
    },
  });
});

/**
 * @desc Delete file from NGINX server uploads directory
 * @route DELETE /api/storage/uploaded/files/:filename
 * @access Public
 */
const deleteUploadedFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(400).json({
      success: false,
      message: "Filename is required",
    });
  }

  try {
    await fileServerService.deleteFile(filename);

    res.json({
      success: true,
      message: `File "${filename}" deleted successfully from server`,
      data: {
        filename,
        deleted: true,
      },
    });
  } catch (error) {
    console.error("Error deleting file from server:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete file from server",
      data: {
        filename,
        deleted: false,
      },
    });
  }
});

module.exports = {
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
};
