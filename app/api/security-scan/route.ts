import { NextResponse } from "next/server"
import { runSecurityScan } from "@/lib/actions"

export async function GET() {
  try {
    const result = await runSecurityScan()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error running security scan:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to run security scan",
        checks: [],
      },
      { status: 500 },
    )
  }
}
