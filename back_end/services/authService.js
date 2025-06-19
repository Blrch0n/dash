const User = require("../models/User");
const jwt = require("jsonwebtoken");

class AuthService {
  /**
   * Generate access and refresh tokens for a user
   */
  static generateTokens(user) {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    return { accessToken, refreshToken };
  }

  /**
   * Set secure cookies for tokens
   */
  static setTokenCookies(res, accessToken, refreshToken) {
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
  }

  /**
   * Clear authentication cookies
   */
  static clearTokenCookies(res) {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
  }

  /**
   * Validate user credentials
   */
  static async validateCredentials(email, password) {
    const user = await User.findByEmail(email).select("+password");

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    return user;
  }

  /**
   * Create a new user account
   */
  static async createUser(userData) {
    const { firstName, lastName, email, password } = userData;

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      isEmailVerified: true, // Auto-verify for now
    });

    await user.save();
    return user;
  }

  /**
   * Check if refresh token needs rotation
   */
  static shouldRotateRefreshToken(refreshToken) {
    try {
      const decoded = jwt.decode(refreshToken);
      const timeUntilExpiry = decoded.exp * 1000 - Date.now();
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;

      return timeUntilExpiry < threeDaysInMs;
    } catch (error) {
      return true; // Rotate if we can't decode
    }
  }
}

module.exports = AuthService;
