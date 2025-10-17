import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Security: Remove X-Powered-By header
  poweredByHeader: false,

  // Image optimization security
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.firebaseapp.com",
        pathname: "/**",
      },
    ],
    // Prevent image optimization from being used maliciously
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable strict mode for better error detection
  reactStrictMode: true,

  // Experimental security features
  experimental: {
    // Enable strict Next.js font optimization
    optimizePackageImports: ["@/components", "@/lib"],
  },
};

export default nextConfig;
