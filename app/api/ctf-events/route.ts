import { NextResponse } from "next/server"
import { getCTFEvents } from "@/lib/data"

export async function GET() {
  try {
    const events = await getCTFEvents()
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching CTF events:", error)
    return NextResponse.json({ error: "Failed to fetch CTF events" }, { status: 500 })
  }
}
