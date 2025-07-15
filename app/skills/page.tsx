import type { Metadata } from "next"
import { SkillsSection } from "@/components/skills-section"
import { getSkills, getSiteInfo } from "@/lib/data"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteInfo = await getSiteInfo()
    const skills = await getSkills()

    return {
      title: "Skills",
      description: `Discover ${siteInfo.name}'s cybersecurity skills and technical expertise. Proficient in ${skills.length} different areas including penetration testing, network security, and vulnerability assessment.`,
      keywords: [
        "cybersecurity skills",
        "technical expertise",
        "penetration testing",
        "network security",
        "vulnerability assessment",
        "security tools",
      ],
      openGraph: {
        title: `Skills | ${siteInfo.name}`,
        description: `Cybersecurity skills and technical expertise`,
        type: "website",
        images: [
          {
            url: siteInfo.backgroundImage || "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: "Cybersecurity Skills",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Skills | ${siteInfo.name}`,
        description: "Cybersecurity skills and technical expertise",
        images: [siteInfo.backgroundImage || "/images/background.jpeg"],
      },
      alternates: {
        canonical: "/skills",
      },
    }
  } catch (error) {
    console.error("Error generating skills metadata:", error)
    return {
      title: "Skills",
      description: "Cybersecurity skills and technical expertise",
      keywords: ["cybersecurity skills", "technical expertise", "penetration testing"],
    }
  }
}

export default async function SkillsPage() {
  const skills = await getSkills()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Skills</h1>
        <p className="text-lg text-muted-foreground">
          My cybersecurity skills and technical expertise across various domains.
        </p>
      </div>
      <SkillsSection skills={skills} />
    </div>
  )
}
