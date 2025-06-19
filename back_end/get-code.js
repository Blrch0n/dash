#!/usr/bin/env node

/**
 * Simple test to check verification code from database
 */

const mongoose = require("mongoose");
require("dotenv").config();

async function getVerificationCode(email) {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/dashboard"
    );

    const User = require("./models/User");
    const user = await User.findOne({ email }).select(
      "+emailVerificationCode +emailVerificationExpires"
    );

    if (user && user.emailVerificationCode) {
      console.log(
        "🔢 Verification code for",
        email,
        ":",
        user.emailVerificationCode
      );
      console.log("⏰ Expires at:", user.emailVerificationExpires);
      const isExpired = user.emailVerificationExpires < new Date();
      console.log("🕐 Code status:", isExpired ? "EXPIRED" : "VALID");

      return user.emailVerificationCode;
    } else {
      console.log("❌ No verification code found for", email);
      return null;
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    mongoose.disconnect();
  }
}

const email = process.argv[2] || "test@example.com";
getVerificationCode(email);

// Production Email Service Examples
const productionEmailConfigs = {
  // SendGrid (Recommended for production)
  sendGrid: {
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  },

  // Amazon SES
  amazonSES: {
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    auth: {
      user: process.env.AWS_SES_USER,
      pass: process.env.AWS_SES_PASS,
    },
  },

  // Mailgun
  mailgun: {
    host: "smtp.mailgun.org",
    port: 587,
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASS,
    },
  },
};
