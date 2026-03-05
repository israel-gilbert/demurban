import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Admin route protection (server-side)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow login page without session
    if (request.nextUrl.pathname !== "/admin/login") {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      const role = (token as any)?.role;

      if (!token || role !== "ADMIN") {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("from", request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  const response = NextResponse.next();
  const isProduction = process.env.NODE_ENV === "production";

  /**
   * CSP
   * This makes pages appear partially loaded / missing components.
   *
   * Keep it strict-ish, but allow inline scripts so Next can hydrate.
   * (Nonce-based CSP is the “perfect” version, but this is the fast stable fix.)
   */
  const csp = isProduction
    ? [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' *.paystack.co",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: https://res.cloudinary.com",
        "font-src 'self' data:",
        "connect-src 'self' *.paystack.co api.paystack.co https://api.cloudinary.com",
        "frame-src 'self' *.paystack.co",
      ].join("; ")
    : [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.paystack.co",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: https://res.cloudinary.com",
        "font-src 'self' data:",
        "connect-src 'self' *.paystack.co api.paystack.co https://api.cloudinary.com",
        "frame-src 'self' *.paystack.co",
      ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // HSTS - Force HTTPS
  if (isProduction) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(self 'https://api.paystack.co')"
  );

  /**
   * CORS
   * Only applies when a request has an Origin header.
   * Don’t keep localhost here for production; use APP_URL.
   */
  const origin = request.headers.get("origin");
  const allowedOrigins = [process.env.APP_URL].filter(Boolean) as string[];

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token");
    response.headers.set("Access-Control-Max-Age", "3600");
  }

  // Handle preflight (OPTIONS)
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

/**
 * IMPORTANT:
 * Exclude ALL /api routes from middleware.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};