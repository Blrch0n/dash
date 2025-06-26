const fs = require("fs");
const path = require("path");
const { getFileUrl, imagesDir } = require("./upload");

/**
 * Process images in section data - convert base64 to files and create URLs
 */
const processImages = (req, res, next) => {
  try {
    console.log(
      "Processing images - Request body:",
      JSON.stringify(req.body, null, 2)
    );
    console.log("Files uploaded:", req.files ? req.files.length : 0);

    // If files were uploaded via multer, create a mapping
    const uploadedFiles = {};
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        uploadedFiles[`image_${index}`] = getFileUrl(file.filename);
      });
    }

    // Process the request body to find and convert base64 images
    if (req.body.data) {
      const processedData = processDataImages(req.body.data);
      req.body.data = processedData;
    }

    // Add uploaded file URLs to request for controller use
    req.uploadedFiles = uploadedFiles;

    console.log("Processed request body:", JSON.stringify(req.body, null, 2));
    next();
  } catch (error) {
    console.error("Image processing error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing images",
      error: error.message,
    });
  }
};

/**
 * Recursively process data object to find and convert base64 images
 */
function processDataImages(data) {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => processDataImages(item));
  }

  const processed = {};

  // Clean up duplicate color properties
  const cleanedData = cleanDuplicateColors(data);

  for (const [key, value] of Object.entries(cleanedData)) {
    if (
      key === "image" &&
      typeof value === "string" &&
      value.startsWith("data:image/")
    ) {
      // This is a base64 image, convert it to a file
      processed[key] = convertBase64ToFile(value);
    } else if (typeof value === "object") {
      // Recursively process nested objects
      processed[key] = processDataImages(value);
    } else {
      processed[key] = value;
    }
  }

  return processed;
}

/**
 * Clean duplicate color properties from data object
 * Remove individual color properties if they exist alongside a colors object
 */
function cleanDuplicateColors(data) {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return data;
  }

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

  // If there's a colors object, remove individual color properties
  if (data.colors && typeof data.colors === "object") {
    const cleaned = { ...data };

    // Remove duplicate individual color properties
    colorProperties.forEach((colorProp) => {
      if (cleaned.hasOwnProperty(colorProp)) {
        delete cleaned[colorProp];
      }
    });

    console.log(
      "Cleaned duplicate color properties, keeping only colors object"
    );
    return cleaned;
  }

  return data;
}

/**
 * Convert base64 image to file and return file URL
 */
function convertBase64ToFile(base64Data) {
  try {
    // Extract the base64 data and determine file extension
    const matches = base64Data.match(
      /^data:image\/([A-Za-z-+\/]+);base64,(.+)$/
    );
    if (!matches || matches.length !== 3) {
      console.warn("Invalid base64 image format");
      return base64Data; // Return original if invalid
    }

    const extension = matches[1];
    const imageBuffer = Buffer.from(matches[2], "base64");

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}.${extension}`;
    const filePath = path.join(imagesDir, filename);

    // Write the file
    fs.writeFileSync(filePath, imageBuffer); // Return the file URL
    return getFileUrl(filename);
  } catch (error) {
    console.error("Error converting base64 to file:", error);
    return base64Data; // Return original base64 if conversion fails
  }
}

/**
 * Clean up uploaded files if an error occurs
 */
const cleanupFiles = (files) => {
  if (!files || !Array.isArray(files)) return;

  files.forEach((file) => {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        console.log("Cleaned up file:", file.path);
      }
    } catch (error) {
      console.error("Error cleaning up file:", error);
    }
  });
};

module.exports = {
  processImages,
  cleanupFiles,
  convertBase64ToFile,
  processDataImages,
};
