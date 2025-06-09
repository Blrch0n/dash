import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname from the request
  const pathname = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ["/"];
  const authRoutes = ["/login", "/sign-up"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Get auth token from cookies or headers (for server-side checking)
  // Note: Since we're using localStorage, this is mainly for fallback
  const authToken = request.cookies.get("auth_token")?.value;

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !authToken) {
    // Allow the client-side ProtectedRoute component to handle the redirect
    // This middleware is mainly for additional security layer
    return NextResponse.next();
  }

  // If accessing auth routes while authenticated, redirect to dashboard
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
