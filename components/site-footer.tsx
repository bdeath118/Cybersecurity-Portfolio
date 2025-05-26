import Link from "next/link"
import { Shield } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-24">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <span className="font-semibold">CyberSec Portfolio</span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
            Projects
          </Link>
          <Link href="/skills" className="text-sm text-muted-foreground hover:text-foreground">
            Skills
          </Link>
          <Link href="/certifications" className="text-sm text-muted-foreground hover:text-foreground">
            Certifications
          </Link>
          <Link href="/ctf" className="text-sm text-muted-foreground hover:text-foreground">
            CTF Events
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </div>

        <div className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} All rights reserved.</div>
      </div>
    </footer>
  )
}
