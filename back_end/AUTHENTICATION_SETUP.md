# Email Two-Way Authentication Setup Guide

## Overview

Your backend now supports email-based two-way authentication with 4-digit verification codes. Here's what I've implemented:

## 🔧 What's New

### 1. Email Verification System

- **Registration**: Users receive a 4-digit code via email after signup
- **Email Verification**: Users must verify their email before login
- **Login 2FA**: Optional 2-factor authentication for login (configurable)

### 2. New API Endpoints

- `POST /api/auth/register` - Register user and send verification email
- `POST /api/auth/verify-email` - Verify email with 4-digit code
- `POST /api/auth/resend-verification` - Resend verification code
- `POST /api/auth/login` - Login (requires verified email)
- `POST /api/auth/verify-login` - Verify login with 2FA code (if enabled)

### 3. Enhanced User Model

- Added email verification fields
- Added login verification fields
- Methods for code generation and validation

## 📧 Email Configuration

### Option 1: Gmail (Recommended for Production)

1. Enable 2-step verification in your Google account
2. Generate an "App Password" for your application
3. Update your `.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### Option 2: Development Mode (Automatic)

If you don't configure EMAIL_USER, the system will automatically use Ethereal Email (fake SMTP) for testing. Check the console for preview URLs.

## 🚀 Quick Setup

1. **Copy Environment File**:

   ```bash
   cp .env.example .env
   ```

2. **Configure Email** (Optional for development):

   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   REQUIRE_LOGIN_2FA=false
   ```

3. **Start the Server**:
   ```bash
   npm run dev
   ```

## 🔄 Authentication Flow

### Registration Flow

```
1. User submits: firstName, lastName, email, password
2. System creates user (unverified)
3. System sends 4-digit code to email
4. User enters code to verify email
5. User can now log in
```

### Login Flow

```
1. User submits: email, password
2. System checks if email is verified
3. If REQUIRE_LOGIN_2FA=true: sends login code
4. User enters login code (if required)
5. System issues JWT tokens
```

## 🧪 Testing

Run the test script to see the authentication flow:

```bash
# Test registration (will show email preview URL in development)
node test-auth.js

# If you have a verification code, test email verification:
node test-auth.js 1234
```

## 🔐 Security Features

- **Rate Limiting**: Prevents brute force attacks
- **Code Expiration**: Email verification codes expire in 10 minutes, login codes in 5 minutes
- **Secure Passwords**: Enforced password complexity
- **JWT Security**: Access tokens expire in 15 minutes, refresh tokens in 7 days
- **HTTP-Only Cookies**: Tokens stored in secure cookies

## 📱 Frontend Integration

### Registration Request

```javascript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "SecurePass123",
  }),
});
```

### Email Verification

```javascript
const response = await fetch("/api/auth/verify-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    code: "1234",
  }),
});
```

### Login Request

```javascript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // Important for cookies
  body: JSON.stringify({
    email: "john@example.com",
    password: "SecurePass123",
  }),
});
```

## 🛠️ Configuration Options

### Environment Variables

```env
# Required
MONGODB_URI=mongodb://localhost:27017/dashboard
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Email (optional for development)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Two-Factor Authentication
REQUIRE_LOGIN_2FA=false  # Set to 'true' to require 2FA for all logins
```

## 🐛 Troubleshooting

### Email Not Sending

- Check your EMAIL_USER and EMAIL_PASS settings
- For Gmail, ensure you're using an App Password, not your account password
- In development mode without email config, check console for preview URLs

### Database Issues

- Ensure MongoDB is running
- Check your MONGODB_URI connection string

### JWT Issues

- Ensure JWT_SECRET and JWT_REFRESH_SECRET are set
- Check that tokens haven't expired

## 📝 Example Frontend Flow

1. **Registration Page**: Collect user details, show "Check your email" message
2. **Email Verification Page**: Input field for 4-digit code
3. **Login Page**: Standard email/password, handle 2FA if enabled
4. **Dashboard**: Protected routes using JWT tokens

The system is now ready for production use with proper email configuration!
