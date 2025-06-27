# Image URL Fix Summary

## Problem

Images stored with localhost URLs (like `http://localhost:10000/api/uploads/images/1751010344670-934342925--meal_89750.ico`) don't work when the backend is deployed to production.

## Solution Implemented

### 1. Frontend API Updates

- **Updated API_BASE_URL**: Changed from `http://192.168.0.16:5000/api` to `https://dash-1-iefb.onrender.com/api`
- **Added getImageUrl method**: Handles both legacy localhost URLs and filenames
- **Added imageUtils**: Helper functions for image URL management

### 2. Backend Upload Middleware Updates

- **Updated getFileUrl function**: Now uses your deployed domain `https://dash-1-iefb.onrender.com`
- **Environment-aware URL generation**: Automatically handles dev vs production

### 3. Environment Configuration

- **Updated .env.production**: Set to use your Render domain
- **Created .env.development**: For local development

## How to Use

### In Your Components

#### Option 1: Use the ImageDisplay Component

```jsx
import ImageDisplay from "../components/ImageDisplay";

const MyComponent = ({ sectionData }) => {
  return (
    <ImageDisplay
      imageData={sectionData.imageUrl}
      alt="Section image"
      className="w-full h-64 object-cover"
    />
  );
};
```

#### Option 2: Use imageUtils Directly

```jsx
import { imageUtils } from "../services/api";

const MyComponent = ({ sectionData }) => {
  const imageUrl = imageUtils.getImageUrl(sectionData.imageUrl);

  return (
    <img
      src={imageUrl}
      alt="Section image"
      onError={(e) => {
        e.target.src = "/path/to/fallback-image.jpg";
      }}
    />
  );
};
```

#### Option 3: Use api.fileServer.getImageUrl

```jsx
import { api } from "../services/api";

const MyComponent = ({ sectionData }) => {
  return (
    <img
      src={api.fileServer.getImageUrl(sectionData.imageUrl)}
      alt="Section image"
    />
  );
};
```

## What Each Method Handles

### api.fileServer.getImageUrl(filename)

- **Localhost URLs**: Converts `http://localhost:10000/api/...` → `https://dash-1-iefb.onrender.com/api/...`
- **Filenames**: Converts `image.jpg` → `https://dash-1-iefb.onrender.com/api/uploads/images/image.jpg`
- **Correct URLs**: Leaves `https://dash-1-iefb.onrender.com/api/...` unchanged

### imageUtils.getImageUrl(imageData)

- Handles string filenames
- Handles objects with `url` property
- Handles objects with `filename` property
- Returns null for invalid input

### imageUtils.checkImageExists(imageUrl)

- Async function to verify if an image URL is accessible
- Returns true/false

## Environment Variables

### Production (.env.production)

```
NEXT_PUBLIC_API_URL=https://dash-1-iefb.onrender.com/api
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_FILE_SERVER_URL=https://dash-1-iefb.onrender.com/api
```

### Development (.env.development)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_ENV=development
```

## Backend Environment Variable

Make sure to set this in your Render deployment:

```
BACKEND_URL=https://dash-1-iefb.onrender.com
```

## Testing

Run the test script to verify URL conversion:

```bash
cd front_end
node testImageUrls.js
```

## Migration for Existing Data

If you have existing data with localhost URLs in your database, you can run the migration script:

```bash
cd back_end
node utils/migrateImageUrls.js
```

## Files Modified

### Frontend

- `src/services/api.js` - Updated API base URL and added image utilities
- `.env.production` - Updated to use Render domain
- `.env.development` - Created for local development
- `components/ImageDisplay.jsx` - New component with error handling
- `testImageUrls.js` - Test script for URL conversion

### Backend

- `middleware/upload.js` - Updated getFileUrl function
- `utils/migrateImageUrls.js` - Migration script for existing data

## Deployment Checklist

1. ✅ Update frontend API base URL
2. ✅ Update backend getFileUrl function
3. ✅ Set environment variables
4. ✅ Test URL conversion
5. 🔄 Deploy frontend with new configuration
6. 🔄 Set BACKEND_URL environment variable in Render
7. 🔄 Test image loading in production
8. 🔄 Run database migration if needed

## Troubleshooting

### Images Still Not Loading?

1. Check browser developer tools for 404 errors
2. Verify the image files exist in your backend's uploads folder
3. Check CORS settings if images load but with errors
4. Verify environment variables are set correctly

### Mixed Content Errors?

Make sure all URLs use HTTPS in production, not HTTP.

### Legacy Data Issues?

Run the migration script to update old localhost URLs in your database.
