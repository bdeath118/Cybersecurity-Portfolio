"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  Laptop,
  Award,
  Flag,
  ShieldCheck,
  Mail,
  Menu,
  User2,
  Github,
  Linkedin,
  CreditCard,
  Bug,
  BookOpen,
  Search,
  Lock,
  LinkIcon,
  Settings,
  Wrench,
  CloudOff,
  ListChecks,
  CheckCircle,
  Server,
  TestTube,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar" // Assuming sidebar components are available

const mainNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: Laptop,
  },
  {
    title: "Skills",
    href: "/skills",
    icon: ShieldCheck,
  },
  {
    title: "Certifications",
    href: "/certifications",
    icon: Award,
  },
  {
    title: "CTF Events",
    href: "/ctf",
    icon: Flag,
  },
  {
    title: "Digital Badges",
    href: "/digital-badges",
    icon: CreditCard,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
  },
]

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Projects",
    href: "/admin/dashboard/projects",
    icon: Laptop,
  },
  {
    title: "Skills",
    href: "/admin/dashboard/skills",
    icon: ShieldCheck,
  },
  {
    title: "Certifications",
    href: "/admin/dashboard/certifications",
    icon: Award,
  },
  {
    title: "CTF Events",
    href: "/admin/dashboard/ctf",
    icon: Flag,
  },
  {
    title: "Digital Badges",
    href: "/admin/dashboard/digital-badges",
    icon: CreditCard,
  },
  {
    title: "Site Info",
    href: "/admin/dashboard/site-info",
    icon: User2,
  },
  {
    title: "Credentials",
    href: "/admin/dashboard/credentials",
    icon: Lock,
  },
  {
    title: "Integrations",
    href: "/admin/dashboard/integrations",
    icon: LinkIcon,
  },
  {
    title: "Bug Bounty",
    href: "/admin/dashboard/bug-bounty",
    icon: Bug,
  },
  {
    title: "Security Articles",
    href: "/admin/dashboard/security-articles",
    icon: BookOpen,
  },
  {
    title: "OSINT Capabilities",
    href: "/admin/dashboard/osint-capabilities",
    icon: Search,
  },
  {
    title: "Advanced Settings",
    href: "/admin/dashboard/advanced-settings",
    icon: Settings,
  },
  {
    title: "Under Construction",
    href: "/admin/dashboard/under-construction",
    icon: Wrench,
  },
  {
    title: "Fallback Manager",
    href: "/admin/dashboard/fallback-manager",
    icon: CloudOff,
  },
  {
    title: "Testing Checklist",
    href: "/admin/dashboard/testing-checklist",
    icon: ListChecks,
  },
  {
    title: "Site Verification",
    href: "/admin/dashboard/site-verification",
    icon: CheckCircle,
  },
  {
    title: "API Status",
    href: "/admin/dashboard/api-status",
    icon: Server,
  },
  {
    title: "Comprehensive Testing",
    href: "/admin/dashboard/comprehensive-testing",
    icon: TestTube,
  },
  {
    title: "Linked Accounts",
    href: "/admin/dashboard/linked-accounts",
    icon: Users,
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { toggleSidebar, isMobile } = useSidebar() // Use useSidebar hook

  const isHomePage = pathname === "/"
  const isAdminPage = pathname.startsWith("/admin")

  const navItems = isAdminPage ? adminNavItems : mainNavItems

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex h-full flex-col py-4">
                  <div className="flex items-center px-4 pb-4">
                    <Link href="/" className="flex items-center space-x-2">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg">Digital Shield Protection</span>
                    </Link>
                  </div>
                  <Separator className="mb-4" />
                  <nav className="flex flex-col gap-2 px-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto px-4 pt-4">
                    <Separator className="mb-4" />
                    <div className="flex items-center justify-between">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="flex items-center gap-2">
                            <Image
                              src="/images/avatar-photo.jpg"
                              alt="Avatar"
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <span>Profile</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Settings</DropdownMenuItem>
                          <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="flex gap-2">
                        <Link
                          href={process.env.GITHUB_USERNAME ? `https://github.com/${process.env.GITHUB_USERNAME}` : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="icon">
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                          </Button>
                        </Link>
                        <Link href={process.env.LINKEDIN_PROFILE_URL || "#"} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon">
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Desktop Logo and Main Nav */}
          <Link href="/" className="hidden lg:flex items-center space-x-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">Digital Shield Protection</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 ml-6">
            <TooltipProvider delayDuration={0}>
              {mainNavItems.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground",
                        pathname === item.href ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                      {pathname === item.href && (
                        <span className="absolute -bottom-1 left-1/2 h-0.5 w-1/2 -translate-x-1/2 rounded-full bg-primary" />
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{item.title}</TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </div>

        {/* Desktop Right Side - Avatar and Socials */}
        <div className="hidden lg:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Image src="/images/avatar-photo.jpg" alt="Avatar" fill className="rounded-full object-cover" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href={process.env.GITHUB_USERNAME ? `https://github.com/${process.env.GITHUB_USERNAME}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
          <Link href={process.env.LINKEDIN_PROFILE_URL || "#"} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
