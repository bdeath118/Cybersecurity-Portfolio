import { NextResponse } from "next/server"
import { getBugBountyPrograms, addBugBountyProgram, updateBugBountyProgram, deleteBugBountyProgram } from "@/lib/data"
import { isAuthenticated } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 requests per 60 seconds
})

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
  const limitReached = !limiter.check(ip)

  if (limitReached) {
    return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": limiter.limit.toString(),
        "X-RateLimit-Remaining": limiter.remaining.toString(),
        "X-RateLimit-Reset": limiter.reset.toString(),
      },
    })
  }

  try {
    const programs = await getBugBountyPrograms()
    return NextResponse.json(programs)
  } catch (error) {
    console.error("API Error: Failed to fetch bug bounty programs:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch bug bounty programs" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const body = await request.json()
    const newProgram = await addBugBountyProgram(body)
    return NextResponse.json(newProgram, { status: 201 })
  } catch (error) {
    console.error("API Error: Failed to add bug bounty program:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to add bug bounty program" }), { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const body = await request.json()
    const updatedProgram = await updateBugBountyProgram(body)
    return NextResponse.json(updatedProgram)
  } catch (error) {
    console.error("API Error: Failed to update bug bounty program:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to update bug bounty program" }), { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const body = await request.json()
    await deleteBugBountyProgram(body.id)
    return new NextResponse(JSON.stringify({ message: "Bug bounty program deleted successfully" }), { status: 200 })
  } catch (error) {
    console.error("API Error: Failed to delete bug bounty program:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to delete bug bounty program" }), { status: 500 })
  }
}
