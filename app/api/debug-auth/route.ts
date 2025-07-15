import { NextResponse } from "next/server"
import { getEnv } from "@/lib/env"

export async function GET() {
  try {
    const env = getEnv()

    // Debug information (don't expose passwords in production)
    const debugInfo = {
      environment: process.env.NODE_ENV,
      adminUsername: env.ADMIN_USERNAME || "NOT_SET",
      adminPasswordExists: !!env.ADMIN_PASSWORD,
      fallbackCredentials: {
        username: "admin",
        password: "admin123",
      },
      note: "This endpoint shows current authentication configuration",
    }

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      message: "Debug information retrieved successfully",
    })
  } catch (error) {
    console.error("Debug auth error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get debug information",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
