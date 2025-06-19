const User = require("../models/User");
const AuthService = require("../services/authService");

// @desc    Register a new user
const register = async (req, res) => {
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
      hasConfirmPassword: !!req.body.confirmPassword,
      fullRequestBody: req.body,
    });

    const user = await AuthService.createUser({
      firstName,
      lastName,
      email,
      password,
    });

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
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await AuthService.validateCredentials(email, password);

    // Generate tokens for successful login
    const { accessToken, refreshToken } = AuthService.generateTokens(user);

    // Save refresh token to user
    await user.addRefreshToken(refreshToken);

    // Set cookies
    AuthService.setTokenCookies(res, accessToken, refreshToken);

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

    if (
      error.message === "Invalid credentials" ||
      error.message === "Account is deactivated"
    ) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Refresh access token
const refreshToken = async (req, res) => {
  try {
    const user = req.user;
    const oldRefreshToken = req.refreshToken;

    // Generate new access token
    const { accessToken } = AuthService.generateTokens(user);

    // Check if refresh token needs rotation
    let newRefreshToken = oldRefreshToken;
    if (AuthService.shouldRotateRefreshToken(oldRefreshToken)) {
      newRefreshToken = AuthService.generateTokens(user).refreshToken;
      await user.removeRefreshToken(oldRefreshToken);
      await user.addRefreshToken(newRefreshToken);
    }

    // Set cookies
    AuthService.setTokenCookies(res, accessToken, newRefreshToken);

    res.json({
      success: true,
      message: "Tokens refreshed successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
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
};

// @desc    Logout user
const logout = async (req, res) => {
  try {
    const user = req.user;
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // Remove the specific refresh token
      await user.removeRefreshToken(refreshToken);
    }

    // Clear cookies
    AuthService.clearTokenCookies(res);

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
};

// @desc    Logout from all devices
const logoutAll = async (req, res) => {
  try {
    const user = req.user;

    // Remove all refresh tokens
    await user.removeAllRefreshTokens();

    // Clear cookies
    AuthService.clearTokenCookies(res);

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
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
};
