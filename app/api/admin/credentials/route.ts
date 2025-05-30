import { NextResponse } from "next/server"

// Simple in-memory storage for credentials (in production, use a secure database)
const storedCredentials = new Map<string, any>()

// Initialize with empty credentials for all platforms
const platforms = ["linkedin", "credly", "canvas", "ctftime", "hackerone", "bugcrowd", "medium", "shodan"]
platforms.forEach((platform) => {
  if (!storedCredentials.has(platform)) {
    storedCredentials.set(platform, {
      clientId: "",
      clientSecret: "",
      configured: false,
    })
  }
})

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
    console.log("GET /api/admin/credentials - Fetching all credentials")

    // Return credentials with client secrets masked for security
    const maskedCredentials: Record<string, any> = {}

    platforms.forEach((platform) => {
      const creds = storedCredentials.get(platform) || { clientId: "", clientSecret: "", configured: false }
      maskedCredentials[platform] = {
        clientId: creds.clientId ? decryptCredential(creds.clientId) : "",
        clientSecret: creds.clientSecret ? "••••••••••••••••" : "",
        configured: creds.configured && creds.clientId && creds.clientSecret,
      }
    })

    console.log("Returning credentials for platforms:", Object.keys(maskedCredentials))

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
    const defaultResponse: Record<string, any> = {}
    platforms.forEach((platform) => {
      defaultResponse[platform] = { clientId: "", clientSecret: "", configured: false }
    })

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

    console.log(`POST /api/admin/credentials - Saving credentials for ${platform}`)

    if (!platform || !clientId || !clientSecret) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    if (!platforms.includes(platform)) {
      return new NextResponse(JSON.stringify({ error: "Invalid platform" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // Store encrypted credentials
    storedCredentials.set(platform, {
      clientId: encryptCredential(clientId),
      clientSecret: encryptCredential(clientSecret),
      configured: true,
    })

    console.log(`Credentials saved for ${platform}`)

    // Return updated credentials (masked)
    const maskedCredentials: Record<string, any> = {}
    platforms.forEach((p) => {
      const creds = storedCredentials.get(p) || { clientId: "", clientSecret: "", configured: false }
      maskedCredentials[p] = {
        clientId: creds.clientId ? decryptCredential(creds.clientId) : "",
        clientSecret: creds.clientSecret ? "••••••••••••••••" : "",
        configured: creds.configured && creds.clientId && creds.clientSecret,
      }
    })

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
    console.log(`Getting decrypted credentials for ${platform}`)

    const creds = storedCredentials.get(platform)
    if (!creds || !creds.configured) {
      console.log(`No credentials found for ${platform} or not configured`)
      return null
    }

    const decrypted = {
      clientId: decryptCredential(creds.clientId),
      clientSecret: decryptCredential(creds.clientSecret),
    }

    console.log(`Credentials found for ${platform}:`, {
      clientId: decrypted.clientId ? "Present" : "Missing",
      clientSecret: decrypted.clientSecret ? "Present" : "Missing",
    })

    return decrypted
  } catch (error) {
    console.error(`Error getting decrypted credentials for ${platform}:`, error)
    return null
  }
}
