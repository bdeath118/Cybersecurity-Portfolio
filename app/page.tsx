import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Award, Code, Flag } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { SkillsSection } from "@/components/skills-section"
import { CertificationsSection } from "@/components/certifications-section"
import { CTFSection } from "@/components/ctf-section"
import { getProjects } from "@/lib/data"

export default async function Home() {
  const featuredProjects = await getProjects(3)

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Cyber Security Expertise</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Specialized in penetration testing, vulnerability assessment, and security architecture
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
              <div className="p-2 bg-primary/10 rounded-full">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Security Analysis</h3>
              <p className="text-center text-muted-foreground">
                Comprehensive vulnerability assessment and penetration testing
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
              <div className="p-2 bg-primary/10 rounded-full">
                <Code className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure Development</h3>
              <p className="text-center text-muted-foreground">Building applications with security-first approach</p>
            </div>

            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
              <div className="p-2 bg-primary/10 rounded-full">
                <Flag className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">CTF Competitions</h3>
              <p className="text-center text-muted-foreground">Active participant in cybersecurity challenges</p>
            </div>

            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
              <div className="p-2 bg-primary/10 rounded-full">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Certifications</h3>
              <p className="text-center text-muted-foreground">Industry-recognized security certifications</p>
            </div>
          </div>
        </div>
      </section>

      <ProjectsShowcase projects={featuredProjects} />

      <SkillsSection />

      <CertificationsSection />

      <CTFSection />

      <section className="py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Connect?</h2>
              <p className="max-w-[600px] md:text-xl/relaxed">
                Let's discuss how my cybersecurity expertise can help secure your organization
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Contact Me
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20"
                >
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

