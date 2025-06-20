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
- `POST /api/sections` - Create new section (Admin only)
- `PUT /api/sections/:id` - Update section (Admin only)
- `DELETE /api/sections/:id` - Delete section (Admin only)

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
