import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"

export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    // In a real scenario, you would query Vercel's API or a CI/CD system
    // to get the actual deployment status.
    // For this example, we'll simulate a status.
    const deploymentStatus = await simulateDeploymentStatus()
    return NextResponse.json(deploymentStatus)
  } catch (error) {
    console.error("API Error: Failed to fetch deployment status:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch deployment status" }), { status: 500 })
  }
}

async function simulateDeploymentStatus() {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay

  const statuses = ["SUCCESS", "BUILDING", "ERROR", "QUEUED"]
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

  const messages: Record<string, string> = {
    SUCCESS: "Latest deployment is live and healthy.",
    BUILDING: "A new deployment is currently in progress.",
    ERROR: "Last deployment failed. Check logs for details.",
    QUEUED: "Deployment queued, waiting for resources.",
  }

  const lastDeploymentDate = new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() // Last 7 days

  return {
    status: randomStatus,
    message: messages[randomStatus],
    lastDeployment: lastDeploymentDate,
    deploymentId: `dep_${Math.random().toString(36).substring(2, 15)}`,
    environment: process.env.VERCEL_ENV || "development",
    vercelUrl: process.env.VERCEL_URL || "http://localhost:3000",
  }
}
