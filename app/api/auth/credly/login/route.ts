import { NextResponse } from "next/server"
import { CredlyAuthProvider } from "@/lib/auth-providers"

export async function GET() {
  try {
    const provider = new CredlyAuthProvider()
    const loginUrl = await provider.getLoginUrl()

    if (!loginUrl) {
      return NextResponse.redirect(
        new URL("/admin/dashboard?error=credly_not_configured", process.env.SITE_URL || "http://localhost:3000"),
      )
    }

    return NextResponse.redirect(loginUrl)
  } catch (error) {
    console.error("Error initiating Credly login:", error)
    return NextResponse.redirect(
      new URL("/admin/dashboard?error=credly_login_failed", process.env.SITE_URL || "http://localhost:3000"),
    )
  }
}
