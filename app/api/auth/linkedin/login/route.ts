import { NextResponse } from "next/server"
import { LinkedInAuthProvider } from "@/lib/auth-providers"

export async function GET() {
  try {
    console.log("LinkedIn login route accessed")

    const provider = new LinkedInAuthProvider()
    const loginUrl = await provider.getLoginUrl()

    console.log("LinkedIn login URL:", loginUrl ? "Generated successfully" : "Failed to generate")

    if (!loginUrl) {
      console.error("LinkedIn login URL is null - credentials not configured")
      const baseUrl =
        process.env.SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
      return NextResponse.redirect(
        new URL(
          "/admin/dashboard?error=linkedin_not_configured&message=Please configure LinkedIn credentials in the Credentials section",
          baseUrl,
        ),
      )
    }

    console.log("Redirecting to LinkedIn OAuth:", loginUrl)
    return NextResponse.redirect(loginUrl)
  } catch (error) {
    console.error("Error initiating LinkedIn login:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const baseUrl =
      process.env.SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

    return NextResponse.redirect(
      new URL(`/admin/dashboard?error=linkedin_login_failed&message=${encodeURIComponent(errorMessage)}`, baseUrl),
    )
  }
}
