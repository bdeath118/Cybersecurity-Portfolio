import { type NextRequest, NextResponse } from "next/server"
import { readData, writeData } from "@/lib/data"
import type { OSINTCapability } from "@/lib/types"

export async function GET() {
  try {
    const capabilities = await readData<OSINTCapability[]>("osint-capabilities.json", [])
    return NextResponse.json(capabilities)
  } catch (error) {
    console.error("Error fetching OSINT capabilities:", error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newCapability: OSINTCapability = await request.json()
    const capabilities = await readData<OSINTCapability[]>("osint-capabilities.json", [])

    capabilities.push(newCapability)
    await writeData("osint-capabilities.json", capabilities)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding OSINT capability:", error)
    return NextResponse.json({ error: "Failed to add capability" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const capabilities = await readData<OSINTCapability[]>("osint-capabilities.json", [])

    const updatedCapabilities = capabilities.filter((capability) => capability.id !== id)
    await writeData("osint-capabilities.json", updatedCapabilities)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting OSINT capability:", error)
    return NextResponse.json({ error: "Failed to delete capability" }, { status: 500 })
  }
}
