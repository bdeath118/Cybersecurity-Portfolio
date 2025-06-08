import { type NextRequest, NextResponse } from "next/server"

// Mock data for linked accounts - replace with actual database integration
const mockLinkedAccounts = [
  {
    id: "1",
    platform: "linkedin",
    username: "john.doe",
    email: "john.doe@example.com",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    connectedAt: "2024-01-15T10:30:00Z",
    lastSync: "2024-01-20T14:22:00Z",
    status: "active" as const,
  },
  {
    id: "2",
    platform: "github",
    username: "johndoe",
    email: "john.doe@example.com",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    connectedAt: "2024-01-10T09:15:00Z",
    lastSync: "2024-01-19T16:45:00Z",
    status: "active" as const,
  },
  {
    id: "3",
    platform: "hackerone",
    username: "bdragon118",
    email: "bdragon118@hotmail.com",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    connectedAt: "2024-01-20T11:00:00Z",
    lastSync: "2024-01-20T11:00:00Z",
    status: "active" as const,
  },
]

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would fetch from your database
    // For now, return mock data
    return NextResponse.json(mockLinkedAccounts)
  } catch (error) {
    console.error("Error fetching linked accounts:", error)
    return NextResponse.json({ error: "Failed to fetch linked accounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In a real implementation, you would save to your database
    const newAccount = {
      id: Date.now().toString(),
      ...body,
      connectedAt: new Date().toISOString(),
      status: "active" as const,
    }

    return NextResponse.json(newAccount, { status: 201 })
  } catch (error) {
    console.error("Error creating linked account:", error)
    return NextResponse.json({ error: "Failed to create linked account" }, { status: 500 })
  }
}
