import { type NextRequest, NextResponse } from "next/server"
import { CredlyAuthProvider, storeToken } from "@/lib/auth-providers"
import { updateImportSettings } from "@/lib/actions"

export async function GET(request: NextRequest) {
  // Get the authorization code from the URL
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/admin/dashboard?error=missing_code", request.url))
  }

  try {
    // Exchange the code for an access token
    const credlyAuth = new CredlyAuthProvider()
    const tokenData = await credlyAuth.getToken(code)

    // Store the token securely
    storeToken("credly", tokenData)

    // Update import settings to indicate Credly is connected
    await updateImportSettings(new FormData())

    // Redirect back to the admin dashboard
    return NextResponse.redirect(new URL("/admin/dashboard?success=credly_connected", request.url))
  } catch (error) {
    console.error("Error in Credly callback:", error)
    return NextResponse.redirect(new URL("/admin/dashboard?error=auth_failed", request.url))
  }
}
