import { notFound } from "next/navigation"
import { getCTFEvent } from "@/lib/data"

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const event = await getCTFEvent(params.id)
    return {
      title: `${event.name} | CTF Events`,
      description: event.description,
    }
  } catch (error) {
    return {
      title: "CTF Event | Cyber Security Portfolio",
      description: "View CTF event details",
    }
  }
}

export default async function CTFEventPage({ params }: { params: { id: string } }) {
  const event = await getCTFEvent(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{event.name}</h1>
      {/* CTF event details */}
    </div>
  )
}
