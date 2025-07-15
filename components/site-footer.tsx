"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react"
import { getSiteInfo, type SiteInfo } from "@/lib/data"

export function SiteFooter() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)

  useEffect(() => {
    getSiteInfo().then(setSiteInfo)
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CyberSec Portfolio</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional cybersecurity portfolio showcasing expertise in ethical hacking, penetration testing, and
              security consulting.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                Projects
              </Link>
              <Link href="/skills" className="text-muted-foreground hover:text-primary transition-colors">
                Skills
              </Link>
              <Link href="/certifications" className="text-muted-foreground hover:text-primary transition-colors">
                Certifications
              </Link>
              <Link href="/ctf" className="text-muted-foreground hover:text-primary transition-colors">
                CTF Events
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2 text-sm">
              {siteInfo?.email && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${siteInfo.email}`} className="hover:text-primary transition-colors">
                    {siteInfo.email}
                  </a>
                </div>
              )}
              {siteInfo?.location && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{siteInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex space-x-4">
              {siteInfo?.github && (
                <a
                  href={siteInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              )}
              {siteInfo?.linkedin && (
                <a
                  href={siteInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
              {siteInfo?.twitter && (
                <a
                  href={siteInfo.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {siteInfo?.name || "CyberSec Portfolio"}. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
