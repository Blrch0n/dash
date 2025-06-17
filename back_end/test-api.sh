#!/bin/bash

# Real Dashboard Backend API Testing Script
# Make sure the server is running on http://localhost:5000

BASE_URL="http://localhost:5000/api"
TOKEN=""

echo "🧪 Real Dashboard Backend API Test Suite"
echo "========================================"

# Function to extract token from login response
extract_token() {
    echo "$1" | grep -o '"token":"[^"]*"' | cut -d'"' -f4
}

# Test 1: User Login
echo "📝 Test 1: User Login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@realdashboard.com", "password": "admin123"}')

echo "Response: $LOGIN_RESPONSE"

# Extract token for subsequent requests
TOKEN=$(extract_token "$LOGIN_RESPONSE")
if [ -n "$TOKEN" ]; then
    echo "✅ Login successful, token extracted"
else
    echo "❌ Login failed, cannot continue with authenticated tests"
    exit 1
fi

echo ""

# Test 2: Get Sections
echo "📄 Test 2: Get Our Work Sections"
curl -s -X GET "$BASE_URL/sections/our_work" | jq '.' 2>/dev/null || echo "Response received (jq not installed for pretty printing)"
echo ""

# Test 3: Get Configuration
echo "⚙️ Test 3: Get Site Configuration"
curl -s -X GET "$BASE_URL/config" | jq '.' 2>/dev/null || echo "Response received (jq not installed for pretty printing)"
echo ""

# Test 4: Create Section (requires auth)
echo "➕ Test 4: Create New Section"
curl -s -X POST "$BASE_URL/sections/general-info/section1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Test Section", "subtitle": "Created by API test", "description": "This is a test section created by the API testing script"}' | jq '.' 2>/dev/null || echo "Response received"
echo ""

# Test 5: Update Section (requires auth)
echo "📝 Test 5: Update Section"
curl -s -X PUT "$BASE_URL/sections/general-info/section1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Updated Test Section", "subtitle": "Modified by API test", "description": "This section has been updated via the API"}' | jq '.' 2>/dev/null || echo "Response received"
echo ""

# Test 6: Toggle Section Status (requires auth)
echo "🔄 Test 6: Toggle Section Status"
curl -s -X PATCH "$BASE_URL/sections/general-info/section1/toggle" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "Response received"
echo ""

# Test 7: Get User Profile (requires auth)
echo "👤 Test 7: Get User Profile"
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "Response received"
echo ""

# Test 8: Create Test File and Upload
echo "📁 Test 8: File Upload"
echo '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="20" fill="green"/></svg>' > test-upload.svg
curl -s -X POST "$BASE_URL/upload/single" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test-upload.svg" | jq '.' 2>/dev/null || echo "Response received"
rm -f test-upload.svg
echo ""

# Test 9: List Files (requires auth)
echo "📋 Test 9: List Uploaded Files"
curl -s -X GET "$BASE_URL/upload/files" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "Response received"
echo ""

# Test 10: Error Handling - Invalid Route
echo "❌ Test 10: Error Handling - Invalid Route"
curl -s -X GET "$BASE_URL/invalid/route" | jq '.' 2>/dev/null || echo "Response received"
echo ""

# Test 11: Error Handling - Unauthorized Access
echo "🔒 Test 11: Error Handling - Unauthorized Access"
curl -s -X POST "$BASE_URL/sections/test/test" \
  -H "Content-Type: application/json" \
  -d '{"title": "Should Fail"}' | jq '.' 2>/dev/null || echo "Response received"
echo ""

echo "✅ API Testing Complete!"
echo "💡 Note: Install 'jq' for prettier JSON output: sudo apt-get install jq"
