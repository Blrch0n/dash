"use client";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  fallback = null,
}) => {
  const { user, isAuthenticated, loading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after auth is initialized
    if (!isInitialized || loading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (requireAdmin && user?.role !== "admin") {
      router.push("/"); // Redirect to home if admin required but user is not admin
      return;
    }
  }, [isAuthenticated, user, loading, isInitialized, requireAdmin, router]);

  // Show loading spinner while checking authentication
  if (!isInitialized || loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Check admin requirement
  if (requireAdmin && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
