import { NextResponse } from "next/server"
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/data"
import { isAuthenticated } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import type { Project } from "@/lib/types"

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
    const projects = await getProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error("API Error: Failed to fetch projects:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch projects" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const newProjectData: Omit<Project, "id"> = await request.json()
    const addedProject = await addProject(newProjectData)
    return NextResponse.json(addedProject, { status: 201 })
  } catch (error) {
    console.error("API Error: Failed to add project:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to add project" }), { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const { id, ...updatedProjectData }: Project = await request.json()
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Project ID is required for update" }), { status: 400 })
    }
    const updatedProject = await updateProject(id, updatedProjectData)
    if (!updatedProject) {
      return new NextResponse(JSON.stringify({ error: "Project not found" }), { status: 404 })
    }
    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("API Error: Failed to update project:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to update project" }), { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const { id }: { id: string } = await request.json()
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Project ID is required for deletion" }), { status: 400 })
    }
    await deleteProject(id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("API Error: Failed to delete project:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to delete project" }), { status: 500 })
  }
}
