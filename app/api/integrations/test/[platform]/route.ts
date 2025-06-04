import { type NextRequest, NextResponse } from "next/server"
import { validateIntegration, INTEGRATIONS } from "@/lib/integration-config"
import { LinkedInAuthProvider, CredlyAuthProvider, CanvasAuthProvider } from "@/lib/auth-providers"

export async function GET(request: NextRequest, { params }: { params: { platform: string } }) {
  try {
    const platform = params.platform

    if (!INTEGRATIONS[platform]) {
      return NextResponse.json(
        {
          success: false,
          error: "Unknown platform",
          platform,
        },
        { status: 400 },
      )
    }

    const validation = validateIntegration(platform)

    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: "Integration not properly configured",
        platform,
        missing: validation.missing,
        configured: validation.configured,
      })
    }

    // Test the integration based on platform
    let testResult: any = { success: true, message: "Configuration valid" }

    try {
      switch (platform) {
        case "linkedin":
          const linkedinProvider = new LinkedInAuthProvider()
          const linkedinUrl = await linkedinProvider.getLoginUrl()
          testResult = {
            success: !!linkedinUrl,
            message: linkedinUrl ? "OAuth URL generated successfully" : "Failed to generate OAuth URL",
            hasLoginUrl: !!linkedinUrl,
          }
          break

        case "credly":
          const credlyProvider = new CredlyAuthProvider()
          const credlyUrl = await credlyProvider.getLoginUrl()
          testResult = {
            success: !!credlyUrl,
            message: credlyUrl ? "OAuth URL generated successfully" : "Failed to generate OAuth URL",
            hasLoginUrl: !!credlyUrl,
          }
          break

        case "canvas":
          const canvasProvider = new CanvasAuthProvider()
          const canvasUrl = await canvasProvider.getLoginUrl()
          testResult = {
            success: !!canvasUrl,
            message: canvasUrl ? "OAuth URL generated successfully" : "Failed to generate OAuth URL",
            hasLoginUrl: !!canvasUrl,
          }
          break

        default:
          testResult = {
            success: true,
            message: "Platform configured but no test available yet",
          }
      }
    } catch (error) {
      testResult = {
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    return NextResponse.json({
      platform,
      integration: INTEGRATIONS[platform],
      validation,
      test: testResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error testing ${params.platform} integration:`, error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to test integration",
        platform: params.platform,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
