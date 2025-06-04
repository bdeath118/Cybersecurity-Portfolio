import Link from "next/link"
import { Shield, Github, Linkedin, Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">CyberSec Portfolio</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              Professional cybersecurity portfolio showcasing expertise in digital security and threat analysis.
            </p>
            <Link
              href="/admin"
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Admin Dashboard
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Navigation</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-center">
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Projects
              </Link>
              <Link href="/skills" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Skills
              </Link>
              <Link
                href="/certifications"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Certifications
              </Link>
              <Link href="/ctf" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                CTF Events
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Social Links & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Contact</span>
              </Link>
            </div>
            <div className="text-xs text-muted-foreground text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
              <p className="mt-1">Built with security in mind.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
