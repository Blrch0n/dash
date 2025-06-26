# 🔧 NGINX Configuration for File Server with Directory Listing

## ❌ Problem

You're getting **401 Unauthorized** errors when trying to access `/api/storage/server/files` because:

1. **NGINX doesn't have directory listing enabled** (`autoindex on;`)
2. **The uploads directory may not allow GET requests**
3. **CORS headers might be missing**

## ✅ Solution

### 1. Complete NGINX Configuration

Replace your current NGINX configuration with this complete setup:

```nginx
server {
    listen 80;
    server_name your-server.com;  # Replace with your domain or IP

    # Global settings for large file uploads
    client_max_body_size 100M;
    client_body_timeout 300s;
    client_header_timeout 300s;
    client_body_buffer_size 128k;
    large_client_header_buffers 4 16k;

    # CORS headers for all locations
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Credentials true;

    # Root location for health checks
    location / {
        return 200 "NGINX File Server is running";
        add_header Content-Type text/plain;
    }

    # Health check endpoint
    location /health {
        return 200 "OK";
        add_header Content-Type text/plain;
    }

    # 🔧 CRITICAL: WebDAV uploads location with directory listing
    location /uploads/ {
        root /var/www/files;

        # WebDAV configuration for uploads
        dav_methods PUT DELETE;
        dav_ext_methods PROPFIND MKCOL COPY MOVE;
        dav_access user:rw group:rw all:r;
        create_full_put_path on;

        # File upload limits
        client_max_body_size 100M;
        client_body_timeout 300s;
        client_body_temp_path /tmp/nginx_uploads;

        # 🚨 CRITICAL: Enable directory listing for API access
        autoindex on;
        autoindex_exact_size off;
        autoindex_format html;
        autoindex_localtime on;

        # CORS headers - CRITICAL for browser access
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
        add_header Access-Control-Allow-Credentials true;

        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
            add_header Access-Control-Max-Age 86400;
            return 204;
        }
    }

    # Static file serving with directory listing (alternative access)
    location /files/ {
        alias /var/www/files/uploads/;

        # 🚨 CRITICAL: Enable directory listing
        autoindex on;
        autoindex_exact_size off;
        autoindex_format html;
        autoindex_localtime on;

        # CORS headers for file access
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
        add_header Access-Control-Allow-Credentials true;

        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
            return 204;
        }

        # Security headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";

        # Caching for static files
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. Apply the Configuration

```bash
# Save the config to your NGINX sites directory
sudo nano /etc/nginx/sites-available/file-server

# Enable the site (if using sites-available/sites-enabled)
sudo ln -sf /etc/nginx/sites-available/file-server /etc/nginx/sites-enabled/

# Or if using nginx.conf directly, replace the server block

# Test the configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx
# OR
sudo service nginx reload
```

### 3. Create Required Directories

```bash
# Create the uploads directory
sudo mkdir -p /var/www/files/uploads

# Create temp directory for uploads
sudo mkdir -p /tmp/nginx_uploads

# Set proper permissions
sudo chown -R www-data:www-data /var/www/files
sudo chown -R www-data:www-data /tmp/nginx_uploads
sudo chmod -R 755 /var/www/files
sudo chmod -R 755 /tmp/nginx_uploads
```

### 4. Test the Configuration

After applying the config, test these URLs:

```bash
# Test health check
curl https://your-server.com/health

# Test directory listing (should show HTML directory listing)
curl https://your-server.com/uploads/

# Test alternative directory listing
curl https://your-server.com/files/
```

## 🔍 Testing Your Setup

### 1. Upload a Test File

```bash
# Upload a test file
curl -X PUT "https://your-server.com/uploads/test.txt" \
  -H "Content-Type: text/plain" \
  -d "Hello World"
```

### 2. Verify Directory Listing

```bash
# Check if autoindex works
curl -s "https://your-server.com/uploads/" | grep "test.txt"
```

### 3. Download the File

```bash
# Download the file
curl "https://your-server.com/uploads/test.txt"
```

## 🚨 Critical Points

1. **`autoindex on;`** - This is ESSENTIAL for your backend to list files
2. **CORS headers** - Required for browser access from your frontend
3. **Both GET and PUT methods** - Uploads location must allow both
4. **Proper permissions** - www-data must own the directories

## 🔧 Troubleshooting

### If you still get 401 errors:

1. **Check authentication in your app** - Make sure user is logged in
2. **Verify token is valid** - Check browser developer tools
3. **Test NGINX directly** - Try the curl commands above
4. **Check NGINX error logs** - `sudo tail -f /var/log/nginx/error.log`

### If autoindex doesn't work:

1. **Verify NGINX modules** - `nginx -V` should show `--with-http_dav_module`
2. **Check directory permissions** - `ls -la /var/www/files/`
3. **Test with simple file** - Upload and list a test file

### If CORS errors occur:

1. **Check browser console** - Look for CORS-related errors
2. **Verify headers** - Use browser dev tools Network tab
3. **Test OPTIONS request** - `curl -X OPTIONS https://your-server.com/uploads/`

## 📝 What This Fixes

✅ Enables directory listing with `autoindex on;`
✅ Allows GET requests to `/uploads/` directory  
✅ Adds proper CORS headers for browser access
✅ Handles OPTIONS preflight requests
✅ Sets up both WebDAV upload and static file serving
✅ Configures proper file size limits
✅ Adds security headers

Your backend should now be able to successfully call `listUploadedFiles()` and parse the NGINX autoindex HTML response.
