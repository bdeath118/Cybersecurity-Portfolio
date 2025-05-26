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

  // In production, ensure we have NEXTAUTH_URL
  if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_URL) {
    console.error("❌ NEXTAUTH_URL environment variable is required in production")
    throw new Error("NEXTAUTH_URL environment variable is required in production")
  }

  return {
    AUTH_SECRET: authSecret,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    SITE_URL: process.env.SITE_URL || "https://cybersecurity-portfolio-bdeath118.vercel.app",
    NODE_ENV: (process.env.NODE_ENV as Env["NODE_ENV"]) || "development",
  }
}

// For client-side usage (only expose what's safe for the client)
export function getClientEnv() {
  return {
    SITE_URL: process.env.SITE_URL || "https://cybersecurity-portfolio-bdeath118.vercel.app",
  }
}
