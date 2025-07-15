"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Shield, Home, User, Award, Trophy, Code, Mail, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    description: "Welcome & Overview",
  },
  {
    name: "Projects",
    href: "/projects",
    icon: Code,
    description: "Security Tools & Frameworks",
  },
  {
    name: "Skills",
    href: "/skills",
    icon: User,
    description: "Technical Expertise",
  },
  {
    name: "Certifications",
    href: "/certifications",
    icon: Award,
    description: "Professional Credentials",
  },
  {
    name: "CTF Events",
    href: "/ctf",
    icon: Trophy,
    description: "Competition Achievements",
  },
  {
    name: "Contact",
    href: "/contact",
    icon: Mail,
    description: "Get In Touch",
  },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="relative">
            <Shield className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none">CyberSec Portfolio</span>
            <span className="text-xs text-muted-foreground leading-none">Digital Shield Protection</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium ml-8">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 hover:bg-accent hover:text-accent-foreground relative group",
                  active ? "text-primary bg-primary/10 font-semibold" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
                {active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}

                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.description}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Admin Link (Desktop) */}
        <div className="hidden md:flex items-center ml-auto">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/admin">
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-bold text-lg leading-none">CyberSec Portfolio</span>
                      <span className="text-xs text-muted-foreground leading-none">Digital Shield Protection</span>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col space-y-2 py-4 flex-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between p-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground group",
                          active
                            ? "text-primary bg-primary/10 font-semibold"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <div className="flex flex-col">
                            <span>{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.description}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    )
                  })}
                </nav>

                {/* Admin Link (Mobile) */}
                <div className="border-t pt-4">
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 p-3 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin Access</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
