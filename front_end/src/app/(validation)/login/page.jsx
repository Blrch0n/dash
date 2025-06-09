"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, isAuthenticated } from "../../../lib/auth";
import { useAuth } from "../../../contexts/AuthContext";
import Link from "next/link";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login: authLogin } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user } = login(formData.email, formData.password);
      authLogin(user);
      router.push("/"); // Redirect to dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-fit flex items-center justify-center ">
      <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700/50">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500/50 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign up here
            </Link>
          </p>
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 text-xs">
            <p>
              <strong>Demo Account:</strong>
            </p>
            <p>Email: admin@example.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
