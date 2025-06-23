# 🚨 NGINX Configuration Fix for 413 Error

## Problem

Your video upload is failing with **HTTP 413 "Payload Too Large"** because NGINX has a default file size limit that's smaller than your video file.

## File Details

- **File**: Togtuun - UzesgelenGoo (Lyrics Video).mp4
- **Size**: 7.12 MB (7,123,358 bytes)
- **Type**: video/mp4
- **Status**: ✅ Successfully received by backend, ❌ Rejected by NGINX

## Solution: Update NGINX Configuration

### 1. Edit your NGINX configuration file

**Location**: Usually `/etc/nginx/sites-available/default` or `/etc/nginx/nginx.conf`

### 2. Add/Update these directives:

```nginx
server {
    listen 80;
    server_name your-server.com;

    # 🔧 CRITICAL: Increase client body size limit
    client_max_body_size 100M;        # Allow files up to 100MB
    client_body_timeout 300s;         # 5 minute timeout
    client_header_timeout 300s;       # 5 minute header timeout

    # Optional: Increase buffer sizes for large uploads
    client_body_buffer_size 128k;
    large_client_header_buffers 4 16k;

    location /uploads/ {
        root /var/www/files;

        # WebDAV configuration
        dav_methods PUT DELETE;
        dav_ext_methods PROPFIND MKCOL COPY MOVE;
        dav_access user:rw group:rw all:r;
        create_full_put_path on;

        # 🔧 CRITICAL: Also set for location block
        client_max_body_size 100M;
        client_body_timeout 300s;

        # Temporary file storage
        client_body_temp_path /tmp/nginx_uploads;
    }

    location /files/ {
        alias /var/www/files/uploads/;

        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";

        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
            return 204;
        }
    }
}
```

### 3. Test NGINX configuration

```bash
# Test configuration syntax
sudo nginx -t

# If OK, reload NGINX
sudo systemctl reload nginx
# OR
sudo service nginx reload
```

### 4. Create temp directory (if it doesn't exist)

```bash
sudo mkdir -p /tmp/nginx_uploads
sudo chown www-data:www-data /tmp/nginx_uploads
sudo chmod 755 /tmp/nginx_uploads
```

## Alternative: Global NGINX Configuration

If you want to apply this globally, edit `/etc/nginx/nginx.conf`:

```nginx
http {
    # Global settings
    client_max_body_size 100M;
    client_body_timeout 300s;
    client_header_timeout 300s;

    # ... other settings
}
```

## Quick Verification

After updating NGINX:

1. **Test small file** (should work)
2. **Test your 7MB video** (should now work)
3. **Check NGINX error log** if still failing:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

## Expected Results

✅ **Before**: 413 Payload Too Large  
✅ **After**: Successful upload

Your video should upload successfully once you increase the `client_max_body_size` limit in NGINX! 🎉

## Troubleshooting

If still not working:

1. **Check NGINX error logs**:

   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Verify configuration reload**:

   ```bash
   sudo nginx -s reload
   ```

3. **Test configuration**:
   ```bash
   curl -X PUT -T "small_test_file.txt" http://your-server.com/uploads/test.txt
   ```

The 413 error is a common NGINX limitation, and this fix should resolve it immediately! 🚀
