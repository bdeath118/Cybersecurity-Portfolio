import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCTFEvent, getSiteInfo } from "@/lib/data"

interface CTFEventPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: CTFEventPageProps): Promise<Metadata> {
  try {
    const event = await getCTFEvent(params.id)
    const siteInfo = await getSiteInfo()

    if (!event) {
      return {
        title: "CTF Event Not Found",
        description: "The requested CTF event could not be found",
      }
    }

    return {
      title: event.name,
      description: event.description || `CTF event: ${event.name} - ${event.placement}`,
      keywords: ["CTF", event.name, "Capture The Flag", "cybersecurity competition", ...event.challenges],
      openGraph: {
        title: `${event.name} | ${siteInfo.name}`,
        description: event.description || `CTF event: ${event.name} - ${event.placement}`,
        type: "article",
        publishedTime: event.date,
        authors: [siteInfo.name],
        tags: ["CTF", ...event.challenges],
        images: [
          {
            url: siteInfo.backgroundImage || "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: event.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: event.name,
        description: event.description || `CTF event: ${event.name} - ${event.placement}`,
        images: [siteInfo.backgroundImage || "/images/background.jpeg"],
      },
      alternates: {
        canonical: `/ctf/${params.id}`,
      },
    }
  } catch (error) {
    console.error("Error generating CTF event metadata:", error)
    return {
      title: "CTF Event",
      description: "View CTF event details",
    }
  }
}

export default async function CTFEventPage({ params }: CTFEventPageProps) {
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
