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
   */ async downloadFile(filename, res) {
    if (!this.isConfigured()) {
      // If file server is not configured, try local file serving
      return await this.serveLocalFile(filename, res);
    }

    try {
      const url = `${this.fileServerBase}/uploads/${encodeURIComponent(
        filename
      )}`;
      console.log(`Downloading file from: ${url}`);

      // Prepare headers for range requests (important for video streaming)
      const headers = {};
      if (res.req && res.req.headers.range) {
        headers["Range"] = res.req.headers.range;
      }

      const response = await axios.get(url, {
        responseType: "stream",
        timeout: 0, // No timeout for video streaming
        headers,
        validateStatus: (status) =>
          status < 300 || status === 206 || status === 416,
      });

      // Set appropriate headers for video streaming
      if (response.headers["content-type"]) {
        res.set("Content-Type", response.headers["content-type"]);
      }
      if (response.headers["content-length"]) {
        res.set("Content-Length", response.headers["content-length"]);
      }
      if (response.headers["content-range"]) {
        res.set("Content-Range", response.headers["content-range"]);
        res.status(206); // Partial Content
      }
      if (response.headers["accept-ranges"]) {
        res.set("Accept-Ranges", response.headers["accept-ranges"]);
      } else {
        res.set("Accept-Ranges", "bytes");
      }
      if (response.headers["last-modified"]) {
        res.set("Last-Modified", response.headers["last-modified"]);
      }

      // Set cache headers for better performance
      res.set("Cache-Control", "public, max-age=3600");

      // Stream the file to the client
      response.data.pipe(res);

      return true;
    } catch (error) {
      console.error("File download error:", error.message);
      console.log("Attempting to serve file from local storage...");

      // Try to serve from local uploads folder as fallback
      try {
        return await this.serveLocalFile(filename, res);
      } catch (localError) {
        console.error("Local file serving also failed:", localError.message);

        if (
          error.response?.status === 404 ||
          localError.message === "File not found"
        ) {
          throw new Error("File not found");
        } else if (error.response?.status === 416) {
          // Range Not Satisfiable
          res.status(416).send("Range Not Satisfiable");
          return;
        } else if (error.code === "ECONNREFUSED") {
          throw new Error(
            "File server is not accessible and local file not found"
          );
        } else {
          throw new Error(
            "Failed to download file from server and local fallback failed"
          );
        }
      }
    }
  }

  /**
   * Sanitize filename to handle Unicode characters properly
   * @param {string} filename - Original filename
   * @returns {string} - Sanitized filename
   */
  sanitizeFilename(filename) {
    // Extract file extension
    const lastDotIndex = filename.lastIndexOf(".");
    const ext = lastDotIndex > -1 ? filename.substring(lastDotIndex) : "";
    const nameWithoutExt =
      lastDotIndex > -1 ? filename.substring(0, lastDotIndex) : filename;

    // First, try to transliterate common characters to ASCII
    let transliterated = nameWithoutExt
      // Mongolian to Latin transliteration (common mappings)
      .replace(/ү/g, "u")
      .replace(/Ү/g, "U")
      .replace(/ө/g, "o")
      .replace(/Ө/g, "O")
      .replace(/ё/g, "yo")
      .replace(/Ё/g, "Yo")
      // Cyrillic to Latin
      .replace(/а/g, "a")
      .replace(/А/g, "A")
      .replace(/б/g, "b")
      .replace(/Б/g, "B")
      .replace(/в/g, "v")
      .replace(/В/g, "V")
      .replace(/г/g, "g")
      .replace(/Г/g, "G")
      .replace(/д/g, "d")
      .replace(/Д/g, "D")
      .replace(/е/g, "e")
      .replace(/Е/g, "E")
      .replace(/ж/g, "zh")
      .replace(/Ж/g, "Zh")
      .replace(/з/g, "z")
      .replace(/З/g, "Z")
      .replace(/и/g, "i")
      .replace(/И/g, "I")
      .replace(/й/g, "y")
      .replace(/Й/g, "Y")
      .replace(/к/g, "k")
      .replace(/К/g, "K")
      .replace(/л/g, "l")
      .replace(/Л/g, "L")
      .replace(/м/g, "m")
      .replace(/М/g, "M")
      .replace(/н/g, "n")
      .replace(/Н/g, "N")
      .replace(/о/g, "o")
      .replace(/О/g, "O")
      .replace(/п/g, "p")
      .replace(/П/g, "P")
      .replace(/р/g, "r")
      .replace(/Р/g, "R")
      .replace(/с/g, "s")
      .replace(/С/g, "S")
      .replace(/т/g, "t")
      .replace(/Т/g, "T")
      .replace(/у/g, "u")
      .replace(/У/g, "U")
      .replace(/ф/g, "f")
      .replace(/Ф/g, "F")
      .replace(/х/g, "h")
      .replace(/Х/g, "H")
      .replace(/ц/g, "ts")
      .replace(/Ц/g, "Ts")
      .replace(/ч/g, "ch")
      .replace(/Ч/g, "Ch")
      .replace(/ш/g, "sh")
      .replace(/Ш/g, "Sh")
      .replace(/щ/g, "shch")
      .replace(/Щ/g, "Shch")
      .replace(/ъ/g, "")
      .replace(/Ъ/g, "")
      .replace(/ы/g, "y")
      .replace(/Ы/g, "Y")
      .replace(/ь/g, "")
      .replace(/Ь/g, "")
      .replace(/э/g, "e")
      .replace(/Э/g, "E")
      .replace(/ю/g, "yu")
      .replace(/Ю/g, "Yu")
      .replace(/я/g, "ya")
      .replace(/Я/g, "Ya");

    // Clean up the filename
    const sanitized = transliterated
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_") // Replace filesystem-unsafe characters
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/_{2,}/g, "_") // Replace multiple underscores with single
      .replace(/^_+|_+$/g, "") // Remove leading/trailing underscores
      .trim();

    // If the sanitized name is too short or empty, use timestamp
    if (sanitized.length < 3) {
      return `file_${Date.now()}${ext}`;
    }

    // Limit length to avoid filesystem issues
    const maxLength = 200;
    const finalName =
      sanitized.length > maxLength
        ? sanitized.substring(0, maxLength)
        : sanitized;

    return `${finalName}${ext}`;
  }

  /**
   * Upload a file to the NGINX file server
   * @param {Object} file - Multer file object
   * @param {string} customFilename - Optional custom filename
   */ async uploadFile(file, customFilename = null) {
    // Force log to check if new code is loaded
    console.log("UNICODE FIX LOADED:", new Date().toISOString());
    
    if (!this.isConfigured()) {
      throw new Error("File server not configured");
    }

    try {
      const originalFilename = customFilename || file.originalname;
      const filename = this.sanitizeFilename(originalFilename);
      const localPath = file.path;

      console.log(
        `🔧 UNICODE FIX - Original: ${originalFilename} -> Sanitized: ${filename}, Size: ${file.size} bytes`
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

  /**
   * List files from the NGINX file server uploads directory
   * This requires NGINX to have autoindex on for the uploads location
   */
  async listUploadedFiles() {
    if (!this.isConfigured()) {
      throw new Error("File server not configured");
    }

    try {
      // Try to get directory listing from uploads folder
      const url = `${this.fileServerBase}/uploads/`;
      console.log(`Getting file list from: ${url}`);

      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      // Parse NGINX autoindex HTML response
      const html = response.data;
      const files = this.parseNginxAutoindex(html);

      return files;
    } catch (error) {
      console.error("File listing error:", error.message);
      if (error.response?.status === 403) {
        throw new Error(
          "Directory listing not enabled on file server. Enable 'autoindex on;' in NGINX config."
        );
      } else if (error.response?.status === 404) {
        throw new Error("Uploads directory not found on file server");
      } else if (error.code === "ECONNREFUSED") {
        throw new Error("File server is not accessible");
      } else {
        throw new Error("Failed to list files from server");
      }
    }
  }

  /**
   * Parse NGINX autoindex HTML to extract file list
   * @param {string} html - HTML response from NGINX autoindex
   */
  parseNginxAutoindex(html) {
    const files = [];

    // Regular expression to match NGINX autoindex entries
    // Looks for links like: <a href="filename.ext">filename.ext</a>
    const linkRegex =
      /<a href="([^"]+)">([^<]+)<\/a>\s+(\d{2}-\w{3}-\d{4} \d{2}:\d{2})\s+(\d+|-)/g;

    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const [, href, name, dateStr, sizeStr] = match;

      // Skip parent directory link
      if (href === "../" || name === "../") continue;

      // Skip directories (they end with /)
      if (href.endsWith("/")) continue;

      files.push({
        filename: decodeURIComponent(href),
        displayName: name,
        dateString: dateStr,
        size: sizeStr === "-" ? 0 : parseInt(sizeStr),
        url: `${this.fileServerBase}/uploads/${encodeURIComponent(href)}`,
      });
    }

    return files;
  }

  /**
   * Download a file directly from uploads directory
   * @param {string} filename - The filename to download
   * @param {Object} res - Express response object
   */
  async downloadUploadedFile(filename, res) {
    if (!this.isConfigured()) {
      throw new Error("File server not configured");
    }

    try {
      const url = `${this.fileServerBase}/uploads/${encodeURIComponent(
        filename
      )}`;
      console.log(`Downloading uploaded file from: ${url}`);

      const response = await axios.get(url, {
        responseType: "stream",
        timeout: 30000,
      });

      // Set appropriate headers for download
      if (response.headers["content-type"]) {
        res.set("Content-Type", response.headers["content-type"]);
      }
      if (response.headers["content-length"]) {
        res.set("Content-Length", response.headers["content-length"]);
      }
      if (response.headers["last-modified"]) {
        res.set("Last-Modified", response.headers["last-modified"]);
      }

      // Set download headers
      res.set("Content-Disposition", `attachment; filename="${filename}"`);
      res.set("Cache-Control", "public, max-age=3600");

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
   * Serve file directly from local uploads folder as fallback
   * @param {string} filename - The filename to serve
   * @param {Object} res - Express response object
   */
  async serveLocalFile(filename, res) {
    const uploadsPath = path.join(__dirname, "../uploads");
    const storagePath = path.join(__dirname, "../storage");

    // Try uploads folder first, then storage folder
    let filePath = path.join(uploadsPath, filename);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(storagePath, filename);
    }

    console.log(`Attempting to serve local file: ${filePath}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Set content type based on file extension
    const ext = filename.toLowerCase().split(".").pop();
    const mimeTypes = {
      mp4: "video/mp4",
      webm: "video/webm",
      ogg: "video/ogg",
      avi: "video/x-msvideo",
      mov: "video/quicktime",
      wmv: "video/x-ms-wmv",
      mkv: "video/x-matroska",
      m4v: "video/mp4",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      flac: "audio/flac",
      aac: "audio/aac",
      m4a: "audio/mp4",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.set("Content-Type", contentType);
    res.set("Accept-Ranges", "bytes");
    res.set("Cache-Control", "public, max-age=3600");

    // Handle range requests for video/audio streaming
    const range = res.req.headers.range;
    if (
      range &&
      (contentType.startsWith("video/") || contentType.startsWith("audio/"))
    ) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const stream = fs.createReadStream(filePath, { start, end });

      res.status(206);
      res.set({
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Content-Length": chunksize,
      });

      stream.pipe(res);
    } else {
      // Serve complete file
      res.set("Content-Length", fileSize);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }

    console.log(`Successfully served local file: ${filename}`);
    return true;
  }
}

module.exports = new FileServerService();
