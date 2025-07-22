import { NextResponse } from "next/server"
import { getCertifications, addCertification, updateCertification, deleteCertification } from "@/lib/data"
import { isAuthenticated } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import type { Certification } from "@/lib/types"

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
    const certifications = await getCertifications()
    return NextResponse.json(certifications)
  } catch (error) {
    console.error("API Error: Failed to fetch certifications:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch certifications" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const newCertificationData: Omit<Certification, "id"> = await request.json()
    const addedCertification = await addCertification(newCertificationData)
    return NextResponse.json(addedCertification, { status: 201 })
  } catch (error) {
    console.error("API Error: Failed to add certification:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to add certification" }), { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const { id, ...updatedCertificationData }: Certification = await request.json()
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Certification ID is required for update" }), { status: 400 })
    }
    const updatedCertification = await updateCertification(id, updatedCertificationData)
    if (!updatedCertification) {
      return new NextResponse(JSON.stringify({ error: "Certification not found" }), { status: 404 })
    }
    return NextResponse.json(updatedCertification)
  } catch (error) {
    console.error("API Error: Failed to update certification:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to update certification" }), { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const { id }: { id: string } = await request.json()
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Certification ID is required for deletion" }), { status: 400 })
    }
    await deleteCertification(id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("API Error: Failed to delete certification:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to delete certification" }), { status: 500 })
  }
}
