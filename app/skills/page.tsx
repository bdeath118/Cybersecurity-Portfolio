import { SkillsSection } from "@/components/skills-section"
import { getSkills } from "@/lib/data"

export async function generateMetadata() {
  return {
    title: "Skills | Cyber Security Portfolio",
    description: "My cybersecurity skills and technical expertise",
  }
}

export default async function SkillsPage() {
  const skills = await getSkills()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Skills</h1>
      <SkillsSection skills={skills} />
    </div>
  )
}
