import { NextResponse } from "next/server"

// In-memory storage for credentials (in production, use a secure database)
const storedCredentials = {
  linkedin: { clientId: "", clientSecret: "", configured: false },
  credly: { clientId: "", clientSecret: "", configured: false },
  canvas: { clientId: "", clientSecret: "", configured: false },
  ctftime: { clientId: "", clientSecret: "", configured: false },
  hackerone: { clientId: "", clientSecret: "", configured: false },
  bugcrowd: { clientId: "", clientSecret: "", configured: false },
  medium: { clientId: "", clientSecret: "", configured: false },
  shodan: { clientId: "", clientSecret: "", configured: false },
}

// Simple encryption for storing credentials (in production, use proper encryption)
function encryptCredential(value: string): string {
  if (!value) return ""
  try {
    return Buffer.from(value).toString("base64")
  } catch {
    return ""
  }
}

function decryptCredential(value: string): string {
  if (!value) return ""
  try {
    return Buffer.from(value, "base64").toString("utf-8")
  } catch {
    return ""
  }
}

export async function GET() {
  try {
    // Return credentials with client secrets masked for security
    const maskedCredentials = Object.entries(storedCredentials).reduce((acc, [platform, creds]) => {
      acc[platform] = {
        clientId: creds.clientId ? decryptCredential(creds.clientId) : "",
        clientSecret: creds.clientSecret ? "••••••••••••••••" : "",
        configured: creds.configured,
      }
      return acc
    }, {} as any)

    return new NextResponse(JSON.stringify(maskedCredentials), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error in GET /api/admin/credentials:", error)

    // Return default structure on error
    const defaultResponse = {
      linkedin: { clientId: "", clientSecret: "", configured: false },
      credly: { clientId: "", clientSecret: "", configured: false },
      canvas: { clientId: "", clientSecret: "", configured: false },
      ctftime: { clientId: "", clientSecret: "", configured: false },
      hackerone: { clientId: "", clientSecret: "", configured: false },
      bugcrowd: { clientId: "", clientSecret: "", configured: false },
      medium: { clientId: "", clientSecret: "", configured: false },
      shodan: { clientId: "", clientSecret: "", configured: false },
    }

    return new NextResponse(JSON.stringify(defaultResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { platform, clientId, clientSecret } = body

    if (!platform || !clientId || !clientSecret) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const validPlatforms = ["linkedin", "credly", "canvas", "ctftime", "hackerone", "bugcrowd", "medium", "shodan"]
    if (!validPlatforms.includes(platform)) {
      return new NextResponse(JSON.stringify({ error: "Invalid platform" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
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

    return new NextResponse(JSON.stringify(maskedCredentials), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error in POST /api/admin/credentials:", error)

    return new NextResponse(JSON.stringify({ error: "Failed to save credentials" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

// Helper function to get decrypted credentials for use in OAuth flows
export async function getDecryptedCredentials(platform: string) {
  try {
    const creds = storedCredentials[platform as keyof typeof storedCredentials]
    if (!creds || !creds.configured) {
      return null
    }

    return {
      clientId: decryptCredential(creds.clientId),
      clientSecret: decryptCredential(creds.clientSecret),
    }
  } catch (error) {
    console.error("Error getting decrypted credentials:", error)
    return null
  }
}
