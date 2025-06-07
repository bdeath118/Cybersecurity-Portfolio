import { type NextRequest, NextResponse } from "next/server"
import { HackerOneIntegration } from "@/lib/hackerone-integration"

export async function GET() {
  try {
    const integration = new HackerOneIntegration()
    const result = await integration.testConnection()

    return NextResponse.json({
      success: result.success,
      connected: result.success,
      profile: result.profile,
    })
  } catch (error) {
    console.error("HackerOne integration error:", error)
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: "Failed to connect to HackerOne",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    const integration = new HackerOneIntegration()

    if (action === "test-connection") {
      const result = await integration.testConnection()
      return NextResponse.json(result)
    }

    if (action === "import-reports") {
      const result = await integration.importReports()
      return NextResponse.json(result)
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("HackerOne API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
