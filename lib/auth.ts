import { validateUser } from "./data"
import { cookies } from "next/headers"

// Generate a session token without using crypto
function generateSessionToken(): string {
  const randomPart = Math.random().toString(36).substring(2, 15)
  const timestampPart = Date.now().toString(36)
  return `${randomPart}${timestampPart}`
}

// Simple hash function that doesn't rely on crypto
export function hashPassword(password: string): string {
  const salt = process.env.AUTH_SECRET || "default-salt"
  let hash = 0
  const combinedString = password + salt

  for (let i = 0; i < combinedString.length; i++) {
    const char = combinedString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return (hash >>> 0).toString(16).padStart(8, "0")
}

// Authenticate a user and create a session
export async function authenticateUser(username: string, password: string) {
  console.log("🔐 Authentication attempt:", { username, passwordLength: password.length })

  try {
    // Use the validateUser function from data layer
    const isValid = await validateUser(username, password)

    if (isValid) {
      console.log("🎉 Authentication successful!")

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

    console.log("❌ Authentication failed")
    return { success: false, message: "Invalid username or password" }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, message: "Authentication error occurred" }
  }
}

// Verify a session
export async function verifySession(): Promise<boolean> {
  try {
    const authCookie = cookies().get("admin-auth")

    if (!authCookie || authCookie.value !== "authenticated") {
      return false
    }

    return true
  } catch (error) {
    console.error("Session verification error:", error)
    return false
  }
}

// Alias for verifySession (for backward compatibility)
export async function validateSession(): Promise<boolean> {
  return verifySession()
}

// Logout a user
export async function logoutUser(): Promise<void> {
  try {
    cookies().delete("admin-auth")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

// Middleware to check authentication
export async function checkAuth(): Promise<boolean> {
  return verifySession()
}
