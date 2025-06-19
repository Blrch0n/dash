// Test registration API call
const testRegistration = async () => {
  try {
    const response = await fetch("http://192.168.0.16:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        firstName: "Frontend",
        lastName: "Test",
        email: "frontend-test@example.com",
        password: "TestPass123",
        confirmPassword: "TestPass123",
      }),
    });

    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok) {
      console.error("Registration failed:", data);
    } else {
      console.log("Registration successful:", data);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

// Run the test
testRegistration();
