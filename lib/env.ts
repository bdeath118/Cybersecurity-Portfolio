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
  SITE_URL: string

  // Node environment
  NODE_ENV: "development" | "production" | "test"
}

// Get environment variables with validation
export function getEnv(): Env {
  // Required variables in all environments
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET environment variable is not set")
  }

  if (!process.env.SITE_URL) {
    throw new Error("SITE_URL environment variable is not set")
  }

  // In production, ensure we have NEXTAUTH_URL
  if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_URL) {
    throw new Error("NEXTAUTH_URL environment variable is required in production")
  }

  return {
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    SITE_URL: process.env.SITE_URL,
    NODE_ENV: (process.env.NODE_ENV as Env["NODE_ENV"]) || "development",
  }
}

// For client-side usage (only expose what's safe for the client)
export function getClientEnv() {
  return {
    SITE_URL: process.env.SITE_URL,
  }
}

