import { NextResponse } from "next/server"
import { CanvasAuthProvider } from "@/lib/auth-providers"

export async function GET() {
  try {
    const provider = new CanvasAuthProvider()
    const loginUrl = await provider.getLoginUrl()

    if (!loginUrl) {
      return NextResponse.redirect(
        new URL(
          "/admin/dashboard?error=canvas_not_configured",
          process.env.SITE_URL || "https://cybersecurity-portfolio-bdeath118.vercel.app",
        ),
      )
    }

    return NextResponse.redirect(loginUrl)
  } catch (error) {
    console.error("Error initiating Canvas login:", error)
    return NextResponse.redirect(
      new URL(
        "/admin/dashboard?error=canvas_login_failed",
        process.env.SITE_URL || "https://cybersecurity-portfolio-bdeath118.vercel.app",
      ),
    )
  }
}
