import { NextResponse } from "next/server"
import { getEnv } from "@/lib/env"
import { hashPassword } from "@/lib/auth"

export async function GET() {
  try {
    const env = getEnv()

    // Debug information (don't expose passwords in production)
    const debugInfo = {
      environment: process.env.NODE_ENV,
      hasAuthSecret: !!env.AUTH_SECRET,
      authSecretLength: env.AUTH_SECRET?.length || 0,
      hasAdminUsername: !!env.ADMIN_USERNAME,
      adminUsername: env.ADMIN_USERNAME || "NOT_SET",
      hasAdminPassword: !!env.ADMIN_PASSWORD,
      adminPasswordLength: env.ADMIN_PASSWORD?.length || 0,

      // Test default credentials
      defaultUsernameHash: "admin",
      defaultPasswordHash: hashPassword("admin123"),

      // Environment variable hashes (if set)
      envUsernameHash: env.ADMIN_USERNAME || "NOT_SET",
      envPasswordHash: env.ADMIN_PASSWORD ? hashPassword(env.ADMIN_PASSWORD) : "NOT_SET",
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
