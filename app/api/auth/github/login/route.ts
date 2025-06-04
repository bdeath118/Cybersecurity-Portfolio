import { NextResponse } from "next/server"
import { getRedirectUri } from "@/lib/integration-config"

export async function GET() {
  try {
    console.log("GitHub login route accessed")

    // Check if GitHub credentials are configured
    const clientId = process.env.GITHUB_CLIENT_ID
    if (!clientId) {
      console.error("GitHub client ID not configured")
      const baseUrl = process.env.SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000"
      return NextResponse.redirect(
        new URL("/admin/dashboard?error=github_not_configured&message=Please configure GitHub credentials", baseUrl),
      )
    }

    const redirectUri = getRedirectUri("github")
    const state = crypto.randomUUID()

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "read:user public_repo",
      state,
    })

    const loginUrl = `https://github.com/login/oauth/authorize?${params.toString()}`
    console.log("Redirecting to GitHub OAuth")

    return NextResponse.redirect(loginUrl)
  } catch (error) {
    console.error("Error initiating GitHub login:", error)
    const baseUrl = process.env.SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000"
    return NextResponse.redirect(
      new URL(
        `/admin/dashboard?error=github_login_failed&message=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`,
        baseUrl,
      ),
    )
  }
}
