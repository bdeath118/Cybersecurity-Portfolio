import { HeroSection } from "@/components/hero-section"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { SkillsSection } from "@/components/skills-section"
import { DigitalBadgesSection } from "@/components/digital-badges-section"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <HeroSection />
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
        <ProjectsShowcase featured={true} limit={3} />
      </div>
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Skills</h2>
        <SkillsSection limit={6} />
      </div>
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Digital Badges</h2>
        <DigitalBadgesSection limit={4} />
      </div>
    </main>
  )
}
