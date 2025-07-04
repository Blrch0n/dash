const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for development
    crossOriginEmbedderPolicy: false,
  })
);

// Import middleware
const { generalRateLimit } = require("./middleware/auth");

// Rate limiting
app.use(generalRateLimit);

// Simple CORS - allow everything
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Add logging for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get("Origin")}`);
  next();
});

// Optimized body parsing middleware
app.use(bodyParser.json({ limit: "50mb" })); // Reduced since we're using chunking
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Add compression middleware for better performance
const compression = require("compression");
app.use(compression());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dashboard")
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Static file serving for uploads with CORS headers
app.use(
  "/api/uploads",
  (req, res, next) => {
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  },
  express.static("uploads")
);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/sections", require("./routes/sections"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/upload-chunked", require("./routes/chunkedUpload"));
app.use("/api/files", require("./routes/files"));
app.use("/api/storage", require("./routes/storage"));
app.use("/api/performance", require("./routes/performance"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running", timestamp: new Date() });
});

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Dashboard Backend API",
    availableEndpoints: [
      "GET /api/health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/auth/logout",
      "POST /api/auth/refresh",
      "GET /api/auth/me",
      "PUT /api/auth/profile",
      "PUT /api/auth/change-password",
      "GET /api/sections",
      "GET /api/sections/:sectionName",
      "POST /api/sections",
      "PUT /api/sections/:id",
      "DELETE /api/sections/:id",
      "GET /api/files/health",
      "GET /api/files/:filename",
      "POST /api/files/upload",
      "POST /api/files/upload/multiple",
      "DELETE /api/files/:filename",
      "GET /api/files/url/:filename",
      "GET /api/storage/stats",
      "GET /api/storage/files",
      "GET /api/storage/search",
      "GET /api/storage/server/files",
      "GET /api/storage/files/:filename",
      "GET /api/storage/files/:filename/download",
      "GET /api/storage/files/:filename/verify",
      "POST /api/storage/download",
      "POST /api/storage/download/batch",
      "POST /api/storage/sync",
      "DELETE /api/storage/files/:filename",
      "DELETE /api/storage/clear",
      "GET /api/storage/migration/status",
      "POST /api/storage/migration/migrate",
    ],
  });
});

// Handle 404 (must be after all routes)
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler (must be last)
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
