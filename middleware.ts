/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Determine if we're in production
  const isProduction = process.env.NODE_ENV === "production";

  // Security Headers - Build headers object based on environment
  const securityHeaders: Record<string, string> = {
    // Content Security Policy - Prevents XSS attacks
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://*.firebaseapp.com https://*.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com https://api.groq.com https://res.cloudinary.com https://*.vapi.ai wss://*.vapi.ai",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      "block-all-mixed-content",
    ].join("; "),

    // Prevent clickjacking attacks
    "X-Frame-Options": "DENY",

    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",

    // Referrer Policy - Control information leakage
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // XSS Protection (for older browsers)
    "X-XSS-Protection": "1; mode=block",

    // Permissions Policy - Control browser features
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",

    // Cross-Origin Resource Policy
    "Cross-Origin-Resource-Policy": "same-origin",

    // Cross-Origin Opener Policy
    "Cross-Origin-Opener-Policy": "same-origin",

    // Cross-Origin Embedder Policy (use with caution, may break third-party resources)
    // "Cross-Origin-Embedder-Policy": "require-corp",

    // HSTS - Force HTTPS in production only (conditionally added)
    ...(isProduction && {
      "Strict-Transport-Security":
        "max-age=31536000; includeSubDomains; preload",
    }),
  };

  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Remove server information headers for security
  response.headers.delete("X-Powered-By");

  return response;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
