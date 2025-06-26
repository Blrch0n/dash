# File Storage System Documentation

## Overview

The File Storage System is a new feature that allows you to download and manage files from your remote file server to local storage on your backend server. This provides better control, faster access, and backup capabilities for your files.

## Features

### 🔄 **File Synchronization**

- Download files from your file server to local storage
- Batch download multiple files
- Full synchronization of all server files
- Progress tracking during sync operations

### 📁 **Local File Management**

- View all stored files with metadata
- Search through stored files
- Download files from local storage
- Delete files from local storage
- File integrity verification

### 📊 **Storage Analytics**

- Storage statistics (total files, total size)
- Last sync timestamp
- File metadata tracking
- Storage directory information

### 🔍 **File Discovery**

- List files available on the file server
- Compare server files with local storage
- Identify missing files

## API Endpoints

### Storage Statistics

```http
GET /api/storage/stats
Authorization: Bearer <token>
```

### Get All Stored Files

```http
GET /api/storage/files
Authorization: Bearer <token>
```

### Search Stored Files

```http
GET /api/storage/search?query=filename&type=image&size_min=1000&size_max=5000000
Authorization: Bearer <token>
```

### Get File Server File List

```http
GET /api/storage/server/files
Authorization: Bearer <token>
```

### Download Single File to Storage

```http
POST /api/storage/download
Authorization: Bearer <token>
Content-Type: application/json

{
  "filename": "example.jpg"
}
```

### Download Multiple Files (Batch)

```http
POST /api/storage/download/batch
Authorization: Bearer <token>
Content-Type: application/json

{
  "filenames": ["file1.jpg", "file2.pdf", "file3.mp4"],
  "concurrency": 3
}
```

### Sync All Files

```http
POST /api/storage/sync
Authorization: Bearer <token>
Content-Type: application/json

{
  "concurrency": 3
}
```

### Get Specific File Metadata

```http
GET /api/storage/files/{filename}
Authorization: Bearer <token>
```

### Download File from Storage

```http
GET /api/storage/files/{filename}/download
Authorization: Bearer <token>
```

### Verify File Integrity

```http
GET /api/storage/files/{filename}/verify
Authorization: Bearer <token>
```

### Delete File from Storage

```http
DELETE /api/storage/files/{filename}
Authorization: Bearer <token>
```

### Clear All Storage

```http
DELETE /api/storage/clear
Authorization: Bearer <token>
```

## Frontend Usage

### Accessing the File Storage Manager

1. **Navigate to File Storage**: Use the sidebar menu to access "File Storage"
2. **View Storage Stats**: See total files, size, and last sync information
3. **Browse Stored Files**: View all files currently in local storage
4. **Search Files**: Use the search box to find specific files
5. **Server Files Tab**: View files available on the remote server
6. **Sync Operations**: Download individual files or sync all files

### Key Operations

#### Syncing Files

- Click "Sync All Files" to download all files from the server
- Monitor progress with the sync progress indicator
- Files are downloaded with concurrent processing for efficiency

#### Managing Files

- **Download**: Click "Download" to get a file from local storage
- **Delete**: Remove files from local storage (does not affect server)
- **Verify**: Check file integrity using SHA-256 hash verification

#### Server File Management

- Switch to "Server Files" tab to see remote files
- Download individual files to local storage
- Files already in storage are marked with a green checkmark

## Storage Structure

### Local Storage Directory

```
back_end/storage/
├── metadata.json          # File metadata and tracking
├── file1.jpg             # Actual stored files
├── file2.pdf
└── ...
```

### Metadata Format

```json
{
  "files": {
    "filename.jpg": {
      "filename": "filename.jpg",
      "originalName": "filename.jpg",
      "size": 1024000,
      "mimetype": "image/jpeg",
      "downloadedAt": "2025-06-24T10:30:00.000Z",
      "localPath": "/absolute/path/to/storage/filename.jpg",
      "hash": "sha256hash...",
      "url": "https://server.com/files/filename.jpg"
    }
  },
  "lastSync": "2025-06-24T10:30:00.000Z",
  "totalFiles": 1,
  "totalSize": 1024000
}
```

## Configuration

### Environment Variables

The system uses your existing file server configuration:

```env
# Your existing file server base URL
FILE_SERVER_BASE=https://your-cloudflare-tunnel.trycloudflare.com
```

### Storage Settings

- **Default Storage Location**: `back_end/storage/`
- **Metadata File**: `back_end/storage/metadata.json`
- **Concurrent Downloads**: 3 (configurable)
- **File Hash Algorithm**: SHA-256

## Error Handling

### Common Errors

1. **File server not configured**: Ensure `FILE_SERVER_BASE` is set
2. **File not found**: File may have been deleted from the server
3. **Storage permission issues**: Check write permissions for storage directory
4. **Network timeouts**: Large files may timeout (60s default)
5. **Hash mismatch**: File corruption detected during integrity check

### Recovery Steps

1. **Clear corrupted storage**: Use the "Clear Storage" function
2. **Re-sync files**: Run full sync operation
3. **Individual file recovery**: Download specific files manually
4. **Check server connectivity**: Verify file server is accessible

## Best Practices

### Performance

- Use batch downloads for multiple files
- Set appropriate concurrency levels (2-5 recommended)
- Monitor storage space on your server
- Regular integrity checks for critical files

### Security

- File storage requires authentication
- Files are stored with original permissions
- Hash verification ensures file integrity
- Local files are not publicly accessible

### Maintenance

- Periodic cleanup of unused files
- Monitor storage growth
- Regular sync operations for new files
- Backup metadata.json file

## Troubleshooting

### Sync Issues

1. Check file server connectivity
2. Verify authentication tokens
3. Check storage directory permissions
4. Review network timeouts

### File Access Issues

1. Verify file exists in metadata
2. Check local file permissions
3. Validate file integrity
4. Re-download corrupted files

### Performance Issues

1. Reduce concurrency levels
2. Check available disk space
3. Monitor network bandwidth
4. Implement file size limits

## Future Enhancements

- [ ] Automatic background sync scheduling
- [ ] File compression options
- [ ] Storage quotas and limits
- [ ] File versioning support
- [ ] Encrypted storage options
- [ ] Multi-server support
- [ ] Advanced search filters
- [ ] File preview capabilities
