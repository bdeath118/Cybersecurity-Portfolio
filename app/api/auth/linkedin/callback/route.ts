import { NextResponse } from "next/server"
import { getLinkedInProfile } from "@/lib/linkedin-integration"
import { isAuthenticated } from "@/lib/auth"
import { updateSiteInfo } from "@/lib/data"

export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const linkedinProfileUrl = process.env.LINKEDIN_PROFILE_URL

  if (!linkedinProfileUrl) {
    return NextResponse.json(
      { success: false, message: "LinkedIn profile URL not configured in environment variables." },
      { status: 400 },
    )
  }

  try {
    // In a real scenario, 'code' would be exchanged for an access token.
    // For this example, we directly fetch profile data using the configured URL.
    const profileData = await getLinkedInProfile(linkedinProfileUrl)

    if (profileData) {
      // Update site info with fetched LinkedIn data
      // This is a simplified example; you'd map specific fields as needed
      await updateSiteInfo({
        linkedin_profile_url: profileData.profileUrl,
        // Potentially update avatar_url, site_name, etc. if available and desired
        // avatar_url: profileData.profilePicture || siteInfo.avatar_url,
        // site_name: profileData.name || siteInfo.site_name,
      })
      return NextResponse.json({ success: true, message: "Successfully updated LinkedIn profile information." })
    } else {
      return NextResponse.json({ success: false, message: "Failed to retrieve LinkedIn profile data." })
    }
  } catch (error: any) {
    console.error("LinkedIn callback error:", error)
    return NextResponse.json(
      { success: false, message: `Failed to import LinkedIn data: ${error.message}` },
      { status: 500 },
    )
  }
}
