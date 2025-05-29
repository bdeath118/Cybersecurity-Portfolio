import { getEnv } from "./env"
import { validateUser } from "./data"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Generate a session token without using crypto
function generateSessionToken(): string {
  // Create a random token using Math.random and current timestamp
  const randomPart = Math.random().toString(36).substring(2, 15)
  const timestampPart = Date.now().toString(36)
  return `${randomPart}${timestampPart}`
}

// Simple hash function that doesn't rely on crypto
export function hashPassword(password: string): string {
  // This is a very simple hash function for demonstration purposes
  // In a production environment, use a proper password hashing library
  const env = getEnv()
  const salt = env.AUTH_SECRET
  let hash = 0
  const combinedString = password + salt

  for (let i = 0; i < combinedString.length; i++) {
    const char = combinedString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Convert to hex string
  return (hash >>> 0).toString(16).padStart(8, "0")
}

// Authenticate a user and create a session
export async function authenticateUser(username: string, password: string) {
  console.log("🔐 Authentication attempt:", { username, passwordLength: password.length })

  // Get environment variables
  const env = getEnv()
  console.log("🌍 Environment check:", {
    hasAdminUsername: !!env.ADMIN_USERNAME,
    hasAdminPassword: !!env.ADMIN_PASSWORD,
    adminUsername: env.ADMIN_USERNAME,
  })

  let isAuthenticated = false

  // PRIORITY 1: Check environment variable credentials if provided
  if (env.ADMIN_USERNAME && env.ADMIN_PASSWORD) {
    console.log("🔑 Checking environment credentials...")
    // Direct comparison with environment variables (no hashing for env vars)
    isAuthenticated = username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD
    console.log("✅ Environment auth result:", isAuthenticated)

    if (isAuthenticated) {
      console.log("🎉 Authentication successful with environment variables!")

      // Create a session token
      const token = generateSessionToken()

      // Store in a secure, HTTP-only cookie
      cookies().set("admin-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
        sameSite: "lax",
      })

      return { success: true }
    }
  }

  // PRIORITY 2: Only check database if environment variables are not set or failed
  if (!isAuthenticated && (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD)) {
    console.log("🗄️ Checking database credentials (fallback)...")
    const user = await validateUser(username, password)
    isAuthenticated = !!user
    console.log("✅ Database auth result:", isAuthenticated)

    if (isAuthenticated) {
      console.log("🎉 Authentication successful with database credentials!")

      // Create a session token
      const token = generateSessionToken()

      // Store in a secure, HTTP-only cookie
      cookies().set("admin-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
        sameSite: "lax",
      })

      return { success: true }
    }
  }

  console.log("❌ Authentication failed")
  return { success: false, message: "Invalid username or password" }
}

// Verify a session
export async function verifySession() {
  const authCookie = cookies().get("admin-auth")

  if (!authCookie || authCookie.value === "") {
    return false
  }

  // In a real app, verify this token against your database
  // For now, we'll just check if it exists
  return true
}

// Alias for verifySession (for backward compatibility)
export async function validateSession() {
  return verifySession()
}

// Logout a user
export async function logoutUser() {
  cookies().delete("admin-auth")
  redirect("/admin")
}

// Middleware to check authentication
export async function checkAuth() {
  const isAuthenticated = await verifySession()

  if (!isAuthenticated) {
    redirect("/admin")
  }
}
