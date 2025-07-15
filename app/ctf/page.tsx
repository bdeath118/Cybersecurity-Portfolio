import type { Metadata } from "next"
import { CTFSection } from "@/components/ctf-section"
import { getCTFEvents, getSiteInfo } from "@/lib/data"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteInfo = await getSiteInfo()
    const ctfEvents = await getCTFEvents()

    return {
      title: "CTF Events",
      description: `${siteInfo.name}'s participation in Capture The Flag cybersecurity competitions. ${ctfEvents.length} CTF events showcasing practical security skills.`,
      keywords: [
        "CTF",
        "Capture The Flag",
        "cybersecurity competitions",
        "hacking competitions",
        "security challenges",
      ],
      openGraph: {
        title: `CTF Events | ${siteInfo.name}`,
        description: `Participation in Capture The Flag cybersecurity competitions`,
        type: "website",
        images: [
          {
            url: siteInfo.backgroundImage || "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: "CTF Events",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `CTF Events | ${siteInfo.name}`,
        description: "Participation in Capture The Flag cybersecurity competitions",
        images: [siteInfo.backgroundImage || "/images/background.jpeg"],
      },
      alternates: {
        canonical: "/ctf",
      },
    }
  } catch (error) {
    console.error("Error generating CTF metadata:", error)
    return {
      title: "CTF Events",
      description: "Participation in Capture The Flag cybersecurity competitions",
      keywords: ["CTF", "Capture The Flag", "cybersecurity competitions"],
    }
  }
}

export default async function CTFPage() {
  const events = await getCTFEvents()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">CTF Events</h1>
        <p className="text-lg text-muted-foreground">
          My participation in Capture The Flag cybersecurity competitions and challenges.
        </p>
      </div>
      <CTFSection events={events} />
    </div>
  )
}
