import { type NextRequest, NextResponse } from "next/server"
import { readData, writeData } from "@/lib/data"
import type { BugBountyFinding } from "@/lib/types"

export async function GET() {
  try {
    const findings = await readData<BugBountyFinding[]>("bug-bounty.json", [])
    return NextResponse.json(findings)
  } catch (error) {
    console.error("Error fetching bug bounty findings:", error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newFinding: BugBountyFinding = await request.json()
    const findings = await readData<BugBountyFinding[]>("bug-bounty.json", [])

    findings.push(newFinding)
    await writeData("bug-bounty.json", findings)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding bug bounty finding:", error)
    return NextResponse.json({ error: "Failed to add finding" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const findings = await readData<BugBountyFinding[]>("bug-bounty.json", [])

    const updatedFindings = findings.filter((finding) => finding.id !== id)
    await writeData("bug-bounty.json", updatedFindings)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bug bounty finding:", error)
    return NextResponse.json({ error: "Failed to delete finding" }, { status: 500 })
  }
}
