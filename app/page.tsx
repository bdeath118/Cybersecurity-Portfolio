import { HeroSection } from "@/components/hero-section"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { SkillsSection } from "@/components/skills-section"
import { DigitalBadgesSection } from "@/components/digital-badges-section"
import { getSiteInfo, getProjects, getSkills, getDigitalBadges } from "@/lib/data"
import { initializeApplication } from "@/lib/init"

export async function generateMetadata() {
  try {
    const siteInfo = await getSiteInfo()
    return {
      title: `${siteInfo.name} - ${siteInfo.title}`,
      description: siteInfo.description,
      keywords: ["cybersecurity", "portfolio", "ethical hacking", "security", "penetration testing"],
      openGraph: {
        title: `${siteInfo.name} - ${siteInfo.title}`,
        description: siteInfo.description,
        type: "website",
      },
    }
  } catch (error) {
    return {
      title: "Cybersecurity Portfolio",
      description:
        "Professional cybersecurity portfolio showcasing skills, projects, certifications, and achievements.",
    }
  }
}

export default async function Home() {
  try {
    await initializeApplication()

    const [siteInfo, projects, skills, digitalBadges] = await Promise.all([
      getSiteInfo(),
      getProjects(),
      getSkills(),
      getDigitalBadges(),
    ])

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
  } catch (error) {
    console.error("Error loading homepage:", error)

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">Cybersecurity Portfolio</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Welcome to my cybersecurity portfolio. Loading content...
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </main>
    )
  }
}
