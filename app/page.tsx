import { HeroSection } from "@/components/hero-section"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { SkillsSection } from "@/components/skills-section"
import { CertificationsSection } from "@/components/certifications-section"
import { CTFSection } from "@/components/ctf-section"
import { DigitalBadgesSection } from "@/components/digital-badges-section"

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <section id="projects" className="py-16 md:py-24 bg-secondary/20">
        <div className="container">
          <ProjectsShowcase />
        </div>
      </section>
      <section id="skills" className="py-16 md:py-24 bg-background">
        <div className="container">
          <SkillsSection />
        </div>
      </section>
      <section id="certifications" className="py-16 md:py-24 bg-secondary/20">
        <div className="container">
          <CertificationsSection />
        </div>
      </section>
      <section id="ctf-events" className="py-16 md:py-24 bg-background">
        <div className="container">
          <CTFSection />
        </div>
      </section>
      <section id="digital-badges" className="py-16 md:py-24 bg-secondary/20">
        <div className="container">
          <DigitalBadgesSection />
        </div>
      </section>
    </main>
  )
}
