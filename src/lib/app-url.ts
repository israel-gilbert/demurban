import { NextRequest } from "next/server";

/**
 * Resolve the app's base URL for redirects and payment callback URLs.
 *
 * - In production, APP_URL (e.g. https://demurban.com) is authoritative so a
 *   spoofed Host header can never redirect users to another domain.
 * - In development (and if APP_URL is unset), the URL is derived from the
 *   request headers, so localhost:3000, localhost:3001, LAN IPs, and preview
 *   deploys all work without editing .env.
 */
export function getAppUrl(request: NextRequest): string {
  const envUrl = process.env.APP_URL?.trim();

  if (process.env.NODE_ENV === "production" && envUrl) {
    return envUrl;
  }

  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");

  if (host) {
    const proto =
      request.headers.get("x-forwarded-proto") ||
      (host.startsWith("localhost") || host.startsWith("127.")
        ? "http"
        : "https");
    return `${proto}://${host}`;
  }

  return envUrl || "http://localhost:3000";
}
