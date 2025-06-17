const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Response helper functions
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res, message = 'Internal server error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  res.status(statusCode).json(response);
};

// Pagination helper
const paginate = (query, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') => {
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  return query.skip(skip).limit(limit).sort(sort);
};

// Database connection helper
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'realDashboard'
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Get user from token
const getUserFromToken = async (token) => {
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Format error for logging
const formatError = (error, context = '') => {
  return {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  };
};

// Async handler wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Check if user has permission
const hasPermission = (user, permission) => {
  return user.permissions.includes(permission) || user.role === 'admin';
};

// Check if user has role
const hasRole = (user, roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return allowedRoles.includes(user.role);
};

// Generate random string
const generateRandomString = (length = 32) => {
  return require('crypto').randomBytes(length).toString('hex');
};

// Validate ObjectId
const isValidObjectId = (id) => {
  return require('mongoose').Types.ObjectId.isValid(id);
};

// Clean object (remove undefined/null values)
const cleanObject = (obj) => {
  const cleaned = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedNestedObj = cleanObject(value);
        if (Object.keys(cleanedNestedObj).length > 0) {
          cleaned[key] = cleanedNestedObj;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  
  return cleaned;
};

// Environment helpers
const isDevelopment = () => process.env.NODE_ENV === 'development';
const isProduction = () => process.env.NODE_ENV === 'production';
const isTest = () => process.env.NODE_ENV === 'test';

// File upload helpers
const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return imageExtensions.includes(getFileExtension(filename));
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Date helpers
const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  
  switch (format) {
    case 'YYYY-MM-DD':
      return d.toISOString().split('T')[0];
    case 'DD/MM/YYYY':
      return d.toLocaleDateString('en-GB');
    case 'MM/DD/YYYY':
      return d.toLocaleDateString('en-US');
    case 'ISO':
      return d.toISOString();
    default:
      return d.toString();
  }
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Cache helpers (simple in-memory cache)
class SimpleCache {
  constructor() {
    this.cache = new Map();
  }
  
  set(key, value, ttl = 300000) { // 5 minutes default
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
}

const cache = new SimpleCache();

module.exports = {
  sendSuccess,
  sendError,
  paginate,
  connectDB,
  generateToken,
  verifyToken,
  getUserFromToken,
  formatError,
  asyncHandler,
  hasPermission,
  hasRole,
  generateRandomString,
  isValidObjectId,
  cleanObject,
  isDevelopment,
  isProduction,
  isTest,
  getFileExtension,
  isImageFile,
  formatFileSize,
  formatDate,
  addDays,
  cache,
  SimpleCache
};
