# Dashboard Backend API

## Overview

This is a Node.js/Express backend API for a dashboard application with user authentication and content management.

## Features

- 🔐 JWT Authentication with refresh tokens
- 👥 User management (registration, login, profile)
- 🛡️ Role-based access control (user/admin)
- 📄 Section/content management
- 🔒 Security features (rate limiting, CORS, input validation)
- 📧 Email verification system

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

5. Start the server:

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Sections (Content Management)

- `GET /api/sections` - Get all sections
- `GET /api/sections/:sectionName` - Get specific section
- `GET /api/sections/:sectionName/:subsectionName` - Get specific subsection
- `POST /api/sections` - Create new section (Admin only)
- `PUT /api/sections/:id` - Update section (Admin only)
- `DELETE /api/sections/:id` - Delete section (Admin only)
- `POST /api/sections/bulk` - Bulk update sections (Admin only)
- `POST /api/sections/apply-global-colors` - Apply global colors to all sections (Admin only)
- `POST /api/sections/cleanup-colors` - Clean up duplicate color properties (Admin only)

#### Color Management

The API has been optimized to handle color data efficiently:

- **Colors Object**: All color data should be stored in a `colors` object within the section data
- **Duplicate Prevention**: The API automatically removes duplicate individual color properties when a `colors` object exists
- **Global Colors**: Colors from the `general-info` section are applied globally to other sections

**Example Request Body for Section with Colors:**

```json
{
  "sectionName": "header",
  "subsectionName": "main",
  "title": "Header Configuration",
  "content": "Header section with navigation and logo",
  "data": {
    "labels": ["Home", "About", "Services", "Contact"],
    "image": "http://localhost:5000/api/uploads/images/header.jpg",
    "colors": {
      "primaryColor": "#141414",
      "secondaryColor": "#f10404",
      "accentColor": "#878787",
      "backgroundColor": "#ffffff",
      "textColor": "#517acd",
      "scrolledBgColor": "#cd463c",
      "scrolledTextColor": "#a5eedc",
      "hoverColor": "#3bf906",
      "borderColor": "#E5E7EB"
    }
  }
}
```

**Note**: Individual color properties (e.g., `primaryColor`, `secondaryColor`) at the root level of the `data` object will be automatically removed if a `colors` object is present to prevent duplication.

### Admin

- `GET /api/auth/users` - Get all users (Admin only)

## Security Features

- Helmet.js for security headers
- Rate limiting on auth endpoints
- Input validation and sanitization
- CORS configuration
- Password hashing with bcrypt
- JWT with secure cookies

## Database Schema

### User Model

- firstName, lastName, email, password
- role (user/admin)
- Email verification system
- Refresh token management
- Last login tracking

### Section Model

- sectionName (about, contact, etc.)
- subsectionName (section1, section2, etc.)
- title, content, data (flexible content)
- Active status and ordering

## Environment Variables

See `.env.example` for all required environment variables.

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm run seed:admin` - Create admin user
- `npm run seed:users` - Create sample users
- `npm run seed:all` - Create all sample data
