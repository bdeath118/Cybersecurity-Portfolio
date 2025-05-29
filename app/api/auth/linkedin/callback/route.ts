import { type NextRequest, NextResponse } from "next/server"
import { LinkedInAuthProvider, storeToken } from "@/lib/auth-providers"
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
    const linkedInAuth = new LinkedInAuthProvider()
    const tokenData = await linkedInAuth.getToken(code)

    // Store the token securely
    storeToken("linkedin", tokenData)

    // Update import settings to indicate LinkedIn is connected
    await updateImportSettings(new FormData())

    // Redirect back to the admin dashboard
    return NextResponse.redirect(new URL("/admin/dashboard?success=linkedin_connected", request.url))
  } catch (error) {
    console.error("Error in LinkedIn callback:", error)
    return NextResponse.redirect(new URL("/admin/dashboard?error=auth_failed", request.url))
  }
}
