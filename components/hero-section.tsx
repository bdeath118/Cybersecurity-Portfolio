"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  Download,
  Eye,
  Shield,
  Zap,
  Lock,
  Search,
  ArrowRight,
} from "lucide-react"
import { getSiteInfo, getPortfolioStats, type SiteInfo } from "@/lib/data"

interface PortfolioStats {
  projectsCount: number
  skillsCount: number
  certificationsCount: number
  ctfEventsCount: number
  featuredProjectsCount: number
}

const securityFeatures = [
  {
    icon: Shield,
    title: "Digital Shield Protection",
    description: "Advanced cybersecurity defense mechanisms",
  },
  {
    icon: Lock,
    title: "Secure Infrastructure",
    description: "Protecting digital assets and systems",
  },
  {
    icon: Search,
    title: "Threat Detection",
    description: "Proactive security monitoring and analysis",
  },
  {
    icon: Zap,
    title: "Rapid Response",
    description: "Quick incident response and remediation",
  },
]

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
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center space-y-4">
          <div className="h-12 bg-muted rounded w-96 mx-auto"></div>
          <div className="h-6 bg-muted rounded w-64 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-80 mx-auto"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Cybersecurity Theme */}
      <div className="absolute inset-0 z-0">
        <Image
          src={siteInfo?.background_url || "/images/background.jpeg"}
          alt="Cybersecurity Digital Shield Background - Futuristic hand presenting digital shield with padlock"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-ping" />
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-cyan-400 rounded-full animate-bounce" />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-primary rounded-full animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Profile Info */}
          <div className="text-center lg:text-left space-y-8">
            {/* Profile Image */}
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative">
                  <Image
                    src={siteInfo?.avatar_url || "/images/avatar-photo.jpg"}
                    alt={`${siteInfo?.name || "Cybersecurity Professional"} - Professional headshot of young cybersecurity expert`}
                    width={200}
                    height={200}
                    className="rounded-full border-4 border-primary/30 shadow-2xl relative z-10"
                    priority
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent" />
                </div>
              </div>
            </div>

            {/* Name and Title */}
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary-foreground border-primary/30">
                🛡️ Cybersecurity Professional
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                {siteInfo?.name || "Alex Johnson"}
              </h1>

              <p className="text-xl lg:text-2xl text-primary font-semibold">
                {siteInfo?.title || "Cybersecurity Professional & Ethical Hacker"}
              </p>

              <p className="text-lg text-gray-200 max-w-2xl leading-relaxed">
                {siteInfo?.description ||
                  "Specialized in digital shield protection, penetration testing, and securing digital infrastructure. Passionate about ethical hacking and protecting organizations from cyber threats."}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
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
                  <a href={`tel:${siteInfo.phone}`} className="hover:text-primary transition-colors">
                    {siteInfo.phone}
                  </a>
                </div>
              )}
              {siteInfo?.location && (
                <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-200">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{siteInfo.location}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 group">
                <Link href="/projects">
                  <Eye className="mr-2 h-5 w-5" />
                  View Security Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center lg:justify-start space-x-4">
              {siteInfo?.github && (
                <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 hover:text-primary">
                  <a href={siteInfo.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
              )}
              {siteInfo?.linkedin && (
                <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 hover:text-primary">
                  <a href={siteInfo.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
              )}
              {siteInfo?.twitter && (
                <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 hover:text-primary">
                  <a href={siteInfo.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Features */}
          <div className="space-y-6">
            {/* Portfolio Stats */}
            <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
                  <Shield className="h-6 w-6 mr-2 text-primary" />
                  Portfolio Overview
                </h3>
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

            {/* Security Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={index}
                    className="bg-black/40 border-primary/20 backdrop-blur-sm hover:bg-black/50 transition-all duration-300"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm mb-1">{feature.title}</h4>
                          <p className="text-xs text-gray-300">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Specializations */}
            <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Core Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                    Penetration Testing
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                    Digital Forensics
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                    Vulnerability Assessment
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                    Network Security
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                    Ethical Hacking
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                    Incident Response
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                    Security Consulting
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                    Threat Intelligence
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
