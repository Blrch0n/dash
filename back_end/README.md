# Dashboard Backend

A secure Express.js backend for managing dashboard sections with email-based two-way authentication.

## Features

- ✅ REST API for section management
- ✅ Email-based two-way authentication
- ✅ 4-digit verification codes for signup and login
- ✅ MongoDB integration with Mongoose
- ✅ JWT-based authentication with refresh tokens
- ✅ Email verification required before login
- ✅ Optional two-factor authentication for login
- ✅ CORS enabled for frontend integration
- ✅ Rate limiting and security middleware
- ✅ Bulk operations support

## Authentication Flow

### 1. User Registration
- User signs up with email and password
- System sends 4-digit verification code to email
- User must verify email before being able to log in

### 2. Email Verification
- User enters 4-digit code received via email
- Email is marked as verified
- Welcome email is sent

### 3. User Login
- User enters email and password
- If email not verified, login is rejected
- Optional: System sends login verification code (if `REQUIRE_LOGIN_2FA=true`)
- User enters login code to complete authentication
- JWT tokens are issued

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Copy `.env.example` to `.env` and configure:

   ```bash
   cp .env.example .env
   ```

   **Important Email Setup:**
   - For Gmail: Enable 2-step verification and generate an "App Password"
   - Update `EMAIL_USER` and `EMAIL_PASS` in your `.env` file
   - Set `REQUIRE_LOGIN_2FA=true` if you want mandatory 2FA for all logins

3. **Start MongoDB:**

   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

4. **Seed the database with initial data:**

   ```bash
   npm run seed
   ```

5. **Start the server:**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Or production mode
   npm start
   ```

## API Endpoints

### Authentication Endpoints

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Verify Email
```bash
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "1234"
}
```

#### Resend Verification Code
```bash
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123",
  "rememberMe": true,
  "skipTwoFactor": false
}
```

#### Verify Login (if 2FA enabled)
```bash
POST /api/auth/verify-login
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "5678"
}
```

#### Refresh Token
```bash
POST /api/auth/refresh
# Cookies are automatically sent
```

#### Logout
```bash
POST /api/auth/logout
Authorization: Bearer <access_token>
```

### Sections Management

- `GET /api/sections` - Get all sections
- `GET /api/sections/:sectionName` - Get sections by name (about, contact, etc.)
- `GET /api/sections/:sectionName/:subsectionName` - Get specific subsection
- `POST /api/sections` - Create or update a section
- `PUT /api/sections/:id` - Update section by ID
- `DELETE /api/sections/:id` - Delete section by ID
- `POST /api/sections/bulk` - Bulk create/update sections

### Section Names (matching frontend structure)

- `about` - About page sections
- `contact` - Contact page sections
- `footer` - Footer content
- `general-info` - General information
- `header` - Header content
- `news` - News sections
- `our_work` - Our work sections
- `services` - Services sections
- `team` - Team sections
- `webpage` - Webpage settings

## Data Structure

Each section has the following structure:

```json
{
  "sectionName": "about", // Main section name
  "subsectionName": "section1", // Subsection name (default: "main")
  "title": "About Us", // Section title
  "content": "Content here...", // Section content
  "data": {}, // Additional custom data
  "isActive": true, // Whether section is active
  "order": 1, // Display order
  "lastUpdated": "2025-06-17T..." // Last update timestamp
}
```

## Example Usage

### Create/Update a section:

```bash
curl -X POST http://localhost:5000/api/sections \
  -H "Content-Type: application/json" \
  -d '{
    "sectionName": "about",
    "subsectionName": "main",
    "title": "About Our Company",
    "content": "We are a leading technology company...",
    "data": {
      "images": ["logo.png"],
      "links": ["https://example.com"]
    }
  }'
```

### Get all sections:

```bash
curl http://localhost:5000/api/sections
```

### Get specific section:

```bash
curl http://localhost:5000/api/sections/about
```

## Frontend Integration

The backend is designed to work seamlessly with your Next.js frontend. The section names and structure match your frontend sidebar organization:

```
about/
├── main
├── section1
├── section2
└── section3

contact/
├── main
├── section1
└── section2

...and so on
```

## Database Schema

The backend uses a single `Section` model with the following schema:

- Compound unique index on `sectionName` + `subsectionName`
- Timestamps for creation and updates
- Flexible `data` field for custom content
- Order and active status for display control

## No Authentication

This backend is intentionally simple with no authentication layer. All endpoints are publicly accessible for easy frontend integration and testing.
