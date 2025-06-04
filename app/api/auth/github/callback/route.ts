import { type NextRequest, NextResponse } from "next/server"
import { storeToken } from "@/lib/auth-providers"
import axios from "axios"

export async function GET(request: NextRequest) {
  try {
    console.log("GitHub callback route called")

    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const error = url.searchParams.get("error")
    const baseUrl = process.env.SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000"

    if (error) {
      console.error("GitHub OAuth error:", error)
      return NextResponse.redirect(
        new URL(`/admin/dashboard?error=github_oauth_error&message=${encodeURIComponent(error)}`, baseUrl),
      )
    }

    if (!code) {
      console.error("No code provided in GitHub callback")
      return NextResponse.redirect(new URL("/admin/dashboard?error=github_no_code", baseUrl))
    }

    // Exchange code for token
    const clientId = process.env.GITHUB_CLIENT_ID
    const clientSecret = process.env.GITHUB_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error("GitHub credentials not configured")
    }

    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      },
    )

    const { access_token, expires_in } = tokenResponse.data

    if (!access_token) {
      throw new Error("No access token received from GitHub")
    }

    // Store token
    storeToken("github", {
      accessToken: access_token,
      expiresAt: expires_in ? Date.now() + expires_in * 1000 : undefined,
    })

    return NextResponse.redirect(new URL("/admin/dashboard?success=github_connected", baseUrl))
  } catch (error) {
    console.error("Error in GitHub callback:", error)
    const baseUrl = process.env.SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000"
    return NextResponse.redirect(
      new URL(
        `/admin/dashboard?error=github_callback_failed&message=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`,
        baseUrl,
      ),
    )
  }
}
