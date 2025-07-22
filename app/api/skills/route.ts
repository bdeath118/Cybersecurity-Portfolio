import { NextResponse } from "next/server"
import { getSkills, addSkill, updateSkill, deleteSkill } from "@/lib/data"
import { isAuthenticated } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import type { Skill } from "@/lib/types"

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
    const skills = await getSkills()
    return NextResponse.json(skills)
  } catch (error) {
    console.error("API Error: Failed to fetch skills:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch skills" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const newSkillData: Omit<Skill, "id"> = await request.json()
    const addedSkill = await addSkill(newSkillData)
    return NextResponse.json(addedSkill, { status: 201 })
  } catch (error) {
    console.error("API Error: Failed to add skill:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to add skill" }), { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const { id, ...updatedSkillData }: Skill = await request.json()
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Skill ID is required for update" }), { status: 400 })
    }
    const updatedSkill = await updateSkill(id, updatedSkillData)
    if (!updatedSkill) {
      return new NextResponse(JSON.stringify({ error: "Skill not found" }), { status: 404 })
    }
    return NextResponse.json(updatedSkill)
  } catch (error) {
    console.error("API Error: Failed to update skill:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to update skill" }), { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const { id }: { id: string } = await request.json()
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Skill ID is required for deletion" }), { status: 400 })
    }
    await deleteSkill(id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("API Error: Failed to delete skill:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to delete skill" }), { status: 500 })
  }
}
