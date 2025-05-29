import { NextResponse } from "next/server"
import { getEnv } from "@/lib/env"

export async function GET() {
  try {
    const env = getEnv()

    // Return current import settings
    const settings = {
      autoImportEnabled: false, // Default to false
      importFrequency: "daily" as const,
      linkedinProfileUrl: env.LINKEDIN_PROFILE_URL,
      credlyUsername: env.CREDLY_USERNAME,
      canvasApiKey: env.CANVAS_API_KEY ? "***configured***" : undefined,
      lastImport: undefined,
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching import settings:", error)
    return NextResponse.json({ error: "Failed to fetch import settings" }, { status: 500 })
  }
}
