import { NextResponse } from "next/server"
import { getCTFEvents, addCTFEvent, updateCTFEvent, deleteCTFEvent } from "@/lib/data"
import { isAuthenticated } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import type { CTFEvent } from "@/lib/types"

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
    const ctfEvents = await getCTFEvents()
    return NextResponse.json(ctfEvents)
  } catch (error) {
    console.error("API Error: Failed to fetch CTF events:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch CTF events" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const newCTFEventData: Omit<CTFEvent, "id"> = await request.json()
    const addedCTFEvent = await addCTFEvent(newCTFEventData)
    return NextResponse.json(addedCTFEvent, { status: 201 })
  } catch (error) {
    console.error("API Error: Failed to add CTF event:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to add CTF event" }), { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const { id, ...updatedCTFEventData }: CTFEvent = await request.json()
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "CTF Event ID is required for update" }), { status: 400 })
    }
    const updatedCTFEvent = await updateCTFEvent(id, updatedCTFEventData)
    if (!updatedCTFEvent) {
      return new NextResponse(JSON.stringify({ error: "CTF Event not found" }), { status: 404 })
    }
    return NextResponse.json(updatedCTFEvent)
  } catch (error) {
    console.error("API Error: Failed to update CTF event:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to update CTF event" }), { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const { id }: { id: string } = await request.json()
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "CTF Event ID is required for deletion" }), { status: 400 })
    }
    await deleteCTFEvent(id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("API Error: Failed to delete CTF event:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to delete CTF event" }), { status: 500 })
  }
}
