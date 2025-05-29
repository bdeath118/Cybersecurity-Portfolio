import { type NextRequest, NextResponse } from "next/server"
import { validateSession } from "@/lib/auth"

// In-memory storage for credentials (in production, use a secure database)
const storedCredentials = {
  linkedin: { clientId: "", clientSecret: "", configured: false },
  credly: { clientId: "", clientSecret: "", configured: false },
  canvas: { clientId: "", clientSecret: "", configured: false },
}

// Simple encryption for storing credentials (in production, use proper encryption)
function encryptCredential(value: string): string {
  // This is a simple base64 encoding - in production, use proper encryption
  return Buffer.from(value).toString("base64")
}

function decryptCredential(value: string): string {
  try {
    return Buffer.from(value, "base64").toString("utf-8")
  } catch {
    return ""
  }
}

export async function GET() {
  try {
    // Validate admin session
    const session = await validateSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return credentials with client secrets masked for security
    const maskedCredentials = Object.entries(storedCredentials).reduce((acc, [platform, creds]) => {
      acc[platform] = {
        clientId: creds.clientId ? decryptCredential(creds.clientId) : "",
        clientSecret: creds.clientSecret ? "••••••••••••••••" : "",
        configured: creds.configured,
      }
      return acc
    }, {} as any)

    return NextResponse.json(maskedCredentials)
  } catch (error) {
    console.error("Error fetching credentials:", error)
    return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate admin session
    const session = await validateSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { platform, clientId, clientSecret } = await request.json()

    if (!platform || !clientId || !clientSecret) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["linkedin", "credly", "canvas"].includes(platform)) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 })
    }

    // Store encrypted credentials
    storedCredentials[platform as keyof typeof storedCredentials] = {
      clientId: encryptCredential(clientId),
      clientSecret: encryptCredential(clientSecret),
      configured: true,
    }

    // Return updated credentials (masked)
    const maskedCredentials = Object.entries(storedCredentials).reduce((acc, [platform, creds]) => {
      acc[platform] = {
        clientId: creds.clientId ? decryptCredential(creds.clientId) : "",
        clientSecret: creds.clientSecret ? "••••••••••••••••" : "",
        configured: creds.configured,
      }
      return acc
    }, {} as any)

    return NextResponse.json(maskedCredentials)
  } catch (error) {
    console.error("Error saving credentials:", error)
    return NextResponse.json({ error: "Failed to save credentials" }, { status: 500 })
  }
}

// Helper function to get decrypted credentials for use in OAuth flows
export async function getDecryptedCredentials(platform: string) {
  const creds = storedCredentials[platform as keyof typeof storedCredentials]
  if (!creds || !creds.configured) {
    return null
  }

  return {
    clientId: decryptCredential(creds.clientId),
    clientSecret: decryptCredential(creds.clientSecret),
  }
}
