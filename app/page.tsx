import { HeroSection } from "@/components/hero-section"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { SkillsSection } from "@/components/skills-section"
import { DigitalBadgesSection } from "@/components/digital-badges-section"
import {
  getSiteInfo,
  getProjects,
  getSkills,
  getCertifications,
  getCTFEvents,
  getDigitalBadges,
  initializeApplication,
} from "@/lib/data"

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
    console.error("Error generating metadata:", error)
    return {
      title: "Cybersecurity Portfolio",
      description:
        "Professional cybersecurity portfolio showcasing skills, projects, certifications, and achievements.",
    }
  }
}

export default async function HomePage() {
  let siteInfo
  let projects = []
  let skills = []
  let certifications = []
  let ctfEvents = []
  let digitalBadges = []

  try {
    await initializeApplication()

    siteInfo = await getSiteInfo()
    projects = await getProjects()
    skills = await getSkills()
    certifications = await getCertifications()
    ctfEvents = await getCTFEvents()
    digitalBadges = await getDigitalBadges()
  } catch (error) {
    console.error("Error loading page data:", error)
    siteInfo = {
      name: "Cybersecurity Professional",
      title: "Cybersecurity Portfolio",
      description: "Welcome to my cybersecurity portfolio showcasing skills, projects, and achievements.",
      email: "contact@example.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      theme: {
        primaryColor: "#3b82f6",
        secondaryColor: "#1e40af",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
      icon: "/images/avatar-photo.jpg",
      backgroundImage: "/images/background.jpeg",
      backgroundOpacity: 80,
    }
  }

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
