import { DigitalBadgesSection } from "@/components/digital-badges-section"
import { getDigitalBadges } from "@/lib/data"

export async function generateMetadata() {
  return {
    title: "Digital Badges | Cyber Security Portfolio",
    description: "My digital badges and certifications from various platforms",
  }
}

export default async function DigitalBadgesPage() {
  const badges = await getDigitalBadges()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Digital Badges</h1>
      <DigitalBadgesSection badges={badges} />
    </div>
  )
}
