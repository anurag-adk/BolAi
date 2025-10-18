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
      // Scripts: Allow self, Firebase, Google APIs, Daily.co (for Vapi), and blob URLs
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://cdn.jsdelivr.net https://*.firebaseapp.com https://*.googleapis.com https://*.daily.co https://*.vapi.ai",
      // Styles: Allow self, inline styles, Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: Allow from any HTTPS source, data URIs, and blobs
      "img-src 'self' data: https: blob:",
      // Fonts: Allow self, Google Fonts, and data URIs
      "font-src 'self' https://fonts.gstatic.com data:",
      // Connections: Allow WebSocket and HTTPS connections for all services
      "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com https://api.groq.com https://res.cloudinary.com https://*.vapi.ai wss://*.vapi.ai https://*.daily.co wss://*.daily.co blob:",
      // Workers: Allow self, blobs, Daily.co workers, and Krisp
      "worker-src 'self' blob: https://*.daily.co https://*.vapi.ai",
      // Media: Allow media from self, Daily.co, and blobs (for WebRTC)
      "media-src 'self' https://*.daily.co blob: https://*.vapi.ai",
      // Frames: Allow Daily.co iframes and Vapi
      "frame-src 'self' https://*.daily.co https://*.vapi.ai",
      // Prevent being framed by other sites
      "frame-ancestors 'none'",
      // Base URI restriction
      "base-uri 'self'",
      // Form submission restriction
      "form-action 'self'",
      // Upgrade insecure requests to HTTPS
      "upgrade-insecure-requests",
      // Block mixed content
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

    // Permissions Policy - Control browser features (allow microphone for Vapi calls)
    "Permissions-Policy":
      "camera=(), microphone=(self), geolocation=(), interest-cohort=(), payment=()",

    // Cross-Origin Resource Policy
    "Cross-Origin-Resource-Policy": "same-origin",

    // Cross-Origin Opener Policy
    "Cross-Origin-Opener-Policy": "same-origin",

    // Cross-Origin Embedder Policy (commented out as it may break third-party resources)
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
