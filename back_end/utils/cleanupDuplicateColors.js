const mongoose = require("mongoose");
const Section = require("./models/Section");

/**
 * Utility script to clean up duplicate color properties in existing sections
 * This will remove individual color properties if a colors object exists
 */
async function cleanupDuplicateColorProperties() {
  try {
    console.log("Starting cleanup of duplicate color properties...");

    // Get all sections
    const sections = await Section.find({});
    console.log(`Found ${sections.length} sections to check`);

    let updatedCount = 0;

    for (const section of sections) {
      if (section.data && typeof section.data === "object") {
        let needsUpdate = false;
        const cleanedData = { ...section.data };

        // Color properties to check for duplication
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
        if (cleanedData.colors && typeof cleanedData.colors === "object") {
          colorProperties.forEach((colorProp) => {
            if (cleanedData.hasOwnProperty(colorProp)) {
              console.log(
                `Removing duplicate ${colorProp} from section ${section.sectionName}/${section.subsectionName}`
              );
              delete cleanedData[colorProp];
              needsUpdate = true;
            }
          });
        }

        // Update section if changes were made
        if (needsUpdate) {
          await Section.findByIdAndUpdate(section._id, {
            data: cleanedData,
            lastUpdated: new Date(),
          });
          updatedCount++;
          console.log(
            `Updated section: ${section.sectionName}/${section.subsectionName}`
          );
        }
      }
    }

    console.log(`\nCleanup completed! Updated ${updatedCount} sections.`);
    return updatedCount;
  } catch (error) {
    console.error("Error during cleanup:", error);
    throw error;
  }
}

// Export for use in other scripts
module.exports = { cleanupDuplicateColorProperties };

// Run cleanup if this script is executed directly
if (require.main === module) {
  // You'll need to set up your database connection here
  // Example connection (adjust as needed):

  mongoose
    .connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(async () => {
      console.log("Connected to MongoDB");
      await cleanupDuplicateColorProperties();
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
      process.exit(1);
    });
}
