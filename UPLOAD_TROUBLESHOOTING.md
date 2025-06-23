# Video/Audio Upload Troubleshooting Guide

## Changes Made to Fix MP3/Video Upload Issues

### 🔧 Backend Improvements

1. **Increased File Size Limits**:

   - Multer limit: 50MB → 100MB
   - Body parser limit: 50MB → 100MB
   - Express body size: 50MB → 100MB

2. **Dynamic Timeout Calculation**:

   - Base timeout: 60 seconds
   - Additional: +30 seconds per 10MB
   - Example: 50MB file = 210 seconds timeout

3. **Enhanced Error Logging**:

   - Detailed file information logging
   - Upload progress tracking
   - Better error messages

4. **Improved Error Handling**:
   - Timeout detection
   - Connection issues
   - File server availability

### 🎨 Frontend Improvements

1. **Increased File Limits**:

   - Max file size: 50MB → 100MB
   - Better file validation

2. **Dynamic Timeouts**:

   - Automatic timeout calculation based on file size
   - Upload progress tracking

3. **Better Error Messages**:
   - Specific timeout messages
   - Connection status indicators

## Testing Your Setup

### 1. Check Server Status

```bash
curl http://localhost:5000/api/files/health
```

### 2. Monitor Backend Logs

When uploading, watch the server console for detailed logs:

- File details (name, size, type)
- Upload progress
- Error details

### 3. Test Different File Types

- ✅ Small images (< 5MB)
- ✅ Large images (5-20MB)
- ✅ Audio files (5-50MB)
- ✅ Video files (10-100MB)

## Common Issues & Solutions

### 502 Bad Gateway Error

**Possible Causes:**

1. NGINX file server not accessible
2. CloudFlare tunnel down
3. File too large for NGINX
4. Network timeout

**Solutions:**

1. Check NGINX server status
2. Verify CloudFlare tunnel is running
3. Check NGINX file size limits
4. Test with smaller files first

### Upload Timeout

**Possible Causes:**

1. Slow internet connection
2. Large file size
3. Server overload

**Solutions:**

1. Try smaller files
2. Check internet connection
3. Wait and retry during off-peak hours

### File Server Not Configured

**Possible Causes:**

1. Missing FILE_SERVER_BASE in .env
2. Wrong CloudFlare tunnel URL

**Solutions:**

1. Check .env file has: `FILE_SERVER_BASE=https://your-tunnel.trycloudflare.com`
2. Verify tunnel URL is accessible

## NGINX Configuration for Large Files

```nginx
server {
    listen 80;
    server_name your-server.com;

    # Increase client body size for large uploads
    client_max_body_size 100M;
    client_body_timeout 300s;
    client_header_timeout 300s;

    location /uploads/ {
        root /var/www/files;

        # WebDAV configuration
        dav_methods PUT DELETE;
        dav_ext_methods PROPFIND MKCOL COPY MOVE;
        dav_access user:rw group:rw all:r;

        # Create directories automatically
        create_full_put_path on;

        # Client body temp path with sufficient space
        client_body_temp_path /tmp/nginx_uploads;
        client_max_body_size 100M;

        # Increase timeouts for large files
        proxy_connect_timeout       300s;
        proxy_send_timeout          300s;
        proxy_read_timeout          300s;
    }

    location /files/ {
        alias /var/www/files/uploads/;

        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";

        # Optimize for large files
        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;

        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
            return 204;
        }
    }
}
```

## Environment Variables

Make sure your `.env` file contains:

```bash
# File server configuration
FILE_SERVER_BASE=https://your-actual-tunnel.trycloudflare.com

# Backend configuration
PORT=5000
NODE_ENV=development

# Other configurations...
```

## Monitoring Upload Progress

The system now provides detailed logging:

### Backend Logs

```
Uploading file: video.mp4, Size: 52428800 bytes
File read into buffer, buffer size: 52428800 bytes
Upload timeout set to: 180000ms for 50.00MB file
Uploading file to: https://your-tunnel.com/uploads/video.mp4
Upload progress: 25%
Upload progress: 50%
Upload progress: 75%
Upload progress: 100%
File uploaded successfully: video.mp4
```

### Frontend Logs

```
Uploading file: video.mp4, Size: 50.00MB, Timeout: 180000ms
Upload progress: 25%
Upload progress: 50%
Upload progress: 75%
Upload progress: 100%
```

## File Size Recommendations

- **Images**: Up to 20MB
- **Audio**: Up to 50MB
- **Video**: Up to 100MB (consider compression for larger files)

## Next Steps

1. ✅ Test with small files first
2. ✅ Gradually increase file sizes
3. ✅ Monitor server logs during uploads
4. ✅ Check NGINX error logs if issues persist
5. ✅ Verify CloudFlare tunnel stability

Your file server should now handle MP3 and video files successfully! 🎉
