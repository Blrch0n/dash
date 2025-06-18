const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/dashboard"
    );
    console.log("Connected to MongoDB");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const adminUser = new User({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: "Admin123!", // This will be hashed automatically
      role: "admin",
      isEmailVerified: true,
      isActive: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    console.log("Email: admin@example.com");
    console.log("Password: Admin123!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/dashboard"
    );
    console.log("Connected to MongoDB");

    // Check if test users already exist
    const existingUser = await User.findOne({ email: "user@example.com" });

    if (existingUser) {
      console.log("Test users already exist");
      return;
    }

    // Create regular test user
    const testUser = new User({
      firstName: "John",
      lastName: "Doe",
      email: "user@example.com",
      password: "User123!",
      role: "user",
      isEmailVerified: true,
      isActive: true,
    });

    await testUser.save();
    console.log("Test user created successfully");
    console.log("Email: user@example.com");
    console.log("Password: User123!");
  } catch (error) {
    console.error("Error creating test users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Check command line arguments
const command = process.argv[2];

if (command === "admin") {
  createAdminUser();
} else if (command === "users") {
  createTestUsers();
} else if (command === "all") {
  (async () => {
    await createAdminUser();
    await createTestUsers();
  })();
} else {
  console.log("Usage:");
  console.log("  node utils/createUsers.js admin  - Create admin user");
  console.log("  node utils/createUsers.js users  - Create test users");
  console.log(
    "  node utils/createUsers.js all    - Create both admin and test users"
  );
}
