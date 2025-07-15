"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Shield, Mail, Phone, MapPin, Github, Linkedin, Twitter, ExternalLink, Heart } from "lucide-react"
import { getSiteInfo, type SiteInfo } from "@/lib/data"

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Skills", href: "/skills" },
  { name: "Certifications", href: "/certifications" },
  { name: "CTF Events", href: "/ctf" },
  { name: "Contact", href: "/contact" },
]

const securityServices = [
  "Penetration Testing",
  "Vulnerability Assessment",
  "Security Consulting",
  "Digital Forensics",
  "Incident Response",
  "Security Training",
]

export function SiteFooter() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)

  useEffect(() => {
    getSiteInfo().then(setSiteInfo)
  }, [])

  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">CyberSec Portfolio</span>
                <span className="text-xs text-muted-foreground leading-none">Digital Shield Protection</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground max-w-xs">
              {siteInfo?.description ||
                "Professional cybersecurity services with advanced digital shield protection and ethical hacking expertise."}
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              {siteInfo?.email && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${siteInfo.email}`} className="hover:text-primary transition-colors">
                    {siteInfo.email}
                  </a>
                </div>
              )}
              {siteInfo?.phone && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href={`tel:${siteInfo.phone}`} className="hover:text-primary transition-colors">
                    {siteInfo.phone}
                  </a>
                </div>
              )}
              {siteInfo?.location && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{siteInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Security Services</h3>
            <ul className="space-y-2">
              {securityServices.map((service) => (
                <li key={service}>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Shield className="h-3 w-3 mr-2 text-primary" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Connect</h3>

            {/* Social Links */}
            <div className="flex space-x-2">
              {siteInfo?.github && (
                <Button variant="outline" size="icon" asChild>
                  <a href={siteInfo.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {siteInfo?.linkedin && (
                <Button variant="outline" size="icon" asChild>
                  <a href={siteInfo.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {siteInfo?.twitter && (
                <Button variant="outline" size="icon" asChild>
                  <a href={siteInfo.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Stay updated with the latest cybersecurity insights and digital shield protection techniques.
              </p>
              <Button size="sm" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>
              © {new Date().getFullYear()} {siteInfo?.name || "CyberSec Portfolio"}. All rights reserved.
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for cybersecurity</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
