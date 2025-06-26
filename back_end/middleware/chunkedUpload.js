const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
const chunksDir = path.join(uploadsDir, "chunks");
const imagesDir = path.join(uploadsDir, "images");

[uploadsDir, chunksDir, imagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Chunked upload storage
const chunkStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { uploadId } = req.body;
    const uploadDir = path.join(chunksDir, uploadId);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const { chunkIndex } = req.body;
    cb(null, `chunk-${chunkIndex}`);
  },
});

// Configure multer for chunks
const uploadChunk = multer({
  storage: chunkStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per chunk
  },
});

// Helper functions
const generateUploadId = () => {
  return crypto.randomBytes(16).toString("hex");
};

const assembleChunks = async (uploadId, originalFileName, totalChunks) => {
  const uploadDir = path.join(chunksDir, uploadId);
  const finalPath = path.join(imagesDir, originalFileName);

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(finalPath);
    let chunkIndex = 0;

    const writeNextChunk = () => {
      if (chunkIndex >= totalChunks) {
        writeStream.end();
        // Clean up chunks
        fs.rmSync(uploadDir, { recursive: true, force: true });
        resolve(finalPath);
        return;
      }

      const chunkPath = path.join(uploadDir, `chunk-${chunkIndex}`);

      if (!fs.existsSync(chunkPath)) {
        reject(new Error(`Missing chunk ${chunkIndex}`));
        return;
      }

      const readStream = fs.createReadStream(chunkPath);
      readStream.pipe(writeStream, { end: false });

      readStream.on("end", () => {
        chunkIndex++;
        writeNextChunk();
      });

      readStream.on("error", reject);
    };

    writeStream.on("error", reject);
    writeNextChunk();
  });
};

const getFileUrl = (filename) => {
  const backendUrl =
    process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${backendUrl}/api/uploads/images/${filename}`;
};

module.exports = {
  uploadChunk,
  generateUploadId,
  assembleChunks,
  getFileUrl,
  chunksDir,
};
