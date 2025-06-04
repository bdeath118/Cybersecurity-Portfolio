import { SkillsSection } from "@/components/skills-section"
import { getSkills, getSiteInfo } from "@/lib/data"

export async function generateMetadata() {
  try {
    const siteInfo = await getSiteInfo()
    return {
      title: `Skills | ${siteInfo.name || "Cyber Security Portfolio"}`,
      description: "My cybersecurity skills, expertise areas, and technical proficiencies.",
      openGraph: {
        title: "Cybersecurity Skills",
        description: "My cybersecurity skills, expertise areas, and technical proficiencies.",
      },
    }
  } catch {
    return {
      title: "Skills | Cyber Security Portfolio",
      description: "Cybersecurity skills and technical expertise.",
    }
  }
}

export default async function SkillsPage() {
  try {
    const skills = await getSkills()

    return (
      <div className="container py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h1>
          <p className="text-lg text-muted-foreground mb-8">
            My technical skills and areas of expertise in cybersecurity.
          </p>
          <SkillsSection skills={skills} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading skills:", error)
    return (
      <div className="container py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Skills & Expertise</h1>
          <p className="text-muted-foreground">Unable to load skills at this time.</p>
        </div>
      </div>
    )
  }
}
