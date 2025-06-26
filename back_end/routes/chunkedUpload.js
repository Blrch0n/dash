const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const {
  uploadChunk,
  generateUploadId,
  assembleChunks,
  getFileUrl,
} = require("../middleware/chunkedUpload");

// Initialize chunked upload
router.post("/chunk/init", (req, res) => {
  try {
    const { fileName, fileSize, totalChunks } = req.body;

    if (!fileName || !fileSize || !totalChunks) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: fileName, fileSize, totalChunks",
      });
    }

    const uploadId = generateUploadId();
    const timestamp = Date.now();
    const sanitizedFileName = `${timestamp}-${Math.round(
      Math.random() * 1e9
    )}-${fileName}`;

    res.json({
      success: true,
      message: "Upload initialized",
      data: {
        uploadId,
        fileName: sanitizedFileName,
        originalFileName: fileName,
        chunkSize: 5 * 1024 * 1024, // 5MB
        totalChunks: parseInt(totalChunks),
      },
    });
  } catch (error) {
    console.error("Init chunk upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initialize upload",
      error: error.message,
    });
  }
});

// Upload individual chunk
router.post("/chunk/upload", uploadChunk.single("chunk"), (req, res) => {
  try {
    const { uploadId, chunkIndex, totalChunks, fileName } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No chunk uploaded",
      });
    }

    res.json({
      success: true,
      message: `Chunk ${chunkIndex} uploaded successfully`,
      data: {
        uploadId,
        chunkIndex: parseInt(chunkIndex),
        totalChunks: parseInt(totalChunks),
        chunkSize: req.file.size,
        fileName,
      },
    });
  } catch (error) {
    console.error("Chunk upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload chunk",
      error: error.message,
    });
  }
});

// Complete chunked upload
router.post("/chunk/complete", async (req, res) => {
  try {
    const { uploadId, fileName, totalChunks, originalFileName } = req.body;

    if (!uploadId || !fileName || !totalChunks) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    // Assemble all chunks into final file
    const finalPath = await assembleChunks(
      uploadId,
      fileName,
      parseInt(totalChunks)
    );
    const stats = fs.statSync(finalPath);

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filename: fileName,
        originalName: originalFileName,
        size: stats.size,
        url: getFileUrl(fileName),
        path: finalPath,
        uploadId,
      },
    });
  } catch (error) {
    console.error("Complete upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete upload",
      error: error.message,
    });
  }
});

// Check upload status
router.get("/chunk/status/:uploadId", (req, res) => {
  try {
    const { uploadId } = req.params;
    const uploadDir = path.join(__dirname, "../uploads/chunks", uploadId);

    if (!fs.existsSync(uploadDir)) {
      return res.status(404).json({
        success: false,
        message: "Upload not found",
      });
    }

    const chunks = fs
      .readdirSync(uploadDir)
      .filter((file) => file.startsWith("chunk-"));
    const uploadedChunks = chunks
      .map((chunk) => parseInt(chunk.split("-")[1]))
      .sort((a, b) => a - b);

    res.json({
      success: true,
      message: "Upload status retrieved",
      data: {
        uploadId,
        uploadedChunks,
        totalUploaded: uploadedChunks.length,
      },
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check status",
      error: error.message,
    });
  }
});

module.exports = router;
