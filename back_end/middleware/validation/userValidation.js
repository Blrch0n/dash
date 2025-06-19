const User = require("../../models/User");
const validator = require("validator");

// Middleware to check if email is unique
const checkUniqueEmail = (isUpdate = false) => {
  return async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return next(); // Skip if no email provided
      }

      // Build query
      let query = { email: email.toLowerCase() };

      // For updates, exclude current user
      if (isUpdate && req.user) {
        query._id = { $ne: req.user._id };
      }

      const existingUser = await User.findOne(query);

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      next();
    } catch (error) {
      console.error("Email uniqueness check error:", error);
      res.status(500).json({
        success: false,
        message: "Error checking email uniqueness",
      });
    }
  };
};

// Middleware to sanitize input
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize string fields
    const fieldsToSanitize = [
      "firstName",
      "lastName",
      "email",
      "title",
      "content",
    ];

    fieldsToSanitize.forEach((field) => {
      if (req.body[field] && typeof req.body[field] === "string") {
        req.body[field] = validator.escape(req.body[field].trim());
      }
    });

    next();
  } catch (error) {
    console.error("Input sanitization error:", error);
    res.status(500).json({
      success: false,
      message: "Error sanitizing input",
    });
  }
};

module.exports = {
  checkUniqueEmail,
  sanitizeInput,
};
