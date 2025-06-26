/**
 * Validation middleware for section data
 * Ensures no duplicate color properties exist alongside colors object
 */

const validateSectionData = (req, res, next) => {
  try {
    if (req.body.data && typeof req.body.data === "object") {
      const data = req.body.data;

      // Color properties that shouldn't exist if colors object exists
      const colorProperties = [
        "primaryColor",
        "secondaryColor",
        "accentColor",
        "backgroundColor",
        "textColor",
        "scrolledBgColor",
        "scrolledTextColor",
        "hoverColor",
        "borderColor",
      ];

      // Check if colors object exists
      if (data.colors && typeof data.colors === "object") {
        // Check for duplicate individual color properties
        const duplicateProperties = colorProperties.filter((prop) =>
          data.hasOwnProperty(prop)
        );

        if (duplicateProperties.length > 0) {
          // Option 1: Return error (strict validation)
          /*
          return res.status(400).json({
            success: false,
            message: 'Duplicate color properties detected',
            details: `Remove individual color properties ${duplicateProperties.join(', ')} when using colors object`,
            duplicateProperties
          });
          */

          // Option 2: Auto-clean (permissive validation) - recommended
          console.log(
            `Auto-removing duplicate color properties: ${duplicateProperties.join(
              ", "
            )}`
          );
          duplicateProperties.forEach((prop) => {
            delete data[prop];
          });
        }
      }
    }

    next();
  } catch (error) {
    console.error("Validation error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating section data",
      error: error.message,
    });
  }
};

/**
 * Validate colors object structure
 */
const validateColorsObject = (req, res, next) => {
  try {
    if (req.body.data && req.body.data.colors) {
      const colors = req.body.data.colors;

      // Valid color properties
      const validColorProperties = [
        "primaryColor",
        "secondaryColor",
        "accentColor",
        "backgroundColor",
        "textColor",
        "scrolledBgColor",
        "scrolledTextColor",
        "hoverColor",
        "borderColor",
      ];

      // Check for invalid properties in colors object
      const invalidProperties = Object.keys(colors).filter(
        (prop) => !validColorProperties.includes(prop)
      );

      if (invalidProperties.length > 0) {
        console.warn(
          `Invalid color properties detected: ${invalidProperties.join(", ")}`
        );
        // Remove invalid properties
        invalidProperties.forEach((prop) => {
          delete colors[prop];
        });
      }

      // Validate color format (basic hex color validation)
      Object.entries(colors).forEach(([key, value]) => {
        if (typeof value === "string" && value.startsWith("#")) {
          // Basic hex color validation
          const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
          if (!hexRegex.test(value)) {
            console.warn(`Invalid hex color format for ${key}: ${value}`);
          }
        }
      });
    }

    next();
  } catch (error) {
    console.error("Color validation error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating colors",
      error: error.message,
    });
  }
};

module.exports = {
  validateSectionData,
  validateColorsObject,
};
