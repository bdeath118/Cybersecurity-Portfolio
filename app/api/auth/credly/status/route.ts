import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getCredlyBadges } from "@/lib/badge-integration"

export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const credlyUsername = process.env.CREDLY_USERNAME

  if (!credlyUsername) {
    return NextResponse.json({
      platform: "credly",
      enabled: false,
      configured: false,
      message: "Credly username not configured.",
      last_synced: null,
      status: "error",
    })
  }

  try {
    // Attempt to fetch a small number of badges to test connection
    const badges = await getCredlyBadges(credlyUsername, 1) // Fetch only 1 badge to test connection
    return NextResponse.json({
      platform: "credly",
      enabled: true,
      configured: true,
      message: `Successfully connected to Credly. Found ${badges.length} badges (showing 1 for test).`,
      last_synced: new Date().toISOString(), // Placeholder for last sync
      status: "success",
    })
  } catch (error: any) {
    console.error("Credly status check failed:", error)
    return NextResponse.json({
      platform: "credly",
      enabled: true, // Assuming it's enabled if username is set
      configured: true,
      message: `Failed to connect to Credly: ${error.message}. Check username or profile privacy.`,
      last_synced: null,
      status: "error",
    })
  }
}
