"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Download, Mail } from "lucide-react"
import Image from "next/image"
import { DigitalBadgesSection } from "./digital-badges-section"
import { LoadingSpinner } from "./ui/loading-spinner"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export function HeroSection() {
  const [siteInfo, setSiteInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/site-info")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load site information")
        return res.json()
      })
      .then((data) => {
        setSiteInfo(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error loading site info:", error)
        setLoading(false)
        toast({
          title: "Loading Error",
          description: "Some content may not display correctly. Please refresh the page.",
          variant: "destructive",
        })
      })
  }, [toast])

  if (loading) {
    return (
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary tracking-wider uppercase animate-fade-in">
                  Cybersecurity Professional
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight animate-fade-in-up">
                  Securing Digital
                  <span className="block text-primary">Infrastructure</span>
                </h1>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in-up delay-200">
                Passionate about protecting digital assets and building secure systems. Specializing in penetration
                testing, incident response, and security architecture with proven expertise in threat analysis.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-400">
              <Link href="/projects">
                <Button size="lg" className="group min-w-[160px] transition-all hover:scale-105">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              {siteInfo?.resume ? (
                <Button variant="outline" size="lg" asChild className="min-w-[160px] transition-all hover:scale-105">
                  <a href={siteInfo.resume} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </a>
                </Button>
              ) : (
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="min-w-[160px] transition-all hover:scale-105">
                    <Mail className="mr-2 h-4 w-4" />
                    Get In Touch
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Avatar Image */}
          <div className="flex flex-col items-center space-y-8 animate-fade-in-up delay-300">
            <div className="relative">
              <div className="w-72 h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl bg-gradient-to-br from-primary/5 to-secondary/5">
                {!imageLoaded && (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <LoadingSpinner />
                  </div>
                )}
                <Image
                  src="/images/avatar-photo.jpg"
                  alt="Professional headshot"
                  width={320}
                  height={320}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  priority
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageLoaded(true)
                    toast({
                      title: "Image Loading Error",
                      description: "Profile image could not be loaded.",
                      variant: "destructive",
                    })
                  }}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>

            {/* Digital Badges beneath photo */}
            <div className="w-full max-w-md">
              <DigitalBadgesSection />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
