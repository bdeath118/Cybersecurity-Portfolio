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
    <section className="py-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Digital Credentials</h3>
        <p className="text-sm text-muted-foreground">Verified achievements and certifications</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-w-sm mx-auto">
        {badges.slice(0, 8).map((badge) => (
          <Card
            key={badge.id}
            className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20"
          >
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

              <div className="space-y-1">
                <h4 className="font-medium text-xs line-clamp-2 leading-tight">{badge.name}</h4>
                <p className="text-xs text-muted-foreground">{badge.issuer}</p>
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {badge.platform}
                </Badge>
              </div>

              {badge.verificationUrl && (
                <Link
                  href={badge.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Verify
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {badges.length > 8 && (
        <div className="text-center mt-4">
          <Link href="/digital-badges">
            <Button variant="outline" size="sm">
              View All Badges ({badges.length})
            </Button>
          </Link>
        </div>
      )}
    </section>
  )
}
