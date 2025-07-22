import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Vercel
            </Link>
            . The source code is available on{" "}
            <Link
              href={
                process.env.GITHUB_USERNAME
                  ? `https://github.com/${process.env.GITHUB_USERNAME}/cybersecurity-portfolio`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href={process.env.GITHUB_USERNAME ? `https://github.com/${process.env.GITHUB_USERNAME}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                }),
              )}
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <Link href={process.env.LINKEDIN_PROFILE_URL || "#"} target="_blank" rel="noopener noreferrer">
            <div
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                }),
              )}
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </div>
          </Link>
          <Link
            href={`mailto:${process.env.EMAIL_ADDRESS || "info@digitalshield.com"}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                }),
              )}
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  )
}
