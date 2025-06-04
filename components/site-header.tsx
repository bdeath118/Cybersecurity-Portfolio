"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useCustomTheme } from "@/components/custom-theme-provider"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { siteInfo } = useCustomTheme()

  const routes = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/skills", label: "Skills" },
    { href: "/certifications", label: "Certifications" },
    { href: "/ctf", label: "CTF Events" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {siteInfo?.icon ? (
            <Image src={siteInfo.icon || "/placeholder.svg"} alt="Logo" width={28} height={28} className="h-7 w-7" />
          ) : (
            <Shield className="h-7 w-7 text-primary" />
          )}
          <span className="font-bold text-lg">CyberSec Portfolio</span>
        </Link>

        <nav className="hidden md:flex gap-8">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative py-2",
                isActive(route.href)
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-muted-foreground",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-primary/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur border-b shadow-lg p-6 md:hidden">
            <nav className="flex flex-col space-y-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-base font-medium transition-colors hover:text-primary py-2 px-3 rounded-md hover:bg-primary/5",
                    isActive(route.href) ? "text-primary bg-primary/10" : "text-muted-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
