// Export all auth middleware from subdirectories
const {
  authenticateToken,
  optionalAuth,
  authenticateRefreshToken,
} = require("./auth/tokenAuth");
const {
  requireRole,
  requireAdmin,
  requireUserOrAdmin,
} = require("./auth/roleAuth");
const {
  generalRateLimit,
  authRateLimit,
  passwordResetRateLimit,
  apiRateLimit,
} = require("./auth/rateLimiting");

module.exports = {
  // Token authentication
  authenticateToken,
  optionalAuth,
  authenticateRefreshToken,

  // Role authorization
  requireRole,
  requireAdmin,
  requireUserOrAdmin,

  // Rate limiting
  generalRateLimit,
  authRateLimit,
  passwordResetRateLimit,
  apiRateLimit,
};
