# NGINX File Server with CloudFlare Integration

This project integrates an NGINX file server with CloudFlare tunnels for secure, scalable file storage and delivery.

## Features

- **File Upload**: Single and multiple file uploads via modern drag-and-drop interface
- **File Download**: Direct file access through proxy endpoints
- **File Management**: Delete files and manage uploads
- **Health Monitoring**: Real-time file server status monitoring
- **Security**: Authentication required for uploads/deletions
- **Modern UI**: Beautiful, responsive interface built with Next.js

## Backend Setup

### 1. Environment Configuration

Add the following to your `.env` file:

```bash
# NGINX File Server Configuration
FILE_SERVER_BASE=https://your-cloudflare-tunnel.trycloudflare.com
```

### 2. Dependencies

The following packages are already installed:

- `axios` - For HTTP requests to NGINX server
- `multer` - For handling multipart form uploads
- `express` - Web framework

### 3. API Endpoints

#### File Server Health

- **GET** `/api/files/health` - Check file server status

#### File Operations

- **GET** `/api/files/:filename` - Download file (proxy from NGINX)
- **POST** `/api/files/upload` - Upload single file (requires auth)
- **POST** `/api/files/upload/multiple` - Upload multiple files (requires auth)
- **DELETE** `/api/files/:filename` - Delete file (requires auth)
- **GET** `/api/files/url/:filename` - Get public URL for file

## Frontend Components

### FileUpload Component

Modern file upload component with:

- Drag and drop functionality
- File validation
- Upload progress
- Error handling
- Multiple file support

```jsx
import FileUpload from "../components/FileUpload";

<FileUpload
  onFileUploaded={handleFileUploaded}
  multiple={true}
  accept="*/*"
  maxFiles={10}
  maxFileSize={50 * 1024 * 1024} // 50MB
/>;
```

### FileServerStatus Component

Real-time status monitoring:

- Health check every 30 seconds
- Visual status indicators
- Manual refresh capability

```jsx
import FileServerStatus from "../components/FileServerStatus";

<FileServerStatus />;
```

## NGINX Configuration

### WebDAV Setup

Configure your NGINX server with WebDAV support:

```nginx
server {
    listen 80;
    server_name your-server.com;

    location /uploads/ {
        root /var/www/files;

        # WebDAV configuration
        dav_methods PUT DELETE;
        dav_ext_methods PROPFIND MKCOL COPY MOVE;
        dav_access user:rw group:rw all:r;

        # Create directories automatically
        create_full_put_path on;

        # Client body temp path
        client_body_temp_path /tmp/nginx_uploads;
        client_max_body_size 50M;
    }

    location /files/ {
        alias /var/www/files/uploads/;

        # CORS headers for file access
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";

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

### CloudFlare Tunnel

1. Install cloudflared:

```bash
# Download and install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
```

2. Authenticate with CloudFlare:

```bash
cloudflared tunnel login
```

3. Create a tunnel:

```bash
cloudflared tunnel create file-server
```

4. Configure the tunnel:

```yaml
# ~/.cloudflared/config.yml
tunnel: file-server
credentials-file: ~/.cloudflared/tunnel-uuid.json

ingress:
  - hostname: your-tunnel-name.trycloudflare.com
    service: http://localhost:80
  - service: http_status:404
```

5. Run the tunnel:

```bash
cloudflared tunnel run file-server
```

Or for quick testing:

```bash
cloudflared tunnel --url http://localhost:80
```

## Usage

### 1. Start the Backend

```bash
cd back_end
npm install
npm run dev
```

### 2. Start the Frontend

```bash
cd front_end
npm install
npm run dev
```

### 3. Access the File Server Demo

Navigate to `http://localhost:3000/file-server` to test the file server functionality.

## File Flow

```
Client Upload → Backend API → NGINX WebDAV → File Storage
Client Download ← Backend Proxy ← NGINX Static ← File Storage
```

## Security Features

- **Authentication**: Upload and delete operations require valid JWT tokens
- **File Validation**: Size limits and type checking
- **Rate Limiting**: Prevents abuse
- **CORS Configuration**: Secure cross-origin requests
- **Error Handling**: Comprehensive error responses

## Error Handling

The system handles various error scenarios:

- File server unavailable
- Network timeouts
- File not found
- Storage full
- Authentication failures
- File validation errors

## Monitoring

- Real-time health checks
- Activity logging
- Error tracking
- Performance metrics

## Troubleshooting

### Common Issues

1. **File server not accessible**

   - Check if NGINX is running
   - Verify CloudFlare tunnel is active
   - Check firewall settings

2. **Upload failures**

   - Verify authentication token
   - Check file size limits
   - Ensure WebDAV is configured

3. **Download issues**
   - Check file permissions
   - Verify CORS headers
   - Check file exists

### Debug Mode

Set `NODE_ENV=development` for detailed logging.

## Performance Optimization

- Use CDN for static files
- Implement file compression
- Set appropriate cache headers
- Use streaming for large files
- Implement file deduplication

## Scalability

The system is designed to handle:

- High upload/download volumes
- Large file sizes (up to 50MB default)
- Multiple concurrent users
- Distributed file storage

## Future Enhancements

- File versioning
- Image thumbnails
- Video transcoding
- File sharing permissions
- Advanced metadata
- Full-text search
- Backup integration
