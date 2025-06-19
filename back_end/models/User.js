const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [1, "First name must be at least 1 character long"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [1, "Last name must be at least 1 character long"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 604800, // 7 days in seconds
        },
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationCode: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    loginVerificationCode: {
      type: String,
      select: false,
    },
    loginVerificationExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for email lookups
userSchema.index({ email: 1 });

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// Method to generate JWT access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET || "your-secret-key",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
      issuer: "dashboard-app",
      audience: "dashboard-users",
    }
  );
};

// Method to generate JWT refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
      issuer: "dashboard-app",
      audience: "dashboard-users",
    }
  );
};

// Method to add refresh token to user
userSchema.methods.addRefreshToken = async function (refreshToken) {
  this.refreshTokens.push({
    token: refreshToken,
    createdAt: new Date(),
  });

  // Keep only the last 5 refresh tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }

  await this.save();
};

// Method to remove refresh token
userSchema.methods.removeRefreshToken = async function (refreshToken) {
  this.refreshTokens = this.refreshTokens.filter(
    (token) => token.token !== refreshToken
  );
  await this.save();
};

// Method to remove all refresh tokens (logout from all devices)
userSchema.methods.removeAllRefreshTokens = async function () {
  this.refreshTokens = [];
  await this.save();
};

// Method to update last login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

// Static method to find user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    isEmailVerified: this.isEmailVerified,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Method to generate 4-digit verification code
userSchema.methods.generateVerificationCode = function () {
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  return code;
};

// Method to generate and save email verification code
userSchema.methods.createEmailVerificationCode = async function () {
  const code = this.generateVerificationCode();
  this.emailVerificationCode = code;
  this.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await this.save();
  return code;
};

// Method to generate and save login verification code
userSchema.methods.createLoginVerificationCode = async function () {
  const code = this.generateVerificationCode();
  this.loginVerificationCode = code;
  this.loginVerificationExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await this.save();
  return code;
};

// Method to verify email verification code
userSchema.methods.verifyEmailCode = function (code) {
  return (
    this.emailVerificationCode === code &&
    this.emailVerificationExpires > new Date()
  );
};

// Method to verify login verification code
userSchema.methods.verifyLoginCode = function (code) {
  return (
    this.loginVerificationCode === code &&
    this.loginVerificationExpires > new Date()
  );
};

// Method to clear verification codes
userSchema.methods.clearVerificationCodes = async function () {
  this.emailVerificationCode = undefined;
  this.emailVerificationExpires = undefined;
  this.loginVerificationCode = undefined;
  this.loginVerificationExpires = undefined;
  await this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
