const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

// Connect to MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/dashboard";

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Check if email exists
    const existingUser = await User.findOne({ email: "bolro@bolro.com" });

    if (existingUser) {
      console.log('❌ Email "bolro@bolro.com" already exists in database');
      console.log("User details:", {
        id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        createdAt: existingUser.createdAt,
      });
    } else {
      console.log('✅ Email "bolro@bolro.com" is available');
    }

    process.exit(0);
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
