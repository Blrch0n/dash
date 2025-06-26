#!/bin/bash

# NGINX Upload Performance Diagnostic Script
# This script helps identify current performance bottlenecks

echo "🔍 NGINX Upload Performance Diagnostic"
echo "======================================"

# Check NGINX status
echo "📊 NGINX Status:"
if systemctl is-active --quiet nginx; then
    echo "   ✅ NGINX is running"
else
    echo "   ❌ NGINX is not running"
fi

# Check current NGINX configuration
echo ""
echo "⚙️ Current NGINX Configuration Analysis:"

# Check for critical settings
echo "   📋 Checking critical upload settings..."

if nginx -T 2>/dev/null | grep -q "client_max_body_size"; then
    MAX_SIZE=$(nginx -T 2>/dev/null | grep "client_max_body_size" | tail -1 | awk '{print $2}' | sed 's/;//')
    echo "   • Max body size: $MAX_SIZE"
else
    echo "   ⚠️ client_max_body_size not configured (default: 1m)"
fi

if nginx -T 2>/dev/null | grep -q "client_body_timeout"; then
    TIMEOUT=$(nginx -T 2>/dev/null | grep "client_body_timeout" | tail -1 | awk '{print $2}' | sed 's/;//')
    echo "   • Body timeout: $TIMEOUT"
else
    echo "   ⚠️ client_body_timeout not configured (default: 60s)"
fi

if nginx -T 2>/dev/null | grep -q "client_body_buffer_size"; then
    BUFFER=$(nginx -T 2>/dev/null | grep "client_body_buffer_size" | tail -1 | awk '{print $2}' | sed 's/;//')
    echo "   • Body buffer size: $BUFFER"
else
    echo "   ⚠️ client_body_buffer_size not configured (default: 8k/16k)"
fi

# Check temp directory
echo ""
echo "📁 Temp Directory Analysis:"
TEMP_PATHS=$(nginx -T 2>/dev/null | grep "client_body_temp_path" | awk '{print $2}' | sed 's/;//')
if [ -n "$TEMP_PATHS" ]; then
    for path in $TEMP_PATHS; do
        if [ -d "$path" ]; then
            SPACE=$(df -h "$path" | tail -1 | awk '{print $4}')
            echo "   ✅ $path exists (Available: $SPACE)"
        else
            echo "   ❌ $path does not exist"
        fi
    done
else
    echo "   ⚠️ No custom temp path configured (using default)"
fi

# Check system resources
echo ""
echo "💻 System Resource Analysis:"

# Memory
FREE_MEM=$(free -h | grep '^Mem:' | awk '{print $7}')
echo "   • Available memory: $FREE_MEM"

# Disk I/O
if command -v iostat &> /dev/null; then
    echo "   • Disk I/O performance:"
    iostat -x 1 1 | grep -E "Device|[a-z]" | tail -2
else
    echo "   ⚠️ iostat not available (install sysstat package)"
fi

# Network
echo ""
echo "🌐 Network Analysis:"
if command -v ss &> /dev/null; then
    NGINX_CONNECTIONS=$(ss -tuln | grep :80 | wc -l)
    echo "   • NGINX connections on port 80: $NGINX_CONNECTIONS"
fi

# Performance recommendations
echo ""
echo "🚀 Performance Recommendations:"
echo "================================"

# Check if optimizations are applied
OPTIMIZED=true

if ! nginx -T 2>/dev/null | grep -q "client_max_body_size.*[0-9]G"; then
    echo "   🔧 Increase client_max_body_size to at least 1G for large files"
    OPTIMIZED=false
fi

if ! nginx -T 2>/dev/null | grep -q "client_body_buffer_size.*[0-9]M"; then
    echo "   🔧 Increase client_body_buffer_size to 1M or 2M for faster uploads"
    OPTIMIZED=false
fi

if ! nginx -T 2>/dev/null | grep -q "client_body_timeout.*[0-9][0-9][0-9]"; then
    echo "   🔧 Increase client_body_timeout for large file uploads"
    OPTIMIZED=false
fi

if ! nginx -T 2>/dev/null | grep -q "client_body_in_file_only"; then
    echo "   🔧 Enable client_body_in_file_only for memory efficiency"
    OPTIMIZED=false
fi

if $OPTIMIZED; then
    echo "   ✅ Basic optimizations appear to be in place!"
    echo "   💡 If uploads are still slow, consider:"
    echo "      • Using SSD storage for temp directories"
    echo "      • Implementing chunked uploads for very large files"
    echo "      • Checking network bandwidth and latency"
else
    echo "   📝 Apply the recommended optimizations above"
fi

echo ""
echo "🧪 Quick Upload Test:"
echo "   Run this command to test upload speed:"
echo "   curl -X PUT -T /path/to/testfile.txt http://your-server/uploads/testfile.txt"

echo ""
echo "📋 Diagnostic Complete!"
echo "   Review the recommendations above to improve upload performance."
