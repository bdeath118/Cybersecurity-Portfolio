import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDigitalBadges } from "@/lib/data"
import Link from "next/link"

export async function DigitalBadgesSection() {
  const badges = await getDigitalBadges()

  if (badges.length === 0) {
    return null
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tighter sm:text-2xl">Digital Badges</h2>
            <p className="max-w-[500px] text-muted-foreground text-sm">Earned credentials and micro-certifications</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-3xl mx-auto">
          {badges.map((badge) => (
            <Card key={badge.id} className="group hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-3 flex flex-col items-center text-center space-y-2">
                <div className="relative w-12 h-12 mb-1">
                  {badge.image ? (
                    <Image
                      src={badge.image || "/placeholder.svg"}
                      alt={badge.name}
                      fill
                      className="object-contain rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 rounded-md flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>

                <h3 className="font-medium text-xs line-clamp-2 leading-tight">{badge.name}</h3>
                <p className="text-xs text-muted-foreground">{badge.issuer}</p>

                <Badge variant="outline" className="text-xs px-1 py-0">
                  {badge.platform}
                </Badge>

                {badge.verificationUrl && (
                  <Link
                    href={badge.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Button variant="ghost" size="sm" className="h-5 px-1 text-xs">
                      <ExternalLink className="h-2 w-2 mr-1" />
                      Verify
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
