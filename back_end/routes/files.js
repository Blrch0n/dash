const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileServerService = require("../services/fileServerService");
const { authenticateToken } = require("../middleware/auth/tokenAuth");

// Configure multer for temporary file storage
const upload = multer({
  dest: "tmp/",
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos/audio
    files: 10, // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types but log them
    console.log(
      `Uploading file: ${file.originalname}, Type: ${file.mimetype}, Size: ${
        file.size || "unknown"
      }`
    );
    cb(null, true);
  },
});

// ────────────────────────────────────────────────────────────────────────────────
// File Server Routes
// ────────────────────────────────────────────────────────────────────────────────

/**
 * @route GET /api/files/health
 * @desc Check file server health
 * @access Public
 */
router.get("/health", async (req, res) => {
  try {
    const health = await fileServerService.healthCheck();
    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: error.message,
    });
  }
});

/**
 * @route GET /api/files/:filename
 * @desc Proxy download route - streams file from NGINX server to client
 * @access Public
 */
router.get("/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      });
    }

    await fileServerService.downloadFile(filename, res);
  } catch (error) {
    console.error("Download error:", error.message);

    if (error.message === "File not found") {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    } else if (error.message === "File server not configured") {
      return res.status(503).json({
        success: false,
        message: "File server service is not available",
      });
    } else {
      return res.status(502).json({
        success: false,
        message: "Failed to fetch file",
      });
    }
  }
});

/**
 * @route POST /api/files/upload
 * @desc Proxy upload route - uploads file from client to NGINX server
 * @access Private (requires authentication)
 */
router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("Upload request received");

      if (!req.file) {
        console.log("No file in request");
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      console.log("File details:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      });

      // Optional custom filename from request body
      const customFilename = req.body.filename;

      console.log("Starting file server upload...");
      const result = await fileServerService.uploadFile(
        req.file,
        customFilename
      );
      console.log("File server upload successful:", result.filename);

      res.json({
        success: true,
        message: "File uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error("Upload error details:", {
        message: error.message,
        stack: error.stack,
        file: req.file
          ? {
              originalname: req.file.originalname,
              size: req.file.size,
              mimetype: req.file.mimetype,
            }
          : "No file",
      });

      if (error.message === "File server not configured") {
        return res.status(503).json({
          success: false,
          message: "File server service is not available",
        });
      } else if (error.message === "File server storage is full") {
        return res.status(507).json({
          success: false,
          message: "Server storage is full",
        });
      } else if (error.message.includes("timeout")) {
        return res.status(408).json({
          success: false,
          message: "Upload timeout - file may be too large",
        });
      } else if (
        error.message.includes("413") ||
        error.message.includes("too large for NGINX")
      ) {
        return res.status(413).json({
          success: false,
          message:
            "File too large for server - NGINX client_max_body_size limit exceeded",
        });
      } else {
        return res.status(502).json({
          success: false,
          message: "Failed to upload file",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    }
  }
);

/**
 * @route POST /api/files/upload/multiple
 * @desc Upload multiple files to NGINX server
 * @access Private (requires authentication)
 */
router.post(
  "/upload/multiple",
  authenticateToken,
  upload.array("files", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const uploadPromises = req.files.map((file, index) => {
        // Use custom filenames if provided
        const customFilename = req.body.filenames
          ? req.body.filenames[index]
          : null;
        return fileServerService.uploadFile(file, customFilename);
      });

      const results = await Promise.all(uploadPromises);

      res.json({
        success: true,
        message: `${results.length} file(s) uploaded successfully`,
        data: results,
      });
    } catch (error) {
      console.error("Multiple upload error:", error.message);

      if (error.message === "File server not configured") {
        return res.status(503).json({
          success: false,
          message: "File server service is not available",
        });
      } else {
        return res.status(502).json({
          success: false,
          message: "Failed to upload files",
        });
      }
    }
  }
);

/**
 * @route DELETE /api/files/:filename
 * @desc Delete file from NGINX server
 * @access Private (requires authentication)
 */
router.delete("/:filename", authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      });
    }

    await fileServerService.deleteFile(filename);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error.message);

    if (error.message === "File not found") {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    } else if (error.message === "File server not configured") {
      return res.status(503).json({
        success: false,
        message: "File server service is not available",
      });
    } else {
      return res.status(502).json({
        success: false,
        message: "Failed to delete file",
      });
    }
  }
});

/**
 * @route GET /api/files/url/:filename
 * @desc Get public URL for a file
 * @access Public
 */
router.get("/url/:filename", (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      });
    }

    const url = fileServerService.getFileUrl(filename);

    if (!url) {
      return res.status(503).json({
        success: false,
        message: "File server service is not available",
      });
    }

    res.json({
      success: true,
      data: {
        filename,
        url,
      },
    });
  } catch (error) {
    console.error("Get URL error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate file URL",
    });
  }
});

// Handle multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 50MB.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum is 10 files.",
      });
    }
  }
  next(err);
});

module.exports = router;
