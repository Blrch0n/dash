const axios = require("axios");
const fs = require("fs");
const path = require("path");

class FileServerService {
  constructor() {
    this.fileServerBase = process.env.FILE_SERVER_BASE;
    if (!this.fileServerBase) {
      console.warn(
        "FILE_SERVER_BASE environment variable not set. File server features disabled."
      );
    }
  }

  /**
   * Check if file server is configured
   */
  isConfigured() {
    return !!this.fileServerBase;
  }

  /**
   * Download a file from the NGINX file server and stream it to the response
   * @param {string} filename - The filename to download
   * @param {Object} res - Express response object
   */
  async downloadFile(filename, res) {
    if (!this.isConfigured()) {
      throw new Error("File server not configured");
    }

    try {
      const url = `${this.fileServerBase}/files/${encodeURIComponent(
        filename
      )}`;
      console.log(`Downloading file from: ${url}`);

      const response = await axios.get(url, {
        responseType: "stream",
        timeout: 30000, // 30 second timeout
      });

      // Set appropriate headers
      if (response.headers["content-type"]) {
        res.set("Content-Type", response.headers["content-type"]);
      }
      if (response.headers["content-length"]) {
        res.set("Content-Length", response.headers["content-length"]);
      }
      if (response.headers["last-modified"]) {
        res.set("Last-Modified", response.headers["last-modified"]);
      }

      // Set cache headers for better performance
      res.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour

      // Stream the file to the client
      response.data.pipe(res);

      return true;
    } catch (error) {
      console.error("File download error:", error.message);
      if (error.response?.status === 404) {
        throw new Error("File not found");
      } else if (error.code === "ECONNREFUSED") {
        throw new Error("File server is not accessible");
      } else {
        throw new Error("Failed to download file from server");
      }
    }
  }

  /**
   * Upload a file to the NGINX file server
   * @param {Object} file - Multer file object
   * @param {string} customFilename - Optional custom filename
   */ async uploadFile(file, customFilename = null) {
    if (!this.isConfigured()) {
      throw new Error("File server not configured");
    }

    try {
      const filename = customFilename || file.originalname;
      const localPath = file.path;

      console.log(
        `Preparing to upload file: ${filename}, Size: ${file.size} bytes`
      );

      // Read the file into a buffer
      const fileBuffer = fs.readFileSync(localPath);
      console.log(
        `File read into buffer, buffer size: ${fileBuffer.length} bytes`
      );

      // Calculate timeout based on file size (minimum 60s, +30s per 10MB)
      const fileSizeMB = file.size / (1024 * 1024);
      const uploadTimeout = Math.max(
        60000,
        60000 + Math.ceil(fileSizeMB / 10) * 30000
      );
      console.log(
        `Upload timeout set to: ${uploadTimeout}ms for ${fileSizeMB.toFixed(
          2
        )}MB file`
      );

      // Upload to NGINX WebDAV endpoint
      const url = `${this.fileServerBase}/uploads/${encodeURIComponent(
        filename
      )}`;
      console.log(`Uploading file to: ${url}`);

      await axios.put(url, fileBuffer, {
        headers: {
          "Content-Type": file.mimetype || "application/octet-stream",
          "Content-Length": fileBuffer.length,
        },
        timeout: uploadTimeout,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      console.log(`File uploaded successfully: ${filename}`);

      // Clean up temporary file
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
        console.log(`Temporary file cleaned up: ${localPath}`);
      }

      return {
        filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: `${this.fileServerBase}/files/${encodeURIComponent(filename)}`,
        serverUrl: url,
      };
    } catch (error) {
      console.error("File upload error details:", {
        message: error.message,
        code: error.code,
        response: error.response?.status,
        responseData: error.response?.data,
      });

      // Clean up temporary file on error
      if (file?.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
          console.log(`Temporary file cleaned up after error: ${file.path}`);
        } catch (cleanupError) {
          console.error("Error cleaning up temp file:", cleanupError.message);
        }
      }
      if (error.response?.status === 507) {
        throw new Error("File server storage is full");
      } else if (error.response?.status === 413) {
        throw new Error(
          "File too large for NGINX server - check client_max_body_size configuration"
        );
      } else if (error.code === "ECONNREFUSED") {
        throw new Error("File server is not accessible");
      } else if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
        throw new Error(
          "Upload timeout - file may be too large or connection unstable"
        );
      } else {
        throw new Error(`Failed to upload file to server: ${error.message}`);
      }
    }
  }

  /**
   * Delete a file from the NGINX file server
   * @param {string} filename - The filename to delete
   */
  async deleteFile(filename) {
    if (!this.isConfigured()) {
      throw new Error("File server not configured");
    }

    try {
      const url = `${this.fileServerBase}/uploads/${encodeURIComponent(
        filename
      )}`;
      console.log(`Deleting file from: ${url}`);

      await axios.delete(url, {
        timeout: 30000, // 30 second timeout
      });

      return true;
    } catch (error) {
      console.error("File deletion error:", error.message);
      if (error.response?.status === 404) {
        throw new Error("File not found");
      } else if (error.code === "ECONNREFUSED") {
        throw new Error("File server is not accessible");
      } else {
        throw new Error("Failed to delete file from server");
      }
    }
  }

  /**
   * Get the public URL for a file
   * @param {string} filename - The filename
   */
  getFileUrl(filename) {
    if (!this.isConfigured()) {
      return null;
    }
    return `${this.fileServerBase}/files/${encodeURIComponent(filename)}`;
  }

  /**
   * Check if the file server is accessible
   */
  async healthCheck() {
    if (!this.isConfigured()) {
      return { status: "disabled", message: "File server not configured" };
    }

    try {
      const response = await axios.get(this.fileServerBase, {
        timeout: 5000,
        validateStatus: () => true, // Accept any status code
      });

      return {
        status: "healthy",
        message: "File server is accessible",
        statusCode: response.status,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        message: `File server is not accessible: ${error.message}`,
      };
    }
  }
}

module.exports = new FileServerService();
