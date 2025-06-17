# Real Dashboard Backend

A comprehensive Node.js/Express backend for a React-based dashboard application that manages website sections with real-time preview functionality.

## 🚀 Features

- **CRUD Operations** for website sections and configuration
- **Real-time Updates** via Socket.io
- **User Authentication** with JWT tokens
- **Role-based Authorization** (Admin, Editor, Viewer)
- **File Upload** with validation and security
- **MongoDB Integration** with Mongoose ODM
- **Input Validation** with Joi schemas
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **Error Handling** and logging
- **Database Seeding** with sample data

## 🛠️ Technology Stack

- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **File Upload**: Multer
- **Real-time**: Socket.io
- **Security**: Helmet, CORS, express-rate-limit
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## 📁 Project Structure

```
back_end/
├── models/                 # Database models
│   ├── Section.js         # Website section model
│   ├── Config.js          # Site configuration model
│   └── User.js            # User model with authentication
├── routes/                # API route handlers
│   ├── sections.js        # Section CRUD operations
│   ├── config.js          # Configuration management
│   ├── upload.js          # File upload handling
│   └── auth.js            # Authentication endpoints
├── middleware/            # Custom middleware
│   ├── auth.js            # JWT authentication & authorization
│   └── validation.js      # Request validation with Joi
├── utils/                 # Utility functions
│   ├── helpers.js         # Common helper functions
│   └── seeder.js          # Database seeding script
├── uploads/               # File upload directory
├── server.js              # Main application entry point
├── package.json           # Dependencies and scripts
└── .env                   # Environment variables
```

## 🔧 Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file with:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://bolro:bolro@cluster0.d7d3a0d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Database Setup**
   ```bash
   # Seed the database with sample data
   node utils/seeder.js
   ```

4. **Start the Server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-token` - Verify JWT token

### Sections
- `GET /api/sections/:pageType` - Get all sections for a page
- `GET /api/sections/:pageType/:sectionType` - Get specific section
- `POST /api/sections/:pageType/:sectionType` - Create new section
- `PUT /api/sections/:pageType/:sectionType` - Update section
- `DELETE /api/sections/:pageType/:sectionType` - Delete section
- `PATCH /api/sections/:pageType/:sectionType/toggle` - Toggle section status
- `POST /api/sections/bulk/update-order` - Bulk update section order

### Configuration
- `GET /api/config` - Get site configuration
- `PUT /api/config` - Update site configuration

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `GET /api/upload/files` - List uploaded files
- `DELETE /api/upload/:filename` - Delete uploaded file

## 📋 Database Models

### Section Model
Supports various content types:
- **Projects**: Portfolio items with categories and tags
- **Services**: Service offerings with features and pricing
- **Team**: Team member profiles with social links
- **Statistics**: Numerical data with labels
- **Accordion**: FAQ-style expandable content
- **Layout Settings**: Responsive layout configurations

### User Model
- Email/password authentication
- Role-based permissions (admin, editor, viewer)
- Profile information and avatar
- Last login tracking

### Config Model
- Site metadata and SEO settings
- Contact information and social links
- Theme customization
- Header/footer configuration
- Feature toggles

## 🔐 Authentication & Authorization

### JWT Authentication
- Secure token-based authentication
- Configurable token expiration
- Refresh token support

### Role-based Permissions
- **Admin**: Full access to all operations
- **Editor**: Read/write access to content
- **Viewer**: Read-only access

### Protected Routes
All modification endpoints require authentication:
- Section creation, update, deletion
- Configuration changes
- File uploads
- User profile updates

## 🔄 Real-time Features

### Socket.io Integration
- Live preview updates when sections are modified
- Real-time notifications for content changes
- Room-based broadcasting for specific page sections

### Events
- `section-created`: New section added
- `section-updated`: Section content modified
- `section-deleted`: Section removed
- `section-toggled`: Section status changed
- `config-updated`: Site configuration changed

## 📁 File Upload

### Supported Formats
- Images: JPG, PNG, GIF, WebP, SVG
- Maximum file size: 10MB
- Automatic filename generation to prevent conflicts

### Security Features
- File type validation
- Size limitations
- Secure file storage in uploads directory
- Protected routes requiring authentication

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcryptjs encryption
- **JWT Security**: Secure token handling
- **File Upload Security**: Type and size validation

## 🔍 Testing

### API Testing with cURL

1. **Login and get token:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@realdashboard.com", "password": "admin123"}'
   ```

2. **Create a section:**
   ```bash
   curl -X POST http://localhost:5000/api/sections/header/section1 \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"title": "Header", "description": "Site header"}'
   ```

3. **Upload a file:**
   ```bash
   curl -X POST http://localhost:5000/api/upload/single \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "file=@image.jpg"
   ```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=your-frontend-domain
```

### Security Considerations
- Use strong JWT secrets in production
- Enable HTTPS
- Set up proper MongoDB security
- Configure firewall rules
- Regular security updates

## 📊 Database Schema

### Valid Enum Values

**Page Types:**
- `our_work`
- `about`
- `services`
- `contact`
- `team`
- `news`
- `header`
- `footer`
- `general-info`

**Section Types:**
- `section1`
- `section2`
- `section3`
- `section4`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.
