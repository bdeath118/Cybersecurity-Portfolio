import { type NextRequest, NextResponse } from "next/server"
import { CanvasAuthProvider, storeToken } from "@/lib/auth-providers"
import { getEnv } from "@/lib/env"

export async function GET(request: NextRequest) {
  try {
    console.log("Canvas callback route called")

    // Get environment variables
    const env = getEnv()
    const baseUrl = env.SITE_URL || `https://${env.VERCEL_URL}` || "http://localhost:3000"

    // Get code from query params
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const error = url.searchParams.get("error")

    // Handle OAuth errors
    if (error) {
      console.error("Canvas OAuth error:", error)
      return NextResponse.redirect(
        new URL(`/admin/dashboard?error=canvas_oauth_error&message=${encodeURIComponent(error)}`, baseUrl),
      )
    }

    // Validate code
    if (!code) {
      console.error("No code provided in Canvas callback")
      return NextResponse.redirect(new URL("/admin/dashboard?error=canvas_no_code", baseUrl))
    }

    // Exchange code for token
    console.log("Exchanging code for Canvas token")
    const provider = new CanvasAuthProvider()
    const tokenData = await provider.getToken(code)

    // Store token
    console.log("Storing Canvas token")
    storeToken("canvas", tokenData)

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/admin/dashboard?success=canvas_connected", baseUrl))
  } catch (error) {
    // Log error
    console.error("Error in Canvas callback:", error)

    // Get base URL for redirection
    const env = getEnv()
    const baseUrl = env.SITE_URL || `https://${env.VERCEL_URL}` || "http://localhost:3000"

    // Redirect with error
    return NextResponse.redirect(
      new URL(
        `/admin/dashboard?error=canvas_callback_failed&message=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`,
        baseUrl,
      ),
    )
  }
}
