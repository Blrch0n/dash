const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Import middleware
const { generalRateLimit, corsHeaders } = require("./middleware/auth");

// Rate limiting
app.use(generalRateLimit);

// CORS configuration
const corsOptions = {
  origin: true, // Allow any origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(corsHeaders);

// Body parsing middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dashboard")
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/sections", require("./routes/sections"));

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
    ],
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
