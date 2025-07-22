import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Mail, Award, Laptop, ShieldCheck, Flag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSiteInfo, getProjects, getSkills, getCertifications, getCTFEvents } from "@/lib/data"

export async function HeroSection() {
  const siteInfo = await getSiteInfo()
  const projects = await getProjects()
  const skills = await getSkills()
  const certifications = await getCertifications()
  const ctfEvents = await getCTFEvents()

  return (
    <section className="relative w-full h-screen flex items-center justify-center text-white overflow-hidden">
      <Image
        src={siteInfo.background_image_url || "/images/background.jpeg"}
        alt="Cybersecurity Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0 brightness-[0.3]"
        priority
      />
      <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Image
            src={siteInfo.avatar_url || "/images/avatar-photo.jpg"}
            alt="Profile Avatar"
            width={160}
            height={160}
            className="rounded-full border-4 border-primary mx-auto shadow-lg"
            priority
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">{siteInfo.site_name}</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 drop-shadow-md">{siteInfo.tagline}</p>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto drop-shadow-sm">
          {siteInfo.description}
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {siteInfo.linkedin_url && (
            <Link href={siteInfo.linkedin_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="text-white border-primary hover:bg-primary/20 bg-transparent">
                <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
              </Button>
            </Link>
          )}
          {siteInfo.github_url && (
            <Link href={siteInfo.github_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="text-white border-primary hover:bg-primary/20 bg-transparent">
                <Github className="mr-2 h-5 w-5" /> GitHub
              </Button>
            </Link>
          )}
          {siteInfo.email && (
            <Link href={`mailto:${siteInfo.email}`}>
              <Button variant="outline" className="text-white border-primary hover:bg-primary/20 bg-transparent">
                <Mail className="mr-2 h-5 w-5" /> Contact Me
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <Card className="bg-card/80 backdrop-blur-sm text-card-foreground border-primary/50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Laptop className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">Showcasing my work</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm text-card-foreground border-primary/50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{skills.length}</div>
              <p className="text-xs text-muted-foreground">Areas of expertise</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm text-card-foreground border-primary/50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certifications</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certifications.length}</div>
              <p className="text-xs text-muted-foreground">Professional achievements</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm text-card-foreground border-primary/50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CTF Events</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ctfEvents.length}</div>
              <p className="text-xs text-muted-foreground">Competitive hacking</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
