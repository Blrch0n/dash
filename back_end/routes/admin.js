const express = require("express");
const router = express.Router();
const Section = require("../models/Section");
const { getAbsoluteFileUrl } = require("../middleware/upload");
const { authenticateToken } = require("../middleware/auth");

/**
 * Convert all relative image URLs to absolute URLs
 */
router.post("/convert-urls", authenticateToken, async (req, res) => {
  try {
    console.log("Converting relative URLs to absolute URLs...");

    const sections = await Section.find({});
    let convertedCount = 0;

    for (const section of sections) {
      let needsUpdate = false;

      if (section.data) {
        const convertedData = convertImageUrls(section.data, req);

        // Check if any changes were made
        if (JSON.stringify(section.data) !== JSON.stringify(convertedData)) {
          section.data = convertedData;
          section.lastUpdated = new Date();
          await section.save();
          needsUpdate = true;
          convertedCount++;
        }
      }

      if (needsUpdate) {
        console.log(
          `Converted URLs in section: ${section.sectionName}/${section.subsectionName}`
        );
      }
    }

    res.json({
      success: true,
      message: `Conversion complete. Updated ${convertedCount} sections.`,
      convertedCount,
    });
  } catch (error) {
    console.error("Error converting URLs:", error);
    res.status(500).json({
      success: false,
      message: "Error converting URLs",
      error: error.message,
    });
  }
});

/**
 * Recursively convert relative image URLs to absolute URLs
 */
function convertImageUrls(data, req) {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => convertImageUrls(item, req));
  }

  const converted = {};
  for (const [key, value] of Object.entries(data)) {
    if (
      key === "image" &&
      typeof value === "string" &&
      value.startsWith("/api/uploads/")
    ) {
      // Convert relative URL to absolute
      converted[key] = getAbsoluteFileUrl(value, req);
    } else if (typeof value === "object") {
      // Recursively process nested objects
      converted[key] = convertImageUrls(value, req);
    } else {
      converted[key] = value;
    }
  }

  return converted;
}

module.exports = router;
