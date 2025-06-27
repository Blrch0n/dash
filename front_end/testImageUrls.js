// Test script for image URL handling
// Run this with: node testImageUrls.js

const testUrls = [
  // Legacy localhost URLs that need conversion
  "http://localhost:10000/api/uploads/images/1751010344670-934342925--meal_89750.ico",
  "http://localhost:5000/api/uploads/images/1750916556361-406488007-images (3).jfif",

  // Just filenames
  "1751010344670-934342925--meal_89750.ico",
  "1750916556361-406488007-images (3).jfif",

  // Already correct URLs
  "https://dash-1-iefb.onrender.com/api/uploads/images/1751010344670-934342925--meal_89750.ico",
];

// Simulate your getImageUrl function
const API_BASE_URL = "https://dash-1-iefb.onrender.com/api";

function getImageUrl(filename) {
  if (!filename) return null;

  // Handle both absolute URLs (legacy) and relative filenames
  if (filename.startsWith("http")) {
    // If it's already an absolute URL, check if it's localhost and replace if needed
    if (filename.includes("localhost")) {
      // Extract just the filename from the URL
      const filenameOnly = filename.split("/").pop();
      return `${API_BASE_URL}/uploads/images/${filenameOnly}`;
    }
    return filename;
  }
  // If it's just a filename, construct the full URL
  return `${API_BASE_URL}/uploads/images/${filename}`;
}

console.log("Testing Image URL Conversion:");
console.log("============================");

testUrls.forEach((url, index) => {
  const result = getImageUrl(url);
  console.log(`${index + 1}. Input:  ${url}`);
  console.log(`   Output: ${result}`);
  console.log("");
});

console.log("Expected behavior:");
console.log("- Localhost URLs should be converted to your Render domain");
console.log("- Filenames should get the full URL prefix");
console.log("- Already correct URLs should remain unchanged");
