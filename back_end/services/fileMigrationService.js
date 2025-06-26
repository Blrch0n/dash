const fs = require("fs");
const path = require("path");
const fileStorageService = require("../services/fileStorageService");

/**
 * Utility to migrate existing uploaded files to storage system
 */
class FileMigrationService {
  constructor() {
    this.uploadsPath = path.join(__dirname, "..", "uploads");
    this.storagePath = path.join(__dirname, "..", "storage");
  }

  /**
   * Get all files from uploads directory
   */
  getUploadedFiles() {
    const files = [];

    const scanDirectory = (dirPath, relativePath = "") => {
      if (!fs.existsSync(dirPath)) return;

      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          scanDirectory(fullPath, path.join(relativePath, item));
        } else {
          const relativeFilePath = path.join(relativePath, item);
          files.push({
            filename: item,
            relativePath: relativeFilePath,
            fullPath: fullPath,
            size: stats.size,
            modifiedAt: stats.mtime,
            createdAt: stats.birthtime,
          });
        }
      }
    };

    scanDirectory(this.uploadsPath);
    return files;
  }

  /**
   * Migrate uploaded files to storage system
   */
  async migrateUploadedFiles() {
    try {
      const uploadedFiles = this.getUploadedFiles();
      console.log(`Found ${uploadedFiles.length} uploaded files to migrate`);

      const results = {
        successful: [],
        failed: [],
        total: uploadedFiles.length,
      };

      for (const file of uploadedFiles) {
        try {
          // Copy file to storage directory
          const storageFilePath = path.join(this.storagePath, file.filename);

          // Ensure storage directory exists
          if (!fs.existsSync(this.storagePath)) {
            fs.mkdirSync(this.storagePath, { recursive: true });
          }

          // Copy file
          fs.copyFileSync(file.fullPath, storageFilePath);

          // Determine mimetype
          const mimetype = this.getMimeType(file.filename);

          // Create file info object
          const fileInfo = {
            filename: file.filename,
            originalName: file.filename,
            size: file.size,
            mimetype: mimetype,
            downloadedAt: new Date().toISOString(),
            localPath: storageFilePath,
            hash: fileStorageService.calculateFileHash(storageFilePath),
            url: `migrated-from-uploads`, // Special marker for migrated files
            migratedFrom: file.relativePath,
            originalCreatedAt: file.createdAt.toISOString(),
            originalModifiedAt: file.modifiedAt.toISOString(),
          };
          // Add to storage metadata manually
          const storageService = require("./fileStorageService");
          storageService.metadata.files[file.filename] = fileInfo;
          storageService.metadata.totalFiles = Object.keys(
            storageService.metadata.files
          ).length;
          storageService.metadata.totalSize = Object.values(
            storageService.metadata.files
          ).reduce((total, file) => total + file.size, 0);
          storageService.saveMetadata();

          results.successful.push(fileInfo);
          console.log(`✓ Migrated: ${file.filename}`);
        } catch (error) {
          console.error(`✗ Failed to migrate ${file.filename}:`, error.message);
          results.failed.push({
            filename: file.filename,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error("Migration error:", error.message);
      throw new Error(`Failed to migrate files: ${error.message}`);
    }
  }

  /**
   * Get mime type from file extension
   */
  getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".mp4": "video/mp4",
      ".avi": "video/x-msvideo",
      ".mov": "video/quicktime",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".txt": "text/plain",
      ".csv": "text/csv",
      ".json": "application/json",
      ".zip": "application/zip",
      ".rar": "application/x-rar-compressed",
    };

    return mimeTypes[ext] || "application/octet-stream";
  }

  /**
   * Get migration status
   */
  getMigrationStatus() {
    const uploadedFiles = this.getUploadedFiles();
    const storageFiles = fileStorageService.getAllStoredFiles();

    const migratedFiles = storageFiles.files.filter(
      (file) => file.url === "migrated-from-uploads"
    );

    return {
      totalUploaded: uploadedFiles.length,
      totalMigrated: migratedFiles.length,
      remaining: uploadedFiles.length - migratedFiles.length,
      uploadedFiles: uploadedFiles.map((f) => ({
        filename: f.filename,
        size: f.size,
        path: f.relativePath,
      })),
      migratedFiles: migratedFiles.map((f) => ({
        filename: f.filename,
        size: f.size,
        migratedFrom: f.migratedFrom,
      })),
    };
  }
}

module.exports = new FileMigrationService();
