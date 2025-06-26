#!/bin/bash

# NGINX Upload Optimization Setup Script
# Run this script to optimize your system for fast uploads

echo "🚀 Setting up NGINX upload optimization..."

# Create optimized temp directories
echo "📁 Creating optimized temp directories..."
sudo mkdir -p /tmp/nginx_uploads/1/2/3
sudo mkdir -p /tmp/nginx_uploads_fast/1/2/3

# Set proper permissions for temp directories
echo "🔒 Setting permissions..."
sudo chown -R www-data:www-data /tmp/nginx_uploads*
sudo chmod -R 755 /tmp/nginx_uploads*

# Create the files directory structure
echo "📂 Setting up files directory..."
sudo mkdir -p /var/www/files/uploads
sudo chown -R www-data:www-data /var/www/files
sudo chmod -R 755 /var/www/files

# Optimize system settings for large file uploads
echo "⚙️ Optimizing system settings..."

# Increase file descriptor limits
echo "fs.file-max = 100000" | sudo tee -a /etc/sysctl.conf
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Optimize network settings for uploads
echo "net.core.rmem_default = 262144" | sudo tee -a /etc/sysctl.conf
echo "net.core.rmem_max = 16777216" | sudo tee -a /etc/sysctl.conf
echo "net.core.wmem_default = 262144" | sudo tee -a /etc/sysctl.conf
echo "net.core.wmem_max = 16777216" | sudo tee -a /etc/sysctl.conf

# Apply system settings
sudo sysctl -p

# Test NGINX configuration
echo "🧪 Testing NGINX configuration..."
if sudo nginx -t; then
    echo "✅ NGINX configuration is valid!"
    
    # Reload NGINX with new configuration
    echo "🔄 Reloading NGINX..."
    sudo systemctl reload nginx
    
    echo "🎉 Upload optimization complete!"
    echo ""
    echo "📊 Optimization Summary:"
    echo "   • Maximum file size: 10GB"
    echo "   • Upload buffer: 2MB (massive speed boost)"
    echo "   • Timeout: 1 hour for large files"
    echo "   • Temp directories: Multi-level for efficiency"
    echo "   • Network optimizations: Applied"
    echo ""
    echo "🚀 Your upload speed should now be SIGNIFICANTLY faster!"
    
else
    echo "❌ NGINX configuration has errors. Please check the config file."
    exit 1
fi

# Display status
echo ""
echo "📈 To monitor performance:"
echo "   • Check upload speeds in your application"
echo "   • Visit /status endpoint for server status"
echo "   • Monitor /var/log/nginx/error.log for any issues"
echo ""
echo "🔧 If you still experience slow uploads:"
echo "   1. Check your network bandwidth"
echo "   2. Verify disk I/O speed (use: iostat -x 1)"
echo "   3. Monitor system resources (use: htop)"
