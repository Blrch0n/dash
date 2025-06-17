#!/bin/bash

# Simple API testing script for the dashboard backend
BASE_URL="http://localhost:3001/api"

echo "🚀 Dashboard Backend API Test Script"
echo "====================================="

# Test health endpoint
echo ""
echo "1. Testing Health Endpoint..."
curl -s "$BASE_URL/health" && echo ""

# Test getting all sections
echo ""
echo "2. Getting all sections (first 3)..."
curl -s "$BASE_URL/sections" | head -c 500 && echo "..."

# Test getting specific section
echo ""
echo "3. Getting 'about' sections..."
curl -s "$BASE_URL/sections/about" | head -c 300 && echo "..."

# Test creating a section
echo ""
echo "4. Creating a test section..."
curl -X POST "$BASE_URL/sections" \
  -H "Content-Type: application/json" \
  -d '{
    "sectionName": "test",
    "subsectionName": "api-test",
    "title": "API Test Section",
    "content": "This section was created via API test script",
    "data": {
      "testData": true,
      "createdAt": "'$(date)'"
    }
  }' && echo ""

# Test getting the created section
echo ""
echo "5. Getting the test section we just created..."
curl -s "$BASE_URL/sections/test" && echo ""

echo ""
echo "✅ API tests completed!"
echo ""
echo "Available endpoints:"
echo "  GET    $BASE_URL/health"
echo "  GET    $BASE_URL/sections"
echo "  GET    $BASE_URL/sections/{sectionName}"
echo "  GET    $BASE_URL/sections/{sectionName}/{subsectionName}"
echo "  POST   $BASE_URL/sections"
echo "  PUT    $BASE_URL/sections/{id}"
echo "  DELETE $BASE_URL/sections/{id}"
echo "  POST   $BASE_URL/sections/bulk"