import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security headers middleware
 * Implements OWASP recommended headers
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.paystack.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' *.paystack.co api.paystack.co; frame-src 'self' *.paystack.co"
  );

  // HSTS - Force HTTPS
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // XSS Protection (legacy)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(self 'https://api.paystack.co')"
  );

  // CORS - Strict allowlist
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    process.env.APP_URL || "",
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-CSRF-Token"
    );
    response.headers.set("Access-Control-Max-Age", "3600");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth/* (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public/* (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
