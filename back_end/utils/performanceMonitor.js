const fs = require("fs");
const path = require("path");

class PerformanceMonitor {
  constructor() {
    this.uploadStats = {
      totalUploads: 0,
      totalSize: 0,
      averageSpeed: 0,
      recentUploads: [],
    };
  }

  recordUpload(filename, fileSize, uploadTime) {
    const speed = fileSize / (uploadTime / 1000); // bytes per second

    this.uploadStats.totalUploads++;
    this.uploadStats.totalSize += fileSize;

    // Keep only last 100 uploads for average calculation
    this.uploadStats.recentUploads.push({
      filename,
      fileSize,
      uploadTime,
      speed,
      timestamp: new Date().toISOString(),
    });

    if (this.uploadStats.recentUploads.length > 100) {
      this.uploadStats.recentUploads.shift();
    }

    // Calculate average speed from recent uploads
    const totalSpeed = this.uploadStats.recentUploads.reduce(
      (sum, upload) => sum + upload.speed,
      0
    );
    this.uploadStats.averageSpeed =
      totalSpeed / this.uploadStats.recentUploads.length;

    console.log(`📊 Upload Performance: ${filename}`);
    console.log(`   Size: ${this.formatFileSize(fileSize)}`);
    console.log(`   Time: ${uploadTime}ms`);
    console.log(`   Speed: ${this.formatSpeed(speed)}`);
    console.log(
      `   Avg Speed: ${this.formatSpeed(this.uploadStats.averageSpeed)}`
    );
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  formatSpeed(bytesPerSecond) {
    return this.formatFileSize(bytesPerSecond) + "/s";
  }

  getStats() {
    return {
      ...this.uploadStats,
      averageSpeedFormatted: this.formatSpeed(this.uploadStats.averageSpeed),
      totalSizeFormatted: this.formatFileSize(this.uploadStats.totalSize),
    };
  }

  getOptimizationSuggestions() {
    const suggestions = [];

    if (this.uploadStats.averageSpeed < 1024 * 1024) {
      // < 1MB/s
      suggestions.push("Consider enabling file compression");
      suggestions.push("Check network bandwidth");
      suggestions.push("Consider using chunked uploads for large files");
    }

    if (this.uploadStats.recentUploads.length > 10) {
      const slowUploads = this.uploadStats.recentUploads.filter(
        (upload) => upload.speed < 512 * 1024
      ); // < 512KB/s
      if (slowUploads.length > this.uploadStats.recentUploads.length * 0.3) {
        suggestions.push(
          "Frequent slow uploads detected - check server resources"
        );
      }
    }

    return suggestions;
  }
}

module.exports = new PerformanceMonitor();
