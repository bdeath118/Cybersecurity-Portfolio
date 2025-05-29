import { NextResponse } from "next/server"
import { getEnv } from "@/lib/env"

export async function GET() {
  try {
    const env = getEnv()
    const vercelUrl = env.VERCEL_URL
      ? `https://${env.VERCEL_URL}`
      : "https://cybersecurity-portfolio-bdeath118.vercel.app"

    const deploymentInfo = {
      status: "deployed",
      url: vercelUrl,
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      vercelUrl: vercelUrl,
      configuredSiteUrl: env.SITE_URL || vercelUrl,
      authConfigured: !!(env.ADMIN_USERNAME && env.ADMIN_PASSWORD),
      integrations: {
        linkedin: !!env.LINKEDIN_PROFILE_URL,
        credly: !!env.CREDLY_USERNAME,
        canvas: !!(env.CANVAS_API_KEY && env.CANVAS_USER_ID),
      },
      features: {
        autoImport: !!(env.LINKEDIN_PROFILE_URL || env.CREDLY_USERNAME),
        digitalBadges: true,
        adminDashboard: true,
        securityScan: true,
      },
    }

    return NextResponse.json(deploymentInfo)
  } catch (error) {
    console.error("Error checking deployment status:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check deployment status",
        url: "https://cybersecurity-portfolio-bdeath118.vercel.app",
      },
      { status: 500 },
    )
  }
}
