// File Server API Test Script
// This script tests the file server functionality

const API_BASE = "http://localhost:5000/api";

console.log("🧪 Testing File Server API...\n");

// Test 1: Health Check
async function testHealthCheck() {
  console.log("1. Testing Health Check...");
  try {
    const response = await fetch(`${API_BASE}/files/health`);
    const data = await response.json();
    console.log("✅ Health Check Response:", data);
    return data.success;
  } catch (error) {
    console.log("❌ Health Check Failed:", error.message);
    return false;
  }
}

// Test 2: File URL Generation
async function testFileUrl() {
  console.log("\n2. Testing File URL Generation...");
  try {
    const response = await fetch(`${API_BASE}/files/url/test-file.txt`);
    const data = await response.json();
    console.log("✅ File URL Response:", data);
    return data.success;
  } catch (error) {
    console.log("❌ File URL Test Failed:", error.message);
    return false;
  }
}

// Test 3: Test Authentication Required Endpoints
async function testAuthEndpoints() {
  console.log("\n3. Testing Authentication Required Endpoints...");

  // Test upload without auth (should fail)
  try {
    const formData = new FormData();
    const blob = new Blob(["test content"], { type: "text/plain" });
    formData.append("file", blob, "test.txt");

    const response = await fetch(`${API_BASE}/files/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.status === 401) {
      console.log("✅ Upload Auth Check: Correctly requires authentication");
      return true;
    } else {
      console.log("❌ Upload Auth Check: Should require authentication");
      return false;
    }
  } catch (error) {
    console.log("❌ Upload Auth Test Failed:", error.message);
    return false;
  }
}

// Test 4: Backend API Structure
async function testApiStructure() {
  console.log("\n4. Testing API Structure...");
  try {
    const response = await fetch(`${API_BASE.replace("/api", "")}/`);
    const data = await response.json();
    console.log("✅ API Structure:", data.message);
    console.log("📝 Available Endpoints:");
    data.availableEndpoints.forEach((endpoint) => {
      console.log(`   ${endpoint}`);
    });
    return true;
  } catch (error) {
    console.log("❌ API Structure Test Failed:", error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log("📋 File Server Integration Test Report");
  console.log("=====================================\n");

  const results = {
    healthCheck: await testHealthCheck(),
    fileUrl: await testFileUrl(),
    authEndpoints: await testAuthEndpoints(),
    apiStructure: await testApiStructure(),
  };

  console.log("\n📊 Test Results Summary:");
  console.log("========================");
  Object.entries(results).forEach(([test, passed]) => {
    console.log(
      `${passed ? "✅" : "❌"} ${test}: ${passed ? "PASSED" : "FAILED"}`
    );
  });

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;

  console.log(`\n🏆 Overall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log(
      "🎉 All tests passed! File server integration is working correctly."
    );
  } else {
    console.log("⚠️  Some tests failed. Check the file server configuration.");
  }

  console.log("\n💡 Next Steps:");
  console.log("- Configure your NGINX server with WebDAV");
  console.log("- Set up CloudFlare tunnel");
  console.log("- Update FILE_SERVER_BASE in .env");
  console.log("- Test file upload/download in the web interface");
}

// For Node.js environment
if (typeof window === "undefined") {
  // Install fetch if in Node.js
  const { fetch } = require("undici");
  globalThis.fetch = fetch;
  globalThis.FormData = require("formdata-node").FormData;
  globalThis.Blob = require("node:buffer").Blob;

  runTests().catch(console.error);
} else {
  // For browser environment
  window.testFileServer = runTests;
  console.log("💻 Run testFileServer() in browser console to test the API");
}
