const express = require("express");
const router = express.Router();

// Import controllers
const {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
} = require("../controllers/authController");
const {
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
} = require("../controllers/userController");
const { getAllUsers } = require("../controllers/adminController");

// Import middleware
const {
  authenticateToken,
  authenticateRefreshToken,
  authRateLimit,
  requireAdmin,
} = require("../middleware/auth");

const {
  validateRegister,
  validateLogin,
  validatePasswordChange,
  validateProfileUpdate,
  checkUniqueEmail,
  sanitizeInput,
} = require("../middleware/validation");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  authRateLimit,
  sanitizeInput,
  validateRegister,
  checkUniqueEmail(),
  register
);

// @route   POST /api/auth/login
// @desc    Login user (requires email verification)
// @access  Public
router.post("/login", authRateLimit, sanitizeInput, validateLogin, login);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Private (with refresh token)
router.post("/refresh", authenticateRefreshToken, refreshToken);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", authenticateToken, logout);

// @route   POST /api/auth/logout-all
// @desc    Logout from all devices
// @access  Private
router.post("/logout-all", authenticateToken, logoutAll);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get("/me", authenticateToken, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  authenticateToken,
  sanitizeInput,
  validateProfileUpdate,
  checkUniqueEmail(true),
  updateProfile
);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put(
  "/change-password",
  authenticateToken,
  sanitizeInput,
  validatePasswordChange,
  changePassword
);

// @route   POST /api/auth/verify-token
// @desc    Verify if token is valid
// @access  Private
router.post("/verify-token", authenticateToken, verifyToken);

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get("/users", authenticateToken, requireAdmin, getAllUsers);

module.exports = router;
