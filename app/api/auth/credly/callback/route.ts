import { NextResponse } from "next/server"
import { getCredlyBadges } from "@/lib/badge-integration"
import { isAuthenticated } from "@/lib/auth"
import { addDigitalBadge } from "@/lib/data"

export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const credlyUsername = process.env.CREDLY_USERNAME

  if (!credlyUsername) {
    return NextResponse.json(
      { success: false, message: "Credly username not configured in environment variables." },
      { status: 400 },
    )
  }

  try {
    // In a real scenario, 'code' would be exchanged for an access token.
    // For this example, we directly fetch badges using the configured username.
    const badges = await getCredlyBadges(credlyUsername)

    if (badges.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No new badges found on Credly or Credly profile is private.",
      })
    }

    let addedCount = 0
    for (const badge of badges) {
      try {
        // Check if badge already exists to prevent duplicates
        // This would typically involve fetching existing badges from your DB first
        // For simplicity, we'll just try to add and handle potential unique constraint errors
        await addDigitalBadge({
          name: badge.name,
          issuer: badge.issuer,
          issue_date: badge.issued_at,
          credential_url: badge.url,
          image_url: badge.image,
          description: badge.description,
        })
        addedCount++
      } catch (e) {
        console.warn(`Badge "${badge.name}" might already exist or failed to add:`, (e as Error).message)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${addedCount} digital badges from Credly.`,
    })
  } catch (error: any) {
    console.error("Credly callback error:", error)
    return NextResponse.json(
      { success: false, message: `Failed to import badges from Credly: ${error.message}` },
      { status: 500 },
    )
  }
}
