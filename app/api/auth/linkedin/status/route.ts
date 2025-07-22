import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getLinkedInProfile } from "@/lib/linkedin-integration"

export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const linkedinProfileUrl = process.env.LINKEDIN_PROFILE_URL

  if (!linkedinProfileUrl) {
    return NextResponse.json({
      platform: "linkedin",
      enabled: false,
      configured: false,
      message: "LinkedIn profile URL not configured.",
      last_synced: null,
      status: "error",
    })
  }

  try {
    // Attempt to fetch profile data to test connection
    const profileData = await getLinkedInProfile(linkedinProfileUrl)
    if (profileData) {
      return NextResponse.json({
        platform: "linkedin",
        enabled: true,
        configured: true,
        message: `Successfully connected to LinkedIn. Profile: ${profileData.name || "Unknown"}`,
        last_synced: new Date().toISOString(), // Placeholder for last sync
        status: "success",
      })
    } else {
      return NextResponse.json({
        platform: "linkedin",
        enabled: true,
        configured: true,
        message: "Failed to retrieve LinkedIn profile data. Check URL or profile privacy.",
        last_synced: null,
        status: "error",
      })
    }
  } catch (error: any) {
    console.error("LinkedIn status check failed:", error)
    return NextResponse.json({
      platform: "linkedin",
      enabled: true,
      configured: true,
      message: `Failed to connect to LinkedIn: ${error.message}. Network error or invalid URL.`,
      last_synced: null,
      status: "error",
    })
  }
}
