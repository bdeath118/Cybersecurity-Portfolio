import { NextResponse } from "next/server"
import { checkEnvironmentVariables } from "@/lib/env-check"

export async function GET() {
  const envStatus = checkEnvironmentVariables()
  return NextResponse.json(envStatus)
}
