const User = require("../models/User");
const AuthService = require("../services/authService");

// @desc    Get current user profile
const getProfile = async (req, res) => {
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
};

// @desc    Update user profile
const updateProfile = async (req, res) => {
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
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Change user password
const changePassword = async (req, res) => {
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
    AuthService.clearTokenCookies(res);

    res.json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      success: false,
      message: "Password change failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Verify if token is valid
const verifyToken = async (req, res) => {
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
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
};
