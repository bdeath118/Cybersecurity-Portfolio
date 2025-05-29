import { NextResponse } from "next/server"
import { LinkedInAuthProvider } from "@/lib/auth-providers"

export async function GET() {
  try {
    const provider = new LinkedInAuthProvider()
    const loginUrl = await provider.getLoginUrl()

    if (!loginUrl) {
      return NextResponse.redirect(
        new URL("/admin/dashboard?error=linkedin_not_configured", process.env.SITE_URL || "http://localhost:3000"),
      )
    }

    return NextResponse.redirect(loginUrl)
  } catch (error) {
    console.error("Error initiating LinkedIn login:", error)
    return NextResponse.redirect(
      new URL("/admin/dashboard?error=linkedin_login_failed", process.env.SITE_URL || "http://localhost:3000"),
    )
  }
}
