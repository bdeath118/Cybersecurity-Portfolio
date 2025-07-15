"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Github, Linkedin, Twitter, Download, Eye } from "lucide-react"
import { getSiteInfo, getPortfolioStats, type SiteInfo } from "@/lib/data"

interface PortfolioStats {
  projectsCount: number
  skillsCount: number
  certificationsCount: number
  ctfEventsCount: number
  featuredProjectsCount: number
}

export function HeroSection() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSiteInfo(), getPortfolioStats()])
      .then(([siteData, statsData]) => {
        setSiteInfo(siteData)
        setStats(statsData)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="relative min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={siteInfo?.background_url || "/images/background.jpeg"}
          alt="Cybersecurity Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Profile Info */}
          <div className="text-center lg:text-left">
            {/* Profile Image */}
            <div className="mb-8 flex justify-center lg:justify-start">
              <div className="relative">
                <Image
                  src={siteInfo?.avatar_url || "/images/avatar-photo.jpg"}
                  alt={siteInfo?.name || "Profile"}
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-primary/20 shadow-2xl"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent" />
              </div>
            </div>

            {/* Name and Title */}
            <div className="mb-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                {siteInfo?.name || "Cybersecurity Professional"}
              </h1>
              <p className="text-xl lg:text-2xl text-primary font-semibold mb-4">
                {siteInfo?.title || "Ethical Hacker & Security Consultant"}
              </p>
              <p className="text-lg text-gray-200 max-w-2xl">
                {siteInfo?.description ||
                  "Passionate about cybersecurity, ethical hacking, and protecting digital assets."}
              </p>
            </div>

            {/* Contact Info */}
            <div className="mb-8 space-y-3">
              {siteInfo?.email && (
                <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-200">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href={`mailto:${siteInfo.email}`} className="hover:text-primary transition-colors">
                    {siteInfo.email}
                  </a>
                </div>
              )}
              {siteInfo?.phone && (
                <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-200">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{siteInfo.phone}</span>
                </div>
              )}
              {siteInfo?.location && (
                <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-200">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{siteInfo.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="mb-8 flex justify-center lg:justify-start space-x-4">
              {siteInfo?.github && (
                <Button variant="outline" size="icon" asChild>
                  <a href={siteInfo.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
              )}
              {siteInfo?.linkedin && (
                <Button variant="outline" size="icon" asChild>
                  <a href={siteInfo.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
              )}
              {siteInfo?.twitter && (
                <Button variant="outline" size="icon" asChild>
                  <a href={siteInfo.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5" />
                  </a>
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link href="/projects">
                  <Eye className="mr-2 h-5 w-5" />
                  View Projects
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </Button>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Portfolio Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stats?.projectsCount || 0}</div>
                    <div className="text-sm text-gray-300">Security Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stats?.certificationsCount || 0}</div>
                    <div className="text-sm text-gray-300">Certifications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stats?.skillsCount || 0}</div>
                    <div className="text-sm text-gray-300">Technical Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stats?.ctfEventsCount || 0}</div>
                    <div className="text-sm text-gray-300">CTF Events</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specializations */}
            <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Penetration Testing</Badge>
                  <Badge variant="secondary">Vulnerability Assessment</Badge>
                  <Badge variant="secondary">Web App Security</Badge>
                  <Badge variant="secondary">Network Security</Badge>
                  <Badge variant="secondary">Ethical Hacking</Badge>
                  <Badge variant="secondary">Security Consulting</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
