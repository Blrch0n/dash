// Export all validation middleware from subdirectories
const { handleValidationErrors } = require("./validation/common");
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
} = require("./validation/authValidation");
const {
  validatePasswordChange,
  validatePasswordResetRequest,
  validatePasswordReset,
} = require("./validation/passwordValidation");
const {
  checkUniqueEmail,
  sanitizeInput,
} = require("./validation/userValidation");

module.exports = {
  // Common validation
  handleValidationErrors,

  // Auth validation
  validateRegister,
  validateLogin,
  validateProfileUpdate,

  // Password validation
  validatePasswordChange,
  validatePasswordResetRequest,
  validatePasswordReset,

  // User validation
  checkUniqueEmail,
  sanitizeInput,
};
