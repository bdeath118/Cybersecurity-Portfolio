import { HeroSection } from "@/components/hero-section"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { SkillsSection } from "@/components/skills-section"
import { DigitalBadgesSection } from "@/components/digital-badges-section"

export async function generateMetadata() {
  return {
    title: "Cybersecurity Portfolio",
    description: "Professional cybersecurity portfolio showcasing skills, projects, certifications, and achievements.",
    keywords: ["cybersecurity", "portfolio", "ethical hacking", "security", "penetration testing"],
    openGraph: {
      title: "Cybersecurity Portfolio",
      description:
        "Professional cybersecurity portfolio showcasing skills, projects, certifications, and achievements.",
      type: "website",
    },
  }
}

export default function HomePage() {
  const projects = []
  const skills = []
  const digitalBadges = []

  return (
    <main className="container mx-auto px-4 py-8">
      <HeroSection />

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
        <ProjectsShowcase projects={projects.slice(0, 3)} />
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Skills</h2>
        <SkillsSection skills={skills.slice(0, 6)} />
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Digital Badges</h2>
        <DigitalBadgesSection badges={digitalBadges.slice(0, 4)} />
      </div>
    </main>
  )
}
