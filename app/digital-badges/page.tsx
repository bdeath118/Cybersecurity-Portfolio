import type { Metadata } from "next"
import { DigitalBadgesSection } from "@/components/digital-badges-section"
import { getDigitalBadges, getSiteInfo } from "@/lib/data"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteInfo = await getSiteInfo()
    const badges = await getDigitalBadges()

    return {
      title: "Digital Badges",
      description: `${siteInfo.name}'s digital badges and certifications from various platforms. ${badges.length} verified digital credentials from leading technology companies.`,
      keywords: [
        "digital badges",
        "digital certifications",
        "verified credentials",
        "IBM badges",
        "Microsoft badges",
        "AWS badges",
      ],
      openGraph: {
        title: `Digital Badges | ${siteInfo.name}`,
        description: `Digital badges and certifications from various platforms`,
        type: "website",
        images: [
          {
            url: siteInfo.backgroundImage || "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: "Digital Badges",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Digital Badges | ${siteInfo.name}`,
        description: "Digital badges and certifications from various platforms",
        images: [siteInfo.backgroundImage || "/images/background.jpeg"],
      },
      alternates: {
        canonical: "/digital-badges",
      },
    }
  } catch (error) {
    console.error("Error generating digital badges metadata:", error)
    return {
      title: "Digital Badges",
      description: "Digital badges and certifications from various platforms",
      keywords: ["digital badges", "digital certifications", "verified credentials"],
    }
  }
}

export default async function DigitalBadgesPage() {
  const badges = await getDigitalBadges()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Digital Badges</h1>
        <p className="text-lg text-muted-foreground">
          My digital badges and certifications from various technology platforms.
        </p>
      </div>
      <DigitalBadgesSection badges={badges} />
    </div>
  )
}
