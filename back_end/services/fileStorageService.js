const axios = require("axios");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const fileServerService = require("./fileServerService");

class FileStorageService {
  constructor() {
    this.fileServerBase = process.env.FILE_SERVER_BASE;
    this.localStoragePath = path.join(__dirname, "..", "storage");
    this.metadataFile = path.join(this.localStoragePath, "metadata.json");

    // Ensure storage directory exists
    this.ensureStorageDirectory();

    // Initialize metadata
    this.metadata = this.loadMetadata();
  }

  /**
   * Ensure storage directory exists
   */
  ensureStorageDirectory() {
    if (!fs.existsSync(this.localStoragePath)) {
      fs.mkdirSync(this.localStoragePath, { recursive: true });
      console.log(`Created storage directory: ${this.localStoragePath}`);
    }
  }

  /**
   * Load metadata from file
   */
  loadMetadata() {
    try {
      if (fs.existsSync(this.metadataFile)) {
        const data = fs.readFileSync(this.metadataFile, "utf8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading metadata:", error.message);
    }
    return {
      files: {},
      lastSync: null,
      totalFiles: 0,
      totalSize: 0,
    };
  }

  /**
   * Save metadata to file
   */
  saveMetadata() {
    try {
      fs.writeFileSync(
        this.metadataFile,
        JSON.stringify(this.metadata, null, 2)
      );
    } catch (error) {
      console.error("Error saving metadata:", error.message);
    }
  }

  /**
   * Get list of all files from file server
   */
  async getFileServerFileList() {
    if (!fileServerService.isConfigured()) {
      throw new Error("File server not configured");
    }

    try {
      // Try to get file list from server (if server supports listing)
      const response = await axios.get(`${this.fileServerBase}/files`, {
        timeout: 30000,
        validateStatus: (status) => status < 500, // Accept 404 as valid response
      });

      if (response.status === 200) {
        return response.data.files || [];
      }
    } catch (error) {
      console.log(
        "File listing not supported by server, using stored metadata"
      );
    }

    // If server doesn't support listing, return files from metadata
    return Object.keys(this.metadata.files);
  }

  /**
   * Download file from file server to local storage
   */
  async downloadFileToStorage(filename) {
    if (!fileServerService.isConfigured()) {
      throw new Error("File server not configured");
    }

    try {
      const url = `${this.fileServerBase}/files/${encodeURIComponent(
        filename
      )}`;
      console.log(`Downloading file from server: ${filename}`);

      const response = await axios.get(url, {
        responseType: "stream",
        timeout: 60000, // 60 second timeout
      });

      const localFilePath = path.join(this.localStoragePath, filename);
      const writer = fs.createWriteStream(localFilePath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", () => {
          const stats = fs.statSync(localFilePath);
          const fileInfo = {
            filename,
            originalName: filename,
            size: stats.size,
            mimetype:
              response.headers["content-type"] || "application/octet-stream",
            downloadedAt: new Date().toISOString(),
            localPath: localFilePath,
            hash: this.calculateFileHash(localFilePath),
            url: url,
          };

          // Update metadata
          this.metadata.files[filename] = fileInfo;
          this.metadata.totalFiles = Object.keys(this.metadata.files).length;
          this.metadata.totalSize = Object.values(this.metadata.files).reduce(
            (total, file) => total + file.size,
            0
          );
          this.saveMetadata();

          console.log(`File downloaded successfully: ${filename}`);
          resolve(fileInfo);
        });

        writer.on("error", (error) => {
          console.error(`Error downloading file ${filename}:`, error.message);
          // Clean up partial file
          if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
          }
          reject(error);
        });
      });
    } catch (error) {
      console.error("Download error:", error.message);
      if (error.response?.status === 404) {
        throw new Error("File not found on server");
      }
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  /**
   * Download multiple files from file server
   */
  async downloadMultipleFiles(filenames, options = {}) {
    const { concurrency = 3, onProgress } = options;
    const results = {
      successful: [],
      failed: [],
      total: filenames.length,
    };

    // Process files in batches to avoid overwhelming the server
    for (let i = 0; i < filenames.length; i += concurrency) {
      const batch = filenames.slice(i, i + concurrency);
      const promises = batch.map(async (filename) => {
        try {
          const result = await this.downloadFileToStorage(filename);
          results.successful.push(result);
          if (onProgress) {
            onProgress({
              completed: results.successful.length + results.failed.length,
              total: results.total,
              currentFile: filename,
              status: "success",
            });
          }
          return result;
        } catch (error) {
          const failedFile = { filename, error: error.message };
          results.failed.push(failedFile);
          if (onProgress) {
            onProgress({
              completed: results.successful.length + results.failed.length,
              total: results.total,
              currentFile: filename,
              status: "failed",
              error: error.message,
            });
          }
          return null;
        }
      });

      await Promise.all(promises);
    }

    return results;
  }

  /**
   * Sync all files from file server to local storage
   */
  async syncAllFiles(options = {}) {
    try {
      console.log("Starting file sync from file server...");

      const fileList = await this.getFileServerFileList();
      console.log(`Found ${fileList.length} files on server`);

      if (fileList.length === 0) {
        return {
          message: "No files found on server",
          successful: [],
          failed: [],
          total: 0,
        };
      }

      // Filter out files that are already downloaded and up to date
      const filesToDownload = fileList.filter((filename) => {
        return (
          !this.metadata.files[filename] ||
          !fs.existsSync(this.metadata.files[filename].localPath)
        );
      });

      console.log(`${filesToDownload.length} files need to be downloaded`);

      if (filesToDownload.length === 0) {
        return {
          message: "All files are already synchronized",
          successful: Object.values(this.metadata.files),
          failed: [],
          total: fileList.length,
        };
      }

      const results = await this.downloadMultipleFiles(
        filesToDownload,
        options
      );

      this.metadata.lastSync = new Date().toISOString();
      this.saveMetadata();

      return {
        message: `Sync completed. ${results.successful.length} files downloaded successfully, ${results.failed.length} failed`,
        ...results,
      };
    } catch (error) {
      console.error("Sync error:", error.message);
      throw new Error(`Failed to sync files: ${error.message}`);
    }
  }

  /**
   * Get file from local storage
   */
  getStoredFile(filename) {
    const fileInfo = this.metadata.files[filename];
    if (!fileInfo) {
      throw new Error("File not found in storage");
    }

    if (!fs.existsSync(fileInfo.localPath)) {
      throw new Error("File exists in metadata but not on disk");
    }

    return fileInfo;
  }

  /**
   * Get all stored files metadata
   */
  getAllStoredFiles() {
    return {
      files: Object.values(this.metadata.files),
      summary: {
        totalFiles: this.metadata.totalFiles,
        totalSize: this.metadata.totalSize,
        lastSync: this.metadata.lastSync,
      },
    };
  }

  /**
   * Delete file from local storage
   */
  deleteStoredFile(filename) {
    const fileInfo = this.metadata.files[filename];
    if (!fileInfo) {
      throw new Error("File not found in storage");
    }

    // Delete physical file
    if (fs.existsSync(fileInfo.localPath)) {
      fs.unlinkSync(fileInfo.localPath);
    }

    // Remove from metadata
    delete this.metadata.files[filename];
    this.metadata.totalFiles = Object.keys(this.metadata.files).length;
    this.metadata.totalSize = Object.values(this.metadata.files).reduce(
      (total, file) => total + file.size,
      0
    );
    this.saveMetadata();

    return true;
  }

  /**
   * Calculate file hash for integrity checking
   */
  calculateFileHash(filePath) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      return crypto.createHash("sha256").update(fileBuffer).digest("hex");
    } catch (error) {
      console.error("Error calculating file hash:", error.message);
      return null;
    }
  }

  /**
   * Verify file integrity
   */
  verifyFileIntegrity(filename) {
    const fileInfo = this.metadata.files[filename];
    if (!fileInfo) {
      return { valid: false, error: "File not found in storage" };
    }

    if (!fs.existsSync(fileInfo.localPath)) {
      return { valid: false, error: "File exists in metadata but not on disk" };
    }

    const currentHash = this.calculateFileHash(fileInfo.localPath);
    if (currentHash !== fileInfo.hash) {
      return {
        valid: false,
        error: "File hash mismatch - file may be corrupted",
      };
    }

    return { valid: true, message: "File integrity verified" };
  }

  /**
   * Get storage statistics
   */
  getStorageStats() {
    const stats = {
      totalFiles: this.metadata.totalFiles,
      totalSize: this.metadata.totalSize,
      totalSizeFormatted: this.formatFileSize(this.metadata.totalSize),
      lastSync: this.metadata.lastSync,
      storageDirectory: this.localStoragePath,
    };

    // Check disk usage
    try {
      const storageDirStats = fs.statSync(this.localStoragePath);
      stats.storageCreated = storageDirStats.birthtime;
      stats.storageModified = storageDirStats.mtime;
    } catch (error) {
      console.error("Error getting storage stats:", error.message);
    }

    return stats;
  }

  /**
   * Format file size in human readable format
   */
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Clear all stored files (cleanup)
   */
  clearStorage() {
    try {
      // Delete all files
      Object.values(this.metadata.files).forEach((fileInfo) => {
        if (fs.existsSync(fileInfo.localPath)) {
          fs.unlinkSync(fileInfo.localPath);
        }
      });

      // Reset metadata
      this.metadata = {
        files: {},
        lastSync: null,
        totalFiles: 0,
        totalSize: 0,
      };
      this.saveMetadata();

      return true;
    } catch (error) {
      console.error("Error clearing storage:", error.message);
      throw new Error(`Failed to clear storage: ${error.message}`);
    }
  }
}

module.exports = new FileStorageService();
