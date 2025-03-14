import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Cyber Security Professional
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Specializing in penetration testing, vulnerability assessment, and security architecture to protect
                digital assets and infrastructure.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/projects">
                <Button size="lg">View Projects</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Me
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gradient-to-br from-primary to-primary-foreground/20 rounded-full flex items-center justify-center">
              <Shield className="w-32 h-32 md:w-48 md:h-48 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

