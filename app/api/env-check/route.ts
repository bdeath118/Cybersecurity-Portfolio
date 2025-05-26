import { NextResponse } from "next/server"
import { checkEnvironmentVariables } from "@/lib/env-check"

export async function GET() {
  try {
    const results = checkEnvironmentVariables()

    // Don't expose sensitive values in the API response
    const safeResults = results.map((result) => ({
      variable: result.variable,
      required: result.required,
      present: result.present,
      status: result.status,
      message: result.message,
      // Only include safe values (not passwords or secrets)
      value: ["SITE_URL", "NEXTAUTH_URL", "NODE_ENV", "ADMIN_USERNAME"].includes(result.variable)
        ? result.value
        : undefined,
      masked: result.masked,
    }))

    return NextResponse.json({
      success: true,
      results: safeResults,
      summary: {
        total: results.length,
        ok: results.filter((r) => r.status === "ok").length,
        warnings: results.filter((r) => r.status === "warning").length,
        missing: results.filter((r) => r.status === "missing").length,
        allRequiredPresent: results.filter((r) => r.required && !r.present).length === 0,
      },
    })
  } catch (error) {
    console.error("Environment check error:", error)
    return NextResponse.json({ success: false, error: "Failed to check environment variables" }, { status: 500 })
  }
}
