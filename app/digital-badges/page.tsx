import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDigitalBadges } from "@/lib/data"

export async function generateMetadata() {
  return {
    title: "Digital Badges | Cyber Security Portfolio",
    description: "View my digital badges and cybersecurity achievements",
  }
}

export default async function DigitalBadgesPage() {
  const badges = await getDigitalBadges()

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Digital Badges</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Verified achievements and digital credentials
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <Card key={badge.id} className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              {badge.image ? (
                <Image
                  src={badge.image || "/placeholder.svg"}
                  alt={badge.name}
                  width={64}
                  height={64}
                  className="rounded-md"
                />
              ) : (
                <div className="p-2 bg-primary/10 rounded-full">
                  <Award className="h-10 w-10 text-primary" />
                </div>
              )}
              <div>
                <CardTitle className="text-xl">{badge.name}</CardTitle>
                <CardDescription>{badge.issuer}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Issued: {badge.issueDate}</span>
              </div>
              <Badge variant="outline">{badge.category}</Badge>
              <p className="text-muted-foreground">{badge.description}</p>
              {badge.url && (
                <Link href={badge.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Verify Badge
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {badges.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No digital badges yet</h3>
          <p className="text-muted-foreground">Digital badges will appear here once they are added.</p>
        </div>
      )}
    </div>
  )
}
