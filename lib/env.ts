// Environment variable configuration with validation
// This ensures we have all required variables and provides type safety

// Define the shape of our environment variables
export interface Env {
  // Authentication
  AUTH_SECRET: string
  NEXTAUTH_URL?: string // Optional in development, required in production

  // Admin credentials (for initial setup)
  ADMIN_USERNAME?: string
  ADMIN_PASSWORD?: string

  // Site configuration
  SITE_URL?: string
  VERCEL_URL?: string

  // LinkedIn Integration
  LINKEDIN_PROFILE_URL?: string
  CREDLY_USERNAME?: string

  // Canvas Integration - Optional, will be added via admin dashboard
  CANVAS_API_KEY?: string
  CANVAS_USER_ID?: string

  // Node environment
  NODE_ENV: "development" | "production" | "test"
}

// Get environment variables with validation
export function getEnv(): Env {
  // Generate a fallback AUTH_SECRET if not provided (for development only)
  let authSecret = process.env.AUTH_SECRET

  if (!authSecret) {
    if (process.env.NODE_ENV === "production") {
      console.error("❌ AUTH_SECRET environment variable is not set in production")
      console.error("💡 Generate one with: openssl rand -base64 32")
      throw new Error("AUTH_SECRET environment variable is required in production")
    } else {
      // Use a default secret for development/preview
      authSecret = "development-secret-key-change-in-production"
      console.warn("⚠️ Using default AUTH_SECRET for development. Set AUTH_SECRET environment variable for production.")
    }
  }

  // Determine site URL with priority order:
  // 1. SITE_URL (explicitly set)
  // 2. NEXTAUTH_URL (for auth compatibility)
  // 3. VERCEL_URL (automatically set by Vercel)
  // 4. Default fallback
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
  const siteUrl =
    process.env.SITE_URL ||
    process.env.NEXTAUTH_URL ||
    vercelUrl ||
    "https://cybersecurity-portfolio-bdeath118.vercel.app"

  return {
    AUTH_SECRET: authSecret,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || siteUrl,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    SITE_URL: siteUrl,
    VERCEL_URL: vercelUrl,
    LINKEDIN_PROFILE_URL: process.env.LINKEDIN_PROFILE_URL,
    CREDLY_USERNAME: process.env.CREDLY_USERNAME,
    CANVAS_API_KEY: process.env.CANVAS_API_KEY,
    CANVAS_USER_ID: process.env.CANVAS_USER_ID,
    NODE_ENV: (process.env.NODE_ENV as Env["NODE_ENV"]) || "development",
  }
}

// For client-side usage (only expose what's safe for the client)
export function getClientEnv() {
  const env = getEnv()
  return {
    SITE_URL: env.SITE_URL,
    NODE_ENV: env.NODE_ENV,
  }
}
