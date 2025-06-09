// Authentication utilities for client-side auth management

// Simulated user database (in a real app, this would be your backend)
const USERS_DB = [
  {
    id: 1,
    email: "admin@example.com",
    password: "admin123", // In real app, this would be hashed
    firstName: "Admin",
    lastName: "User"
  }
];

// Key for localStorage
const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

// Helper function to set cookie
const setCookie = (name, value, days = 7) => {
  if (typeof document !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }
};

// Helper function to get cookie
const getCookie = (name) => {
  if (typeof document !== 'undefined') {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

// Helper function to delete cookie
const deleteCookie = (name) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
  }
};

// Generate a simple token (in real app, use JWT or similar)
const generateToken = (user) => {
  return btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
};

// Validate user credentials
export const validateUser = (email, password) => {
  const user = USERS_DB.find(u => u.email === email && u.password === password);
  return user ? { ...user, password: undefined } : null; // Don't return password
};

// Register new user
export const registerUser = (userData) => {
  const { email, password, firstName, lastName } = userData;
  
  // Check if user already exists
  const existingUser = USERS_DB.find(u => u.email === email);
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Create new user
  const newUser = {
    id: USERS_DB.length + 1,
    email,
    password, // In real app, hash this
    firstName,
    lastName
  };

  USERS_DB.push(newUser);
  return { ...newUser, password: undefined }; // Don't return password
};

// Login function
export const login = (email, password) => {
  const user = validateUser(email, password);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);
  
  // Store auth data in localStorage
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  
  // Set auth data in cookies
  setCookie(AUTH_TOKEN_KEY, token);
  setCookie(USER_DATA_KEY, JSON.stringify(user));
  
  return { user, token };
};

// Logout function
export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  
  deleteCookie(AUTH_TOKEN_KEY);
  deleteCookie(USER_DATA_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false; // Server-side check
  
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || getCookie(AUTH_TOKEN_KEY);
  const userData = localStorage.getItem(USER_DATA_KEY) || getCookie(USER_DATA_KEY);
  
  return !!(token && userData);
};

// Get current user data
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  
  const userData = localStorage.getItem(USER_DATA_KEY) || getCookie(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Get auth token
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  
  return localStorage.getItem(AUTH_TOKEN_KEY) || getCookie(AUTH_TOKEN_KEY);
};
