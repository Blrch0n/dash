const mongoose = require("mongoose");
const Section = require("../models/Section");
const {
  convertBase64ToFile,
  processDataImages,
} = require("../middleware/imageProcessor");
const { initialSections } = require("../data/sections");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dashboard")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

/**
 * Convert existing base64 images in the database to file URLs
 */
async function convertExistingBase64Images() {
  try {
    console.log("Converting existing base64 images to files...");

    const sections = await Section.find({});
    let convertedCount = 0;

    for (const section of sections) {
      let needsUpdate = false;

      if (section.data) {
        // Process the data to convert base64 images
        const originalData = JSON.stringify(section.data);
        const processedData = processDataImages(section.data);
        const newData = JSON.stringify(processedData);

        // Check if any changes were made
        if (originalData !== newData) {
          section.data = processedData;
          section.lastUpdated = new Date();
          await section.save();
          needsUpdate = true;
          convertedCount++;
        }
      }

      if (needsUpdate) {
        console.log(
          `Converted images in section: ${section.sectionName}/${section.subsectionName}`
        );
      }
    }

    console.log(`Conversion complete. Updated ${convertedCount} sections.`);
  } catch (error) {
    console.error("Error converting base64 images:", error);
  }
}

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await Section.deleteMany({});
    console.log("🗑️  Cleared existing sections");

    // Insert initial data
    const result = await Section.insertMany(initialSections);
    console.log(`✅ Inserted ${result.length} sections`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

async function convertImages() {
  try {
    console.log("🖼️ Starting image conversion...");
    await convertExistingBase64Images();
    console.log("🎉 Image conversion completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error converting images:", error);
    process.exit(1);
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  const command = process.argv[2];

  if (command === "convert") {
    convertImages();
  } else {
    seedDatabase();
  }
}

module.exports = { seedDatabase, initialSections, convertExistingBase64Images };
