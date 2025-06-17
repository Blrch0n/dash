# Dashboard Backend

A simple Express.js backend for managing dashboard sections without authentication.

## Features

- ✅ Simple REST API for section management
- ✅ MongoDB integration with Mongoose
- ✅ CORS enabled for frontend integration
- ✅ Data structure matches frontend sidebar sections
- ✅ No authentication required
- ✅ Bulk operations support

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   # .env file is already configured with defaults
   MONGODB_URI=mongodb://localhost:27017/dashboard
   PORT=5000
   ```

3. **Start MongoDB (if using local instance):**

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

### Health Check

- `GET /api/health` - Check if the server is running

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
