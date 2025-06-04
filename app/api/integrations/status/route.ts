import { NextResponse } from "next/server"
import { getIntegrationStatus } from "@/lib/integration-config"

export async function GET() {
  try {
    const status = getIntegrationStatus()

    return NextResponse.json({
      success: true,
      integrations: status,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error getting integration status:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get integration status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
