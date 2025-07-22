import { NextResponse } from "next/server"

export async function GET() {
  // In a real application, this would redirect to Credly's OAuth authorization endpoint.
  // For this portfolio, we'll simulate a successful "login" and redirect to a callback.
  // The actual data fetching happens in the callback using the configured username.

  const credlyUsername = process.env.CREDLY_USERNAME

  if (!credlyUsername) {
    return new NextResponse(JSON.stringify({ error: "Credly username not configured in environment variables." }), {
      status: 400,
    })
  }

  // Simulate OAuth redirect
  const redirectUrl = new URL("/api/auth/credly/callback", process.env.NEXTAUTH_URL || "http://localhost:3000")
  redirectUrl.searchParams.set("code", "mock_credly_auth_code") // Simulate an auth code

  return NextResponse.redirect(redirectUrl.toString())
}
