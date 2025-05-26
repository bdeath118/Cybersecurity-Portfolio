import { type NextRequest, NextResponse } from "next/server"

// Store IP addresses and their request counts
// In a production app, use Redis or another persistent store
const ipRequestMap = new Map<string, number[]>()

export function rateLimit(req: NextRequest) {
  const ip = req.ip || "unknown"
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5 // 5 requests per windowMs

  // Get existing requests for this IP
  const requestTimes = ipRequestMap.get(ip) || []

  // Filter out requests older than the window
  const recentRequests = requestTimes.filter((time) => now - time < windowMs)

  // Check if rate limit exceeded
  if (recentRequests.length >= maxRequests) {
    return NextResponse.json(
      { success: false, message: "Too many login attempts. Please try again later." },
      { status: 429 },
    )
  }

  // Add current request time
  recentRequests.push(now)
  ipRequestMap.set(ip, recentRequests)

  return null // No rate limit exceeded
}
