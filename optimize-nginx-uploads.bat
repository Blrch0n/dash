@echo off
REM NGINX Upload Optimization Setup Script for Windows
REM Run this script as Administrator to optimize your system for fast uploads

echo 🚀 Setting up NGINX upload optimization for Windows...

REM Create optimized temp directories
echo 📁 Creating optimized temp directories...
if not exist "C:\temp\nginx_uploads\1\2\3" mkdir "C:\temp\nginx_uploads\1\2\3"
if not exist "C:\temp\nginx_uploads_fast\1\2\3" mkdir "C:\temp\nginx_uploads_fast\1\2\3"

REM Create the files directory structure
echo 📂 Setting up files directory...
if not exist "C:\www\files\uploads" mkdir "C:\www\files\uploads"

echo ⚙️ Manual steps required for Windows:

echo.
echo 📝 NGINX Configuration Updates:
echo    1. Copy the updated nginx-file-server.conf to your NGINX config directory
echo    2. Update the paths in the config file:
echo       • Change /tmp/nginx_uploads to C:\temp\nginx_uploads
echo       • Change /var/www/files to C:\www\files
echo       • Update paths as needed for your Windows setup

echo.
echo 🔧 Windows-specific NGINX config adjustments:
echo worker_processes auto;
echo events {
echo     worker_connections 1024;
echo     # Remove 'use epoll;' line for Windows
echo }
echo.
echo http {
echo     # ... existing config ...
echo     client_body_temp_path C:/temp/nginx_uploads 1 2;
echo     # ... rest of config ...
echo }

echo.
echo 📊 Expected Performance Improvements:
echo    • Maximum file size: 10GB
echo    • Upload buffer: 2MB (massive speed boost)
echo    • Timeout: 1 hour for large files
echo    • Optimized for Windows file system

echo.
echo 🚀 After updating your NGINX config:
echo    1. Test config: nginx -t
echo    2. Reload NGINX: nginx -s reload
echo    3. Your upload speed should be SIGNIFICANTLY faster!

echo.
echo 📈 To monitor performance:
echo    • Check upload speeds in your application
echo    • Visit /status endpoint for server status
echo    • Monitor NGINX error logs

echo.
echo 🔧 If you still experience slow uploads:
echo    1. Check your network bandwidth
echo    2. Verify disk I/O speed
echo    3. Monitor system resources
echo    4. Consider using SSD storage for temp directories

pause
