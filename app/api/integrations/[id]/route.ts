import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const accountId = params.id

    // In a real implementation, you would delete from your database
    console.log(`Disconnecting account: ${accountId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error disconnecting account:", error)
    return NextResponse.json({ error: "Failed to disconnect account" }, { status: 500 })
  }
}
