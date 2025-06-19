const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

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
  validatePasswordResetRequest,
  validatePasswordReset,
  validateProfileUpdate,
  checkUniqueEmail,
  sanitizeInput,
} = require("../middleware/validation");

// Helper function to set secure cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  // Set access token cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/",
  });

  // Set refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
};

// Clear authentication cookies
const clearTokenCookies = (res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  authRateLimit,
  sanitizeInput,
  validateRegister,
  checkUniqueEmail(),
  async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Debug logging
      console.log("Registration request data:", {
        firstName,
        lastName,
        email,
        passwordLength: password ? password.length : 0,
        hasUppercase: password ? /[A-Z]/.test(password) : false,
        hasLowercase: password ? /[a-z]/.test(password) : false,
        hasNumber: password ? /\d/.test(password) : false,
      });

      // Create new user (verified by default)
      const user = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
        isEmailVerified: true, // Auto-verify for now
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: {
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Registration failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user (requires email verification)
// @access  Public
router.post(
  "/login",
  authRateLimit,
  sanitizeInput,
  validateLogin,
  async (req, res) => {
    try {
      const { email, password, rememberMe, skipTwoFactor } = req.body;

      // Find user by email and include password for comparison
      const user = await User.findByEmail(email).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated. Please contact support.",
        });
      }

      // Compare password
      const isValidPassword = await user.comparePassword(password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate tokens for successful login
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      // Save refresh token to user
      await user.addRefreshToken(refreshToken);

      // Set cookies
      setTokenCookies(res, accessToken, refreshToken);

      // Update last login
      await user.updateLastLogin();

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: user.getPublicProfile(),
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Private (with refresh token)
router.post("/refresh", authenticateRefreshToken, async (req, res) => {
  try {
    const user = req.user;
    const oldRefreshToken = req.refreshToken;

    // Generate new access token
    const accessToken = user.generateAccessToken();

    // Only generate new refresh token if the old one is close to expiry
    // This reduces unnecessary refresh token rotation
    let refreshToken = oldRefreshToken;
    const decoded = jwt.decode(oldRefreshToken);
    const timeUntilExpiry = decoded.exp * 1000 - Date.now();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;

    if (timeUntilExpiry < threeDaysInMs) {
      // Generate new refresh token only if old one expires in less than 3 days
      refreshToken = user.generateRefreshToken();
      await user.removeRefreshToken(oldRefreshToken);
      await user.addRefreshToken(refreshToken);
    }

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      message: "Tokens refreshed successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      message: "Token refresh failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // Remove the specific refresh token
      await user.removeRefreshToken(refreshToken);
    }

    // Clear cookies
    clearTokenCookies(res);

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   POST /api/auth/logout-all
// @desc    Logout from all devices
// @access  Private
router.post("/logout-all", authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Remove all refresh tokens
    await user.removeAllRefreshTokens();

    // Clear cookies
    clearTokenCookies(res);

    res.json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({
      success: false,
      message: "Logout from all devices failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get("/me", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  authenticateToken,
  sanitizeInput,
  validateProfileUpdate,
  checkUniqueEmail(true),
  async (req, res) => {
    try {
      const user = req.user;
      const { firstName, lastName, email } = req.body;

      // Update fields if provided
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email.toLowerCase();

      await user.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: user.getPublicProfile(),
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        success: false,
        message: "Profile update failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put(
  "/change-password",
  authenticateToken,
  sanitizeInput,
  validatePasswordChange,
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("+password");
      const { currentPassword, newPassword } = req.body;

      // Verify current password
      const isValidPassword = await user.comparePassword(currentPassword);

      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Remove all refresh tokens to force re-login on all devices
      await user.removeAllRefreshTokens();

      // Clear cookies
      clearTokenCookies(res);

      res.json({
        success: true,
        message: "Password changed successfully. Please login again.",
      });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({
        success: false,
        message: "Password change failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// @route   POST /api/auth/verify-token
// @desc    Verify if token is valid
// @access  Private
router.post("/verify-token", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Token is valid",
      data: {
        user: req.user.getPublicProfile(),
        tokenData: {
          userId: req.tokenData.userId,
          email: req.tokenData.email,
          role: req.tokenData.role,
          iat: req.tokenData.iat,
          exp: req.tokenData.exp,
        },
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Token verification failed",
    });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt", search } = req.query;

    // Build query
    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select("-refreshTokens");

    // Get total count
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users: users.map((user) => user.getPublicProfile()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
