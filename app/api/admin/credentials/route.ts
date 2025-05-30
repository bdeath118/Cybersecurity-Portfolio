import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import crypto from "crypto"

// Define the credentials directory
const CREDENTIALS_DIR = path.join(process.cwd(), "data", "credentials")

// Ensure the credentials directory exists
if (!fs.existsSync(CREDENTIALS_DIR)) {
  try {
    fs.mkdirSync(CREDENTIALS_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating credentials directory:", error)
  }
}

// Encryption key (derived from AUTH_SECRET)
function getEncryptionKey() {
  const secret = process.env.AUTH_SECRET || "development-secret-key-change-in-production"
  return crypto.createHash("sha256").update(String(secret)).digest("base64").substring(0, 32)
}

// Encrypt credentials
function encryptCredentials(data: any) {
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)
    let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex")
    encrypted += cipher.final("hex")
    return {
      iv: iv.toString("hex"),
      data: encrypted,
    }
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt credentials")
  }
}

// Decrypt credentials
function decryptCredentials(encrypted: { iv: string; data: string }) {
  try {
    const key = getEncryptionKey()
    const iv = Buffer.from(encrypted.iv, "hex")
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)
    let decrypted = decipher.update(encrypted.data, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return JSON.parse(decrypted)
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt credentials")
  }
}

// Save encrypted credentials
async function saveCredentials(platform: string, credentials: any) {
  try {
    const filePath = path.join(CREDENTIALS_DIR, `${platform}.json`)
    const encrypted = encryptCredentials(credentials)
    fs.writeFileSync(filePath, JSON.stringify(encrypted, null, 2))
    return true
  } catch (error) {
    console.error(`Error saving ${platform} credentials:`, error)
    return false
  }
}

// Get decrypted credentials
export async function getDecryptedCredentials(platform: string) {
  try {
    const filePath = path.join(CREDENTIALS_DIR, `${platform}.json`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`No credentials file found for ${platform}`)
      return null
    }

    // Read and decrypt
    const fileContent = fs.readFileSync(filePath, "utf8")
    const encrypted = JSON.parse(fileContent)
    return decryptCredentials(encrypted)
  } catch (error) {
    console.error(`Error getting ${platform} credentials:`, error)
    return null
  }
}

// GET handler - Get credentials for a platform
export async function GET(request: NextRequest) {
  try {
    // Skip session validation for now to debug
    // const session = await validateSession()
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Get platform from query params
    const url = new URL(request.url)
    const platform = url.searchParams.get("platform")

    if (!platform) {
      return NextResponse.json(
        { error: "Platform parameter is required" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Get credentials
    const credentials = await getDecryptedCredentials(platform)

    // Return credentials or empty object
    return NextResponse.json(credentials || { configured: false }, {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in GET /api/admin/credentials:", error)
    return NextResponse.json(
      { error: "Failed to get credentials", message: error instanceof Error ? error.message : "Unknown error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// POST handler - Save credentials for a platform
export async function POST(request: NextRequest) {
  try {
    // Skip session validation for now to debug
    // const session = await validateSession()
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Get request body
    const body = await request.json()
    const { platform, credentials } = body

    if (!platform || !credentials) {
      return NextResponse.json(
        { error: "Platform and credentials are required" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Save credentials
    const success = await saveCredentials(platform, credentials)

    if (success) {
      return NextResponse.json(
        { success: true },
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    } else {
      return NextResponse.json(
        { error: "Failed to save credentials" },
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }
  } catch (error) {
    console.error("Error in POST /api/admin/credentials:", error)
    return NextResponse.json(
      { error: "Failed to save credentials", message: error instanceof Error ? error.message : "Unknown error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
