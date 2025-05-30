import { NextResponse } from "next/server"
import { CanvasAuthProvider } from "@/lib/auth-providers"
import { getEnv } from "@/lib/env"

export async function GET() {
  try {
    console.log("Canvas login route called")

    // Get environment variables
    const env = getEnv()
    const baseUrl = env.SITE_URL || `https://${env.VERCEL_URL}` || "http://localhost:3000"

    // Initialize Canvas auth provider
    const provider = new CanvasAuthProvider()
    console.log("Canvas provider initialized")

    // Get login URL
    const loginUrl = await provider.getLoginUrl()
    console.log("Canvas login URL:", loginUrl || "No URL returned")

    // Handle missing login URL
    if (!loginUrl) {
      console.error("Canvas credentials not configured")
      return NextResponse.redirect(new URL("/admin/dashboard?error=canvas_not_configured", baseUrl))
    }

    // Redirect to Canvas OAuth
    console.log("Redirecting to Canvas login URL")
    return NextResponse.redirect(loginUrl)
  } catch (error) {
    // Log detailed error
    console.error("Error initiating Canvas login:", error)

    // Get base URL for redirection
    const env = getEnv()
    const baseUrl = env.SITE_URL || `https://${env.VERCEL_URL}` || "http://localhost:3000"

    // Redirect with error
    return NextResponse.redirect(
      new URL(
        `/admin/dashboard?error=canvas_login_failed&message=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`,
        baseUrl,
      ),
    )
  }
}
