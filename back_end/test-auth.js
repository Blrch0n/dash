#!/usr/bin/env node

/**
 * Test script for Email Two-Way Authentication
 * This script demonstrates the complete authentication flow
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Test data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'TestPass123',
  confirmPassword: 'TestPass123'
};

async function testRegistration() {
  console.log('🔄 Testing user registration...');
  
  try {
    const response = await axios.post(`${BASE_URL}/register`, testUser);
    console.log('✅ Registration successful:', response.data);
    
    if (response.data.data.previewUrl) {
      console.log('📧 Email preview URL:', response.data.data.previewUrl);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return null;
  }
}

async function testEmailVerification(email, code) {
  console.log('🔄 Testing email verification...');
  
  try {
    const response = await axios.post(`${BASE_URL}/verify-email`, {
      email,
      code
    });
    console.log('✅ Email verification successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Email verification failed:', error.response?.data || error.message);
    return null;
  }
}

async function testLogin(email, password) {
  console.log('🔄 Testing login...');
  
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email,
      password
    });
    console.log('✅ Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
}

async function testLoginVerification(email, code) {
  console.log('🔄 Testing login verification...');
  
  try {
    const response = await axios.post(`${BASE_URL}/verify-login`, {
      email,
      code
    });
    console.log('✅ Login verification successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login verification failed:', error.response?.data || error.message);
    return null;
  }
}

async function testResendVerification(email) {
  console.log('🔄 Testing resend verification...');
  
  try {
    const response = await axios.post(`${BASE_URL}/resend-verification`, {
      email
    });
    console.log('✅ Resend verification successful:', response.data);
    
    if (response.data.data.previewUrl) {
      console.log('📧 Email preview URL:', response.data.data.previewUrl);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Resend verification failed:', error.response?.data || error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Email Two-Way Authentication Tests\n');
  
  // Test 1: Registration
  const registrationResult = await testRegistration();
  if (!registrationResult) return;
  
  console.log('\n⏸️  Pausing for manual email verification...');
  console.log('📝 Please check the email preview URL above or your email inbox');
  console.log('🔢 Enter the 4-digit code to continue the test\n');
  
  // In a real scenario, you would get the code from email
  // For testing, you can check the console logs or email preview
  console.log('💡 To continue testing:');
  console.log('   1. Check the email preview URL or server logs for the verification code');
  console.log('   2. Modify this script to include the actual verification code');
  console.log('   3. Run: node test-auth.js\n');
  
  // Example of how to continue with a real code:
  // const verificationResult = await testEmailVerification(testUser.email, '1234');
  // if (verificationResult) {
  //   await testLogin(testUser.email, testUser.password);
  // }
}

// Check if verification code is provided as command line argument
const verificationCode = process.argv[2];

if (verificationCode) {
  console.log('🔢 Using provided verification code:', verificationCode);
  testEmailVerification(testUser.email, verificationCode)
    .then(result => {
      if (result) {
        return testLogin(testUser.email, testUser.password);
      }
    });
} else {
  runTests();
}

module.exports = {
  testRegistration,
  testEmailVerification,
  testLogin,
  testLoginVerification,
  testResendVerification
};
