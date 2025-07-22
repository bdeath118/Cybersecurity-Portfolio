import { NextResponse } from "next/server"
import { getDigitalBadges, addDigitalBadge, updateDigitalBadge, deleteDigitalBadge } from "@/lib/data"
import { isAuthenticated } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import type { DigitalBadge } from "@/lib/types"

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
    const digitalBadges = await getDigitalBadges()
    return NextResponse.json(digitalBadges)
  } catch (error) {
    console.error("API Error: Failed to fetch digital badges:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch digital badges" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const newBadgeData: Omit<DigitalBadge, "id"> = await request.json()
    const addedBadge = await addDigitalBadge(newBadgeData)
    return NextResponse.json(addedBadge, { status: 201 })
  } catch (error) {
    console.error("API Error: Failed to add digital badge:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to add digital badge" }), { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const { id, ...updatedBadgeData }: DigitalBadge = await request.json()
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Digital Badge ID is required for update" }), { status: 400 })
    }
    const updatedBadge = await updateDigitalBadge(id, updatedBadgeData)
    if (!updatedBadge) {
      return new NextResponse(JSON.stringify({ error: "Digital Badge not found" }), { status: 404 })
    }
    return NextResponse.json(updatedBadge)
  } catch (error) {
    console.error("API Error: Failed to update digital badge:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to update digital badge" }), { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const { id }: { id: string } = await request.json()
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Digital Badge ID is required for deletion" }), { status: 400 })
    }
    await deleteDigitalBadge(id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("API Error: Failed to delete digital badge:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to delete digital badge" }), { status: 500 })
  }
}
