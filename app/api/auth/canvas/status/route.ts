import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getToken } from "@/lib/auth-providers"

export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const token = getToken("canvas")
  const canvasApiKey = process.env.CANVAS_API_KEY
  const canvasUserId = process.env.CANVAS_USER_ID

  if (!canvasApiKey || !canvasUserId) {
    return NextResponse.json({
      platform: "canvas",
      enabled: false,
      configured: false,
      message: "Canvas API Key or User ID not configured.",
      last_synced: null,
      status: "error",
    })
  }

  try {
    // Simulate a call to Canvas API
    // In a real scenario, you'd make an actual API call, e.g., to get user profile or courses
    const response = await fetch(`https://canvas.instructure.com/api/v1/users/${canvasUserId}/profile`, {
      headers: {
        Authorization: `Bearer ${canvasApiKey}`,
      },
      // Add signal for timeout if needed
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        platform: "canvas",
        enabled: true,
        configured: true,
        message: `Successfully connected to Canvas. User: ${data.name || "Unknown"}`,
        last_synced: new Date().toISOString(),
        status: "success",
      })
    } else {
      const errorText = await response.text()
      return NextResponse.json({
        platform: "canvas",
        enabled: true,
        configured: true,
        message: `Failed to connect to Canvas: ${response.status} - ${errorText.substring(0, 100)}. Check API Key or User ID.`,
        last_synced: null,
        status: "error",
      })
    }
  } catch (error: any) {
    console.error("Canvas status check failed:", error)
    return NextResponse.json({
      platform: "canvas",
      enabled: true,
      configured: true,
      message: `Failed to connect to Canvas: ${error.message}. Network error or invalid credentials.`,
      last_synced: null,
      status: "error",
    })
  }
}
